// uso: npm run -w packages/fork probar -- <wallet-fondeada> <proveedor> [--colateral 10] [--pedido 5000]
// Corre el circuito en el servidor de prueba: deja USDT0 de colateral en Morpho y
// pide ARGt que le llega directo al proveedor. Plata de mentira; sólo 127.0.0.1.
import { createPublicClient, createTestClient, createWalletClient, http, parseAbi, parseUnits, formatUnits, getAddress } from "viem";
import { arbitrum } from "viem/chains";

const RPC = process.env.FORK_RPC_URL || "http://127.0.0.1:8545";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+/.test(RPC)) {
  console.error(`probar: sólo corre contra el servidor de prueba local, no contra ${RPC}`);
  process.exit(2);
}

const MORPHO = "0x6c247b1F6182318877311737BaC0844bAa518F5e";
const USDT0 = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const ARGT = "0x59863989d080B22476DB95656d0C3CC18be92214";
const PARAMS = {
  loanToken: ARGT,
  collateralToken: USDT0,
  oracle: "0x6581149982980CA25a17e51840dEFE11B1519580",
  irm: "0x66F30587FB8D4206918deb78ecA7d5eBbafD06DA",
  lltv: 770000000000000000n,
} as const;
const ID = "0x83b1866f744b5113866619cd85aba571c1344a92c69fa354a16a8cacbe99c35c";

const T = "(address loanToken, address collateralToken, address oracle, address irm, uint256 lltv)";
const morpho = parseAbi([
  `function supplyCollateral(${T} marketParams, uint256 assets, address onBehalf, bytes data)`,
  `function borrow(${T} marketParams, uint256 assets, uint256 shares, address onBehalf, address receiver) returns (uint256, uint256)`,
  "function position(bytes32 id, address user) view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral)",
]);
const erc20 = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
]);

const args = process.argv.slice(2);
const [w, p] = args.filter((a) => a.startsWith("0x"));
if (!w || !p) {
  console.error("uso: probar <wallet-fondeada> <proveedor> [--colateral 10] [--pedido 5000]");
  process.exit(2);
}
const opt = (n: string, d: string) => (args.indexOf(`--${n}`) >= 0 ? args[args.indexOf(`--${n}`) + 1] : d);
const empresa = getAddress(w);
const proveedor = getAddress(p);
const colateral = parseUnits(opt("colateral", "10"), 6);
const pedido = parseUnits(opt("pedido", "5000"), 18);

const pub = createPublicClient({ chain: arbitrum, transport: http(RPC) });
const test = createTestClient({ chain: arbitrum, mode: "hardhat", transport: http(RPC) });
if ((await pub.getChainId().catch(() => null)) !== 42161) {
  console.error("probar: no encuentro el servidor de prueba. Corré antes: npm run -w packages/fork node");
  process.exit(1);
}
await test.impersonateAccount({ address: empresa });
const wc = createWalletClient({ account: empresa, chain: arbitrum, transport: http(RPC) });

const paso = async (nombre: string, f: () => Promise<`0x${string}`>) => {
  const hash = await f();
  const r = await pub.waitForTransactionReceipt({ hash });
  console.log(`${r.status === "success" ? "ok " : "MAL"} ${nombre}: ${hash}`);
  if (r.status !== "success") process.exit(1);
};

const antes = await pub.readContract({ address: ARGT, abi: erc20, functionName: "balanceOf", args: [proveedor] });
await paso("approve USDT0 → Morpho", () => wc.writeContract({ address: USDT0, abi: erc20, functionName: "approve", args: [MORPHO, colateral] }));
await paso("supplyCollateral", () => wc.writeContract({ address: MORPHO, abi: morpho, functionName: "supplyCollateral", args: [PARAMS, colateral, empresa, "0x"] }));
await paso("borrow ARGt → proveedor", () => wc.writeContract({ address: MORPHO, abi: morpho, functionName: "borrow", args: [PARAMS, pedido, 0n, empresa, proveedor] }));
await test.stopImpersonatingAccount({ address: empresa });

const despues = await pub.readContract({ address: ARGT, abi: erc20, functionName: "balanceOf", args: [proveedor] });
const [, borrowShares, coll] = await pub.readContract({ address: MORPHO, abi: morpho, functionName: "position", args: [ID, empresa] });
console.log(`Proveedor recibió ${formatUnits(despues - antes, 18)} ARGt.`);
console.log(`Posición de la empresa: colateral ${formatUnits(coll, 6)} USDT0, deuda en shares ${borrowShares}.`);
