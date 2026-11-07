// MCP remoto de Mixto C en Cloudflare Workers. OAuth 2.1 con registro
// dinámico de clientes (lo que piden Claude, Claude Code y Cursor para
// agregarlo por URL); el login es Privy.
import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { createMcpHandler, getMcpAuthContext } from "agents/mcp/server";
import { env } from "cloudflare:workers";
import { crearServidor } from "./herramientas";
import { loginHandler } from "./login";
import type { Env, Props } from "./tipos";

const mcpHandler = createMcpHandler(() =>
	crearServidor(env as unknown as Env, getMcpAuthContext()?.props as Props | undefined),
);

export default new OAuthProvider<Env>({
	apiRoute: "/mcp",
	apiHandler: {
		fetch(request: Request, bindings: Env, ctx: ExecutionContext) {
			return mcpHandler(request, bindings, ctx);
		},
	},
	defaultHandler: loginHandler as any,
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
	resourceMetadata: { resource: (env as unknown as Env).MCP_RESOURCE },
});
