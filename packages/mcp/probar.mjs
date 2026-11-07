// Prueba de humo del MCP: metadatos OAuth, registro dinámico, /authorize con
// PKCE (la página de Privy carga) y /mcp sin token (401).
// Uso: node probar.mjs [http://localhost:8788]
const base = (process.argv[2] ?? "http://localhost:8788").replace(/\/$/, "");
let fallas = 0;
const check = (ok, nombre, detalle = "") => {
	console.log(`${ok ? "OK  " : "MAL "} ${nombre}${detalle ? `: ${detalle}` : ""}`);
	if (!ok) fallas++;
};

const as = await fetch(`${base}/.well-known/oauth-authorization-server`).then((r) => r.json());
check(!!as.authorization_endpoint && !!as.token_endpoint && !!as.registration_endpoint, "oauth-authorization-server", `${as.authorization_endpoint} | ${as.registration_endpoint}`);
check((as.code_challenge_methods_supported ?? []).includes("S256"), "PKCE S256");

const pr = await fetch(`${base}/.well-known/oauth-protected-resource/mcp`).then((r) => r.json());
check(pr.resource === `${base}/mcp`, "oauth-protected-resource", `resource=${pr.resource}`);

const sinToken = await fetch(`${base}/mcp`, {
	method: "POST",
	headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
	body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
});
const www = sinToken.headers.get("www-authenticate") ?? "";
check(sinToken.status === 401 && www.includes("resource_metadata="), "/mcp sin token", `${sinToken.status} ${www}`);

const reg = await fetch(as.registration_endpoint, {
	method: "POST",
	headers: { "content-type": "application/json" },
	body: JSON.stringify({
		client_name: "Prueba Mixto C",
		redirect_uris: ["http://localhost:6274/oauth/callback"],
		grant_types: ["authorization_code", "refresh_token"],
		response_types: ["code"],
		token_endpoint_auth_method: "none",
	}),
});
const cliente = await reg.json();
check(reg.status === 201 && !!cliente.client_id, "registro dinámico", `${reg.status} client_id=${cliente.client_id}`);

const verifier = crypto.randomUUID() + crypto.randomUUID();
const challenge = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))).toString("base64url");
const url = new URL(as.authorization_endpoint);
url.search = new URLSearchParams({
	response_type: "code",
	client_id: cliente.client_id,
	redirect_uri: "http://localhost:6274/oauth/callback",
	code_challenge: challenge,
	code_challenge_method: "S256",
	state: "xyz",
	resource: `${base}/mcp`,
}).toString();
const auth = await fetch(url, { redirect: "manual" });
const html = await auth.text();
const cookie = auth.headers.get("set-cookie") ?? "";
check(auth.status === 200 && html.includes("window.__MIXTOC__") && html.includes("Prueba Mixto C"), "/authorize sirve el login de Privy", `${auth.status}, cookie ${cookie.split("=")[0]}`);
const js = html.match(/src="(\/login\/assets\/[^"]+\.js)"/)?.[1];
if (js) {
	const r = await fetch(`${base}${js}`);
	check(r.ok && (await r.text()).length > 1000, "bundle de la página", `${js} ${r.status}`);
} else check(false, "bundle de la página", "no encontré el <script>");

const handle = html.match(/"handle":"([^"]+)"/)?.[1];
const cb = await fetch(`${base}/callback`, {
	method: "POST",
	headers: { "content-type": "application/json", cookie: cookie.split(";")[0] },
	body: JSON.stringify({ handle, token: "no-es-un-jwt" }),
});
check(cb.status === 401, "/callback rechaza un token de Privy falso", `${cb.status} ${(await cb.text()).slice(0, 120)}`);

console.log(fallas ? `\n${fallas} chequeo(s) fallaron` : "\nTodo en verde");
process.exit(fallas ? 1 : 0);
