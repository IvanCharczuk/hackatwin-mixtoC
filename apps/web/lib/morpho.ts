// ponytail: direcciones y ABIs del circuito acá hasta que packages/circuito los exporte
// (packages/circuito/SPEC.md). Cuando existan chequear/planear/ejecutar, este archivo se cambia
// por imports de ahí y los componentes no se enteran.
import { parseAbi } from "viem";
import { TOKENS } from "@/lib/tokens";

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
