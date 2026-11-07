// Servidor de prueba: copia local de Arbitrum One (mismos contratos de Twin,
// Morpho y Curve), con plata de mentira. Nada de lo que pasa acá toca la red real.
const url = process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc";

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  networks: {
    hardhat: {
      // Mismo chainId que Arbitrum para que la web (wagmi) y el agente no cambien nada.
      chainId: 42161,
      forking: { url },
      mining: { auto: true },
    },
  },
};
