// Copia de apps/web/lib/morpho.ts y apps/web/lib/credito.ts (código de Franco).
// La web usa alias `@/lib`, así que acá se copia en vez de importar. Si cambia
// allá, hay que traer el cambio. Sólo LEE la cadena y ARMA calldata: nunca firma
// ni manda transacciones (regla 4 de AGENTS.md). La persona firma en la web.
import { encodeFunctionData, erc20Abi, formatUnits, parseAbi, parseUnits, type Hex, type PublicClient } from "viem";
import { TOKENS as TOKENS_AGENTE } from "../../agente/src/direcciones";

const TOKENS = TOKENS_AGENTE as { [K in keyof typeof TOKENS_AGENTE]: { address: `0x${string}`; decimals: number } };

export const MORPHO = "0x6c247b1F6182318877311737BaC0844bAa518F5e" as const;
export const POOL_CHLT_USDT0 = "0xa087f05ecd245476d7844f6eab28d98724696ac2" as const;

// Mercado ARGt (préstamo) contra USDT0 (garantía) en Morpho Blue, Arbitrum.
export const MARKET_ID = "0x83b1866f744b5113866619cd85aba571c1344a92c69fa354a16a8cacbe99c35c" as const;
export const MARKET_PARAMS = {
  loanToken: TOKENS.ARGt.address,
  collateralToken: TOKENS.USDT0.address,
  oracle: "0x6581149982980CA25a17e51840dEFE11B1519580",
  irm: "0x66F30587FB8D4206918deb78ecA7d5eBbafD06DA",
  lltv: 770000000000000000n,
} as const;

// Límites del circuito: pedimos hasta 60 % del colateral; Morpho liquida en 77 % (LLTV).
export const TOPE = 0.6;
export const LIQUIDA = 0.77;
export const GAS_MINIMO_ETH = 0.0005;

const PARAMS = "(address loanToken,address collateralToken,address oracle,address irm,uint256 lltv)";
const MARKET = "(uint128 totalSupplyAssets,uint128 totalSupplyShares,uint128 totalBorrowAssets,uint128 totalBorrowShares,uint128 lastUpdate,uint128 fee)";

export const morphoAbi = parseAbi([
  `function market(bytes32 id) view returns ${MARKET}`,
  "function position(bytes32 id, address user) view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral)",
  `function supplyCollateral(${PARAMS} marketParams, uint256 assets, address onBehalf, bytes data)`,
  `function borrow(${PARAMS} marketParams, uint256 assets, uint256 shares, address onBehalf, address receiver) returns (uint256, uint256)`,
  `function repay(${PARAMS} marketParams, uint256 assets, uint256 shares, address onBehalf, bytes data) returns (uint256, uint256)`,
  `function withdrawCollateral(${PARAMS} marketParams, uint256 assets, address onBehalf, address receiver)`,
  "event SupplyCollateral(bytes32 indexed id, address indexed caller, address indexed onBehalf, uint256 assets)",
  "event Borrow(bytes32 indexed id, address caller, address indexed onBehalf, address indexed receiver, uint256 assets, uint256 shares)",
  "event Repay(bytes32 indexed id, address indexed caller, address indexed onBehalf, uint256 assets, uint256 shares)",
  "event WithdrawCollateral(bytes32 indexed id, address caller, address indexed onBehalf, address indexed receiver, uint256 assets)",
]);

export const irmAbi = parseAbi([`function borrowRateView(${PARAMS} marketParams, ${MARKET} market) view returns (uint256)`]);
export const oracleAbi = parseAbi(["function price() view returns (uint256)"]);
export const curveAbi = parseAbi([
  "function get_dy(uint256 i, uint256 j, uint256 dx) view returns (uint256)",
  "function balances(uint256 i) view returns (uint256)",
  "function price_oracle() view returns (uint256)",
  "function exchange(uint256 i, uint256 j, uint256 dx, uint256 min_dy) returns (uint256)",
]);

// ---------- Lectura del crédito y chequeos (copia de credito.ts) ----------

const WAD = 10n ** 18n;
const ORACLE_SCALE = 10n ** 36n;
const SEGUNDOS_POR_ANO = 31_536_000;
const num = (v: bigint, decimals: number) => Number(formatUnits(v, decimals));

export type Credito = {
  /** true = números del ejemplo de la SPEC (NEXT_PUBLIC_MOCK_POSITION=1), no de la cadena. */
  ilustrativo: boolean;
  tienePosicion: boolean;
  garantiaUsdt0: number;
  garantiaEnArgt: number;
  /** CHLt que equivalen a la garantía al precio del pool de Curve (≈). */
  chltCongelado: number;
  deudaArgt: number;
  ltv: number;
  disponibleArgt: number;
  liquidezArgt: number;
  /** Comisión anual efectiva del mercado, leída del IRM. null si no se pudo leer. */
  comisionAnual: number | null;
  argtPorUsdt0: number;
  /** Crudos para armar las transacciones de repago y retiro. */
  raw: { collateral: bigint; borrowShares: bigint; deuda: bigint };
};

// Morpho SharesMathLib: shares → assets redondeando hacia arriba (shares virtuales 1e6).
function toAssetsUp(shares: bigint, totalAssets: bigint, totalShares: bigint) {
  const top = shares * (totalAssets + 1n);
  const den = totalShares + 1_000_000n;
  return (top + den - 1n) / den;
}

// Morpho MathLib.wTaylorCompounded: e^(r·t) − 1 con tres términos, en WAD.
function taylor(rate: bigint, elapsed: bigint) {
  const first = rate * elapsed;
  const second = (first * first) / (2n * WAD);
  const third = (second * first) / (3n * WAD);
  return first + second + third;
}

export async function leerCredito(client: PublicClient, wallet: `0x${string}`): Promise<Credito> {
  const [market, position, price, chltPorUsdt0] = await Promise.all([
    client.readContract({ address: MORPHO, abi: morphoAbi, functionName: "market", args: [MARKET_ID] }),
    client.readContract({ address: MORPHO, abi: morphoAbi, functionName: "position", args: [MARKET_ID, wallet] }),
    client.readContract({ address: MARKET_PARAMS.oracle, abi: oracleAbi, functionName: "price" }),
    client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "price_oracle" }),
  ]);
  const [totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee] = market;
  const [, borrowShares, collateral] = position;

  let rate: bigint | null = null;
  try {
    rate = await client.readContract({
      address: MARKET_PARAMS.irm,
      abi: irmAbi,
      functionName: "borrowRateView",
      args: [MARKET_PARAMS, { totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee }],
    });
  } catch {
    rate = null;
  }

  // El market() guarda totales al último update; sumamos la comisión corrida desde entonces.
  const elapsed = BigInt(Math.max(0, Math.floor(Date.now() / 1000) - Number(lastUpdate)));
  const interes = rate ? (totalBorrowAssets * taylor(rate, elapsed)) / WAD : 0n;
  const deuda = toAssetsUp(borrowShares, totalBorrowAssets + interes, totalBorrowShares);
  const garantiaEnArgtRaw = (collateral * price) / ORACLE_SCALE;

  const garantiaEnArgt = num(garantiaEnArgtRaw, 18);
  const deudaArgt = num(deuda, 18);
  const liquidezArgt = num(totalSupplyAssets - totalBorrowAssets, 18);
  const garantiaUsdt0 = num(collateral, 6);

  return {
    ilustrativo: false,
    tienePosicion: collateral > 0n || borrowShares > 0n,
    garantiaUsdt0,
    garantiaEnArgt,
    chltCongelado: garantiaUsdt0 * num(chltPorUsdt0, 18),
    deudaArgt,
    ltv: garantiaEnArgt > 0 ? deudaArgt / garantiaEnArgt : 0,
    disponibleArgt: Math.min(Math.max(0, garantiaEnArgt * TOPE - deudaArgt), liquidezArgt),
    liquidezArgt,
    comisionAnual: rate === null ? null : Math.expm1(num(rate, 18) * SEGUNDOS_POR_ANO),
    argtPorUsdt0: num((10n ** 6n * price) / ORACLE_SCALE, 18),
    raw: { collateral, borrowShares, deuda },
  };
}


// ---------- Chequeos y plan ----------

export type Chequeo = { id: "C1" | "C2" | "C3" | "C4" | "C5" | "C6"; titulo: string; ok: boolean; detalle: string };
export type Paso = { id: string; titulo: string; detalle: string; tx: { to: `0x${string}`; data: Hex } };
export type Resultado = { ok: boolean; chequeos: Chequeo[]; pasos: Paso[] };

const fmt = (n: number, d = 0) => n.toLocaleString("es-AR", { maximumFractionDigits: d, minimumFractionDigits: d });

const approve = (spender: `0x${string}`, monto: bigint) =>
  encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [spender, monto] });

export async function chequear(
  client: PublicClient,
  wallet: `0x${string}`,
  credito: Credito,
  chlt: number,
  argt: number,
  // ponytail: Morpho manda el ARGt prestado a `receiver`; así le pagamos directo al proveedor (BNPL).
  pagarA: `0x${string}` = wallet,
): Promise<Resultado> {
  const dx = parseUnits(String(chlt), 18);
  const argtRaw = parseUnits(String(argt), 18);
  const [saldoChlt, eth, dy, poolUsdt0, po, allowChlt, allowUsdt0] = await Promise.all([
    client.readContract({ address: TOKENS.CHLt.address, abi: erc20Abi, functionName: "balanceOf", args: [wallet] }),
    client.getBalance({ address: wallet }),
    dx > 0n
      ? client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "get_dy", args: [0n, 1n, dx] })
      : Promise.resolve(0n),
    client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "balances", args: [1n] }),
    client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "price_oracle" }),
    client.readContract({ address: TOKENS.CHLt.address, abi: erc20Abi, functionName: "allowance", args: [wallet, POOL_CHLT_USDT0] }),
    client.readContract({ address: TOKENS.USDT0.address, abi: erc20Abi, functionName: "allowance", args: [wallet, MORPHO] }),
  ]);

  const minDy = (dy * 99n) / 100n;
  const usdt0 = num(dy, 6);
  const esperado = po > 0n ? num((dx * 10n ** 6n) / po, 6) : 0;
  const impacto = esperado > 0 ? 1 - usdt0 / esperado : 1;
  const nuevaGarantia = num(minDy, 6) * credito.argtPorUsdt0;
  const tope = (credito.garantiaEnArgt + nuevaGarantia) * TOPE;
  const deudaNueva = credito.deudaArgt + argt;
  const faltaChlt = chlt - num(saldoChlt, 18);
  const ethNum = num(eth, 18);
  const aprobaciones = Number(allowChlt < dx) + Number(allowUsdt0 < minDy);

  const chequeos: Chequeo[] = [
    {
      id: "C1",
      titulo: "Tenés los CHLt",
      ok: faltaChlt <= 0,
      detalle: faltaChlt <= 0 ? `${fmt(num(saldoChlt, 18))} CHLt en tu wallet` : `Te faltan ${fmt(faltaChlt)} CHLt`,
    },
    {
      id: "C2",
      titulo: "Hay gas para firmar",
      ok: ethNum >= GAS_MINIMO_ETH,
      detalle: ethNum >= GAS_MINIMO_ETH ? `${fmt(ethNum, 4)} ETH en Arbitrum` : `Te faltan ${fmt(GAS_MINIMO_ETH - ethNum, 4)} ETH en Arbitrum`,
    },
    {
      id: "C3",
      titulo: "El cambio a USDT0 rinde",
      ok: poolUsdt0 >= dy * 2n && impacto < 0.03 && dy > 0n,
      detalle: `Recibís ${fmt(usdt0, 2)} USDT0, impacto ${fmt(Math.max(0, impacto) * 100, 1)} %`,
    },
    {
      id: "C4",
      titulo: "Hay fondos para financiarte",
      ok: credito.liquidezArgt >= argt * 1.1,
      detalle: `${fmt(credito.liquidezArgt)} ARGt disponibles en Morpho`,
    },
    {
      id: "C5",
      titulo: "Entra en tu límite",
      ok: deudaNueva <= tope,
      detalle:
        deudaNueva <= tope
          ? `Tu saldo queda en ${fmt(deudaNueva)} de un límite de ${fmt(tope)} ARGt`
          : `Te pasás por ${fmt(deudaNueva - tope)} ARGt: tu límite es ${fmt(tope)}`,
    },
    {
      id: "C6",
      titulo: "Permisos de los tokens",
      ok: true,
      detalle: aprobaciones === 0 ? "Ya están dados" : `Se suma${aprobaciones > 1 ? "n" : ""} ${aprobaciones} ${aprobaciones > 1 ? "aprobaciones" : "aprobación"} al plan`,
    },
  ];

  const pasos: Paso[] = [];
  if (allowChlt < dx)
    pasos.push({ id: "approve-chlt", titulo: "Aprobar CHLt", detalle: `Permite al pool de Curve usar ${fmt(chlt)} CHLt`, tx: { to: TOKENS.CHLt.address, data: approve(POOL_CHLT_USDT0, dx) } });
  pasos.push({ id: "exchange", titulo: "Pasar tus CHLt a dólares", detalle: `Cambia ${fmt(chlt)} CHLt por al menos ${fmt(num(minDy, 6), 2)} USDT0`, tx: { to: POOL_CHLT_USDT0, data: encodeFunctionData({ abi: curveAbi, functionName: "exchange", args: [0n, 1n, dx, minDy] }) } });
  if (allowUsdt0 < minDy)
    pasos.push({ id: "approve-usdt0", titulo: "Aprobar USDT0", detalle: "Permite a Morpho tomar tu respaldo", tx: { to: TOKENS.USDT0.address, data: approve(MORPHO, minDy) } });
  pasos.push({ id: "supply", titulo: "Dejar tu respaldo", detalle: `${fmt(num(minDy, 6), 2)} USDT0 quedan en Morpho a tu nombre`, tx: { to: MORPHO, data: encodeFunctionData({ abi: morphoAbi, functionName: "supplyCollateral", args: [MARKET_PARAMS, minDy, wallet, "0x"] }) } });
  const aProveedor = pagarA.toLowerCase() !== wallet.toLowerCase();
  pasos.push({ id: "borrow", titulo: aProveedor ? "Pagarle a tu proveedor" : "Recibir ARGt", detalle: aProveedor ? `${fmt(argt)} ARGt van a ${pagarA.slice(0, 6)}…${pagarA.slice(-4)}, el saldo queda a tu nombre` : `${fmt(argt)} ARGt llegan a tu wallet`, tx: { to: MORPHO, data: encodeFunctionData({ abi: morphoAbi, functionName: "borrow", args: [MARKET_PARAMS, argtRaw, 0n, wallet, pagarA] }) } });

  return { ok: chequeos.every((c) => c.ok), chequeos, pasos };
}

/** Repago entero por shares (cierra la deuda con la comisión corrida), pasos 6 y 7 de la SPEC. */
export function planRepago(credito: Credito, wallet: `0x${string}`): Paso[] {
  const margen = (credito.raw.deuda * 101n) / 100n;
  return [
    { id: "approve-argt", titulo: "Aprobar ARGt", detalle: `Permite a Morpho cobrar hasta ${fmt(num(margen, 18), 2)} ARGt`, tx: { to: TOKENS.ARGt.address, data: approve(MORPHO, margen) } },
    { id: "repay", titulo: "Pagar tu saldo", detalle: `Cancelás ${fmt(credito.deudaArgt, 2)} ARGt, costo de financiación incluido`, tx: { to: MORPHO, data: encodeFunctionData({ abi: morphoAbi, functionName: "repay", args: [MARKET_PARAMS, 0n, credito.raw.borrowShares, wallet, "0x"] }) } },
  ];
}

/** Retiro de la garantía, paso 8 de la SPEC. Solo con la deuda en cero. */
export function planRecuperar(credito: Credito, wallet: `0x${string}`): Paso[] {
  return [
    { id: "withdraw", titulo: "Liberar tu respaldo", detalle: `${fmt(credito.garantiaUsdt0, 2)} USDT0 vuelven a tu wallet`, tx: { to: MORPHO, data: encodeFunctionData({ abi: morphoAbi, functionName: "withdrawCollateral", args: [MARKET_PARAMS, credito.raw.collateral, wallet, wallet] }) } },
  ];
}
