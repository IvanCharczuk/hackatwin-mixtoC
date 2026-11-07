// Modo demo: sin NEXT_PUBLIC_PRIVY_APP_ID (o con NEXT_PUBLIC_MOCK=1) la app corre
// con una wallet simulada. Los saldos se leen de verdad en Arbitrum para
// MOCK_ADDRESS; las transferencias no salen a la red, se simulan.
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
export const MOCK = !PRIVY_APP_ID || process.env.NEXT_PUBLIC_MOCK === "1";
export const MOCK_ADDRESS = (process.env.NEXT_PUBLIC_MOCK_ADDRESS ??
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") as `0x${string}`;
