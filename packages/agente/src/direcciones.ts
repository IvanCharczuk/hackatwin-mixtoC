// Arbitrum One (42161). Mismas direcciones que packages/circuito/SPEC.md y
// docs/investigacion/twin-stack.md. Siempre red y dirección juntas.
export const CHAIN_ID = 42161;

export const TOKENS = {
  ARGt: { address: "0x59863989d080B22476DB95656d0C3CC18be92214", decimals: 18 },
  CHLt: { address: "0xe8dbC4680235cCAeFf48e4C0B0EaceeBb89E5e17", decimals: 18 },
  USDT0: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6 },
} as const;

export const MORPHO_BLUE = "0x6c247b1F6182318877311737BaC0844bAa518F5e";

/** Mercado ARGt (préstamo) contra USDT0 (colateral). */
export const MERCADO_ARGT_USDT0 = {
  id: "0x83b1866f744b5113866619cd85aba571c1344a92c69fa354a16a8cacbe99c35c",
  oracle: "0x6581149982980CA25a17e51840dEFE11B1519580",
  lltv: 0.77,
} as const;

export const RPC_DEFAULT = "https://arb1.arbitrum.io/rpc";
