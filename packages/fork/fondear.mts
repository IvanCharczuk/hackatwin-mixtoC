// uso: npm run -w packages/fork fondear -- <wallet> [--usdt0 50] [--chlt 50000] [--argt 0] [--eth 1] [--desbloquear]
// Le carga plata DE MENTIRA a una wallet en el servidor de prueba (127.0.0.1:8545).
// Se niega a correr contra cualquier otra URL: nunca toca la red real.
import { createPublicClient, createTestClient, createWalletClient, http, parseAbi, parseUnits, parseEther, formatUnits, getAddress } from "viem";
import { arbitrum } from "viem/chains";

const RPC = process.env.FORK_RPC_URL || "http://127.0.0.1:8545";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+/.test(RPC)) {
  console.error(`fondear: sólo corre contra el servidor de prueba local, no contra ${RPC}`);
  process.exit(2);
}

// Tokens en Arbitrum y quién tiene saldo para "prestar" en la copia local.
const TOKENS = {
  USDT0: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6, ballena: "0x6c247b1F6182318877311737BaC0844bAa518F5e" }, // Morpho Blue
  CHLt: { address: "0xe8dbC4680235cCAeFf48e4C0B0EaceeBb89E5e17", decimals: 18, ballena: "0xb5cd19e8e884e8e0e6dD8eDF54C172BD865A7BAd" }, // vault Morpho CHLt
  ARGt: { address: "0x59863989d080B22476DB95656d0C3CC18be92214", decimals: 18, ballena: "0x9Dd3F844747AB78d616BF76DB92756E17A064aDD" }, // vault Morpho ARGt
} as const;
type Token = keyof typeof TOKENS;

const erc20 = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

const args = process.argv.slice(2);
const wallet = args.find((a) => a.startsWith("0x"));
if (!wallet) {
  console.error("uso: fondear <wallet> [--usdt0 50] [--chlt 50000] [--argt 0] [--eth 1]");
  process.exit(2);
}
const opt = (n: string, def: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : def;
};
const destino = getAddress(wallet);
const montos: Record<Token, string> = { USDT0: opt("usdt0", "50"), CHLt: opt("chlt", "50000"), ARGt: opt("argt", "0") };

const pub = createPublicClient({ chain: arbitrum, transport: http(RPC) });
const test = createTestClient({ chain: arbitrum, mode: "hardhat", transport: http(RPC) });

const chainId = await pub.getChainId().catch(() => null);
if (chainId !== 42161) {
  console.error("fondear: no encuentro el servidor de prueba en " + RPC + ". Corré antes: npm run -w packages/fork node");
  process.exit(1);
}

await test.setBalance({ address: destino, value: parseEther(opt("eth", "1")) });
console.log(`ETH (gas de mentira): ${opt("eth", "1")}`);

for (const t of Object.keys(TOKENS) as Token[]) {
  const monto = montos[t];
  if (!monto || Number(monto) <= 0) continue;
  const { address, decimals, ballena } = TOKENS[t];
  await test.impersonateAccount({ address: ballena });
  await test.setBalance({ address: ballena, value: parseEther("1") });
  const w = createWalletClient({ account: ballena, chain: arbitrum, transport: http(RPC) });
  const hash = await w.writeContract({ address, abi: erc20, functionName: "transfer", args: [destino, parseUnits(monto, decimals)] });
  await pub.waitForTransactionReceipt({ hash });
  await test.stopImpersonatingAccount({ address: ballena });
  const saldo = await pub.readContract({ address, abi: erc20, functionName: "balanceOf", args: [destino] });
  console.log(`${t}: ${formatUnits(saldo, decimals)} (tx de prueba ${hash.slice(0, 10)}…)`);
}
if (args.includes("--desbloquear")) {
  // El servidor de prueba firma por esta wallet: la web en modo demo (sin Privy) puede mandar transacciones reales a la copia local.
  await test.impersonateAccount({ address: destino });
  console.log("Desbloqueada: el servidor de prueba acepta eth_sendTransaction desde esta wallet sin clave.");
}
console.log(`Listo: ${destino} tiene plata de mentira en el servidor de prueba.`);
