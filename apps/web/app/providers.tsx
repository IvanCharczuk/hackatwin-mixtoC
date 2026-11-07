"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { WagmiProvider as PlainWagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum } from "viem/chains";
import { mockWagmiConfig, wagmiConfig } from "@/lib/wagmi";
import { MOCK, PRIVY_APP_ID } from "@/lib/mock";
import { MockAuth, PrivyAuth } from "@/lib/auth";
import { LangProvider } from "@/lib/i18n";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return <LangProvider><Inner>{children}</Inner></LangProvider>;
}

function Inner({ children }: { children: React.ReactNode }) {
  if (MOCK || !PRIVY_APP_ID) {
    return (
      <PlainWagmiProvider config={mockWagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <MockAuth>{children}</MockAuth>
        </QueryClientProvider>
      </PlainWagmiProvider>
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
        <WagmiProvider config={wagmiConfig}>
          <PrivyAuth>{children}</PrivyAuth>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
