// Login del OAuth: /authorize sirve la página de Privy (que es también la
// pantalla de consentimiento) y /callback recibe el token de Privy, lo valida
// y completa la autorización para el cliente MCP.
import { Hono } from "hono";
import { leerUsuario, verificarToken } from "./privy";
import type { EnvConOAuth, Props } from "./tipos";

const app = new Hono<{ Bindings: EnvConOAuth }>();

/** JSON seguro para meter dentro de un <script>. */
function jsonEnScript(v: unknown): string {
	return JSON.stringify(v).replace(/</g, "\\u003c");
}

app.get("/", (c) => {
	const mcp = new URL("/mcp", c.req.url).href;
	return c.text(
		`MCP de Mixto C (HackaTwin). Login con Privy.\n\nAgregalo en Claude como conector personalizado con esta URL:\n${mcp}\n`,
	);
});

app.get("/authorize", async (c) => {
	let pedido;
	try {
		pedido = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
	} catch (e) {
		return c.text(`Pedido de autorización inválido: ${(e as Error).message}`, 400);
	}
	if (!pedido.clientId) return c.text("Falta client_id.", 400);

	const consentimiento = await c.env.OAUTH_PROVIDER.describeConsent(pedido);
	const { handle, headers } = await c.env.OAUTH_PROVIDER.beginConsent(pedido);

	const pagina = await c.env.ASSETS.fetch(new URL("/login/", c.req.url));
	if (!pagina.ok) return c.text("No está compilada la página de login (npm run build).", 500);
	const datos = {
		appId: c.env.PRIVY_APP_ID,
		handle,
		cliente: consentimiento.clientName,
		destino: consentimiento.redirectHost,
		destinoLocal: consentimiento.redirectIsLoopback,
	};
	const html = (await pagina.text()).replace(
		"</head>",
		`<script>window.__MIXTOC__=${jsonEnScript(datos)}</script></head>`,
	);
	headers.set("content-type", "text/html; charset=utf-8");
	return new Response(html, { status: 200, headers });
});

app.post("/callback", async (c) => {
	let cuerpo: { handle?: unknown; token?: unknown };
	try {
		cuerpo = await c.req.json();
	} catch {
		return c.json({ error: "Cuerpo inválido: se espera JSON con handle y token." }, 400);
	}
	const { handle, token } = cuerpo;
	if (typeof handle !== "string" || typeof token !== "string") {
		return c.json({ error: "Faltan handle o token." }, 400);
	}

	// Primero el token de Privy: si falla, el consentimiento sigue vivo y se puede reintentar.
	let props: Props;
	try {
		const privyUserId = await verificarToken(token, c.env.PRIVY_APP_ID);
		props = await leerUsuario(privyUserId, c.env.PRIVY_APP_ID, c.env.PRIVY_APP_SECRET);
	} catch (e) {
		return c.json({ error: `No pudimos validar el login de Privy: ${(e as Error).message}` }, 401);
	}

	try {
		const aprobado = await c.env.OAUTH_PROVIDER.approveConsent(c.req.raw, handle);
		const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
			request: aprobado.request,
			// El proveedor OAuth no acepta ":" en el userId: did:privy:abc queda abc.
			userId: props.privyUserId.replace(/^did:privy:/, "").replace(/:/g, "_"),
			metadata: { label: props.email ?? props.wallet ?? props.privyUserId },
			scope: aprobado.request.scope,
			props,
		});
		const headers = new Headers(aprobado.headers);
		headers.set("content-type", "application/json");
		return new Response(JSON.stringify({ redirectTo }), { status: 200, headers });
	} catch (e) {
		return c.json({ error: `No se pudo completar la autorización: ${(e as Error).message}` }, 400);
	}
});

export { app as loginHandler };
