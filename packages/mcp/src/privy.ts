// Verificación del token de Privy y lectura de la wallet del usuario.
// El token de acceso de Privy es un JWT ES256 firmado con la clave de la app:
// https://docs.privy.io/authentication/user-authentication/access-tokens
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function claves(appId: string) {
	let set = jwks.get(appId);
	if (!set) {
		set = createRemoteJWKSet(new URL(`https://auth.privy.io/api/v1/apps/${appId}/jwks.json`));
		jwks.set(appId, set);
	}
	return set;
}

/** Valida firma, emisor (privy.io), audiencia (el app id) y vencimiento. Devuelve el id del usuario (did:privy:...). */
export async function verificarToken(token: string, appId: string): Promise<string> {
	const { payload } = await jwtVerify(token, claves(appId), {
		issuer: "privy.io",
		audience: appId,
		algorithms: ["ES256"],
	});
	if (!payload.sub) throw new Error("El token de Privy no trae usuario (sub).");
	return payload.sub;
}

type CuentaVinculada = {
	type: string;
	address?: string;
	chain_type?: string;
	wallet_client_type?: string;
	connector_type?: string;
	email?: string;
};

export type UsuarioPrivy = {
	privyUserId: string;
	wallet: string | null;
	walletTipo: "embebida" | "externa" | null;
	email: string | null;
};

/** Lee el usuario con la API REST de Privy (app id + secreto) y elige su wallet EVM: primero la embebida, si no la externa. */
export async function leerUsuario(privyUserId: string, appId: string, secreto: string): Promise<UsuarioPrivy> {
	const r = await fetch(`https://auth.privy.io/api/v1/users/${encodeURIComponent(privyUserId)}`, {
		headers: {
			authorization: `Basic ${btoa(`${appId}:${secreto}`)}`,
			"privy-app-id": appId,
		},
	});
	if (!r.ok) throw new Error(`Privy respondió ${r.status} al leer el usuario.`);
	const u = (await r.json()) as { linked_accounts?: CuentaVinculada[] };
	const cuentas = u.linked_accounts ?? [];
	const wallets = cuentas.filter((c) => c.type === "wallet" && c.address && (c.chain_type ?? "ethereum") === "ethereum");
	const embebida = wallets.find((w) => w.wallet_client_type === "privy" || w.connector_type === "embedded");
	const elegida = embebida ?? wallets[0];
	const email = cuentas.find((c) => c.type === "email")?.address ?? cuentas.find((c) => c.email)?.email ?? null;
	return {
		privyUserId,
		wallet: elegida?.address ?? null,
		walletTipo: elegida ? (elegida === embebida ? "embebida" : "externa") : null,
		email,
	};
}
