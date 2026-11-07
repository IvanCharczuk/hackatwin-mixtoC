// ponytail: direcciones acá hasta que exista packages/comun (cambios ahí van por PR).
// Siempre red + dirección: la misma dirección es otro token en otra chain.
import { erc20Abi } from "viem";

export const CHAIN_ID = 42161; // Arbitrum
export const RPC = process.env.NEXT_PUBLIC_RPC_ARBITRUM ?? "https://arb1.arbitrum.io/rpc";
export const EXPLORER_TX = "https://arbiscan.io/tx/";

export const TOKENS = {
  ARGt: { address: "0x59863989d080B22476DB95656d0C3CC18be92214", decimals: 18 },
  CHLt: { address: "0xe8dbC4680235cCAeFf48e4C0B0EaceeBb89E5e17", decimals: 18 },
  USDT0: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6 },
} as const satisfies Record<string, { address: `0x${string}`; decimals: number }>;

export type TokenKey = keyof typeof TOKENS;
export const TOKEN_KEYS = Object.keys(TOKENS) as TokenKey[];
export { erc20Abi };
