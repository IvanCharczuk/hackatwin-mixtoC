import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";

export interface Env {
	OAUTH_KV: KVNamespace;
	ASSETS: Fetcher;
	/** URL pública del MCP (termina en /mcp). Cada token queda atado a ella. */
	MCP_RESOURCE: string;
	ARBITRUM_RPC_URL?: string;
	PRIVY_APP_ID: string;
	PRIVY_APP_SECRET: string;
}

export type EnvConOAuth = Env & { OAUTH_PROVIDER: OAuthHelpers };

/** Lo que viaja (cifrado) dentro de cada token y reciben las herramientas. */
export type Props = {
	privyUserId: string;
	wallet: string | null;
	walletTipo: "embebida" | "externa" | null;
	email: string | null;
};
