import { createConfig } from "@privy-io/wagmi";
import { createConfig as createPlainConfig } from "wagmi";
import { mock } from "wagmi/connectors";
import { http } from "viem";
import { arbitrum } from "viem/chains";
import { RPC } from "@/lib/tokens";
import { MOCK_ADDRESS } from "@/lib/mock";

export const wagmiConfig = createConfig({
  chains: [arbitrum],
  transports: { [arbitrum.id]: http(RPC) },
});

// Modo demo: wagmi sin Privy, con un conector que simula la wallet.
export const mockConnector = mock({ accounts: [MOCK_ADDRESS] });
export const mockWagmiConfig = createPlainConfig({
  chains: [arbitrum],
  connectors: [mockConnector],
  transports: { [arbitrum.id]: http(RPC) },
  ssr: true,
});
