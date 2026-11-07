// Página de login del MCP: entrar con Privy y autorizar al cliente MCP.
// El Worker la sirve en /authorize con window.__MIXTOC__ (app id de Privy,
// handle del consentimiento y a quién se le da acceso).
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { arbitrum } from "viem/chains";

type Datos = { appId: string; handle: string; cliente: string; destino: string; destinoLocal: boolean };

declare global {
	interface Window {
		__MIXTOC__?: Datos;
	}
}

function Autorizar({ datos }: { datos: Datos }) {
	const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
	const [estado, setEstado] = useState<"listo" | "enviando" | "redirigiendo">("listo");
	const [error, setError] = useState<string | null>(null);
	const [esperoWallet, setEsperoWallet] = useState(true);
	const wallet = user?.wallet?.address ?? null;

	// La wallet embebida se crea justo después del login: le damos unos segundos.
	useEffect(() => {
		if (!authenticated) return;
		setEsperoWallet(true);
		const t = setTimeout(() => setEsperoWallet(false), 8000);
		return () => clearTimeout(t);
	}, [authenticated]);

	async function autorizar() {
		setEstado("enviando");
		setError(null);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Privy no devolvió un token. Volvé a entrar.");
			const r = await fetch("/callback", {
				method: "POST",
				headers: { "content-type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({ handle: datos.handle, token }),
			});
			const j = (await r.json()) as { redirectTo?: string; error?: string };
			if (!r.ok || !j.redirectTo) throw new Error(j.error ?? `Error ${r.status}`);
			setEstado("redirigiendo");
			window.location.href = j.redirectTo;
		} catch (e) {
			setError((e as Error).message);
			setEstado("listo");
		}
	}

	// "Claude Code (mixtoc)" se lee mejor como "Claude Code".
	const app = datos.cliente.replace(/\s*\(.*\)\s*$/, "") || datos.cliente;
	const avisoLocal = datos.destinoLocal ? <p className="pie">Seguí sólo si abriste {app} en esta compu.</p> : null;

	if (!ready) return <p className="cargando">Cargando…</p>;

	if (!authenticated) {
		return (
			<>
				<h1>Conectar {app}</h1>
				<p>Entrá con tu cuenta de Saltar.</p>
				<button onClick={login}>Entrar</button>
				{avisoLocal}
			</>
		);
	}

	const nombre = user?.google?.email ?? user?.email?.address ?? user?.google?.name ?? (wallet ? corta(wallet) : "Tu cuenta");
	const ocupado = estado !== "listo";
	return (
		<>
			<h1>Conectar {app}</h1>
			<p>Va a poder ver tus saldos y tu posición. No puede mover tu plata.</p>
			<p className="cuenta">
				<span>{nombre}</span>
				<button className="link" onClick={logout} disabled={ocupado}>
					Cambiar
				</button>
			</p>
			{!wallet && !esperoWallet ? <p className="aviso">Tu cuenta todavía no tiene wallet.</p> : null}
			{error ? <p className="aviso">{error}</p> : null}
			<button onClick={autorizar} disabled={ocupado || (!wallet && esperoWallet)}>
				{estado === "listo" ? "Conectar" : estado === "enviando" ? "Conectando…" : "Volviendo a tu app…"}
			</button>
			{avisoLocal}
		</>
	);
}

/** 0xB036…B2f3 */
function corta(direccion: string): string {
	return `${direccion.slice(0, 6)}…${direccion.slice(-4)}`;
}

function App() {
	const datos = window.__MIXTOC__;
	if (!datos) {
		return (
			<>
				<h1>Saltar para tu asistente</h1>
				<p>Esta página se abre sola cuando conectás el MCP desde Claude, Claude Code o Cursor.</p>
			</>
		);
	}
	return (
		<PrivyProvider
			appId={datos.appId}
			config={{
				// Misma app de Privy que apps/web, donde Google ya está habilitado.
				loginMethods: ["google", "email", "wallet"],
				defaultChain: arbitrum,
				supportedChains: [arbitrum],
				embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
			}}
		>
			<Autorizar datos={datos} />
		</PrivyProvider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);
