"use client";

// Una sola forma de preguntar "¿quién está adentro?", con Privy o en modo demo.
import { createContext, useContext } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { mockConnector } from "@/lib/wagmi";

type Auth = { ready: boolean; authenticated: boolean; login: () => void; logout: () => void; mock: boolean };

const AuthContext = createContext<Auth | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth fuera de <Providers>");
  return auth;
}

export function PrivyAuth({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login, logout } = usePrivy();
  return (
    <AuthContext.Provider value={{ ready, authenticated, login, logout: () => void logout(), mock: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function MockAuth({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <AuthContext.Provider
      value={{
        ready: true,
        authenticated: isConnected,
        login: () => connect({ connector: mockConnector }),
        logout: () => disconnect(),
        mock: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
