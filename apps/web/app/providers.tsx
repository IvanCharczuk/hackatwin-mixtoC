"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum } from "viem/chains";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  // ponytail: sin app id no se monta Privy, así el build estático no rompe.
  if (!PRIVY_APP_ID) {
    return (
      <main className="p-6 text-sm">
        Falta <code>NEXT_PUBLIC_PRIVY_APP_ID</code> en <code>apps/web/.env</code>.
      </main>
    );
  }
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google"],
        defaultChain: arbitrum,
        supportedChains: [arbitrum],
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
