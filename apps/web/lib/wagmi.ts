import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { arbitrum } from "viem/chains";
import { RPC } from "@/lib/tokens";

export const wagmiConfig = createConfig({
  chains: [arbitrum],
  transports: { [arbitrum.id]: http(RPC) },
});
