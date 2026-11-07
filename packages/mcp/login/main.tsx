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

	const avisoLocal = datos.destinoLocal ? (
		<p className="aviso-local">
			<span aria-hidden>i</span>
			Se conecta con una app de esta compu. Seguí sólo si la abriste vos.
		</p>
	) : null;

	if (!ready) return <p className="cargando">Cargando…</p>;

	if (!authenticated) {
		return (
			<>
				<p className="eyebrow">Conectar asistente</p>
				<h1>Entrá a Saltar</h1>
				<p>
					Para que <b>{datos.cliente}</b> pueda ver tu cuenta, primero entrá con tu usuario de Saltar.
				</p>
				{avisoLocal}
				<button onClick={login}>Entrar</button>
			</>
		);
	}

	const nombre = user?.google?.email ?? user?.email?.address ?? user?.google?.name ?? (wallet ? corta(wallet) : "Tu cuenta");
	const inicial = nombre.replace(/^0x/, "").charAt(0).toUpperCase();
	const ocupado = estado !== "listo";
	return (
		<>
			<p className="eyebrow">Conectar asistente</p>
			<h1>¿Conectar {datos.cliente} a tu cuenta?</h1>

			<div className="cuenta">
				<span className="avatar" aria-hidden>{inicial}</span>
				<span className="cuenta-texto">
					<b>{nombre}</b>
					<small>
						{wallet ? `Wallet ${corta(wallet)}` : esperoWallet ? "Creando tu wallet…" : "Todavía sin wallet"}
					</small>
				</span>
				<button className="link" onClick={logout} disabled={ocupado}>
					Cambiar
				</button>
			</div>

			<p className="titulo-lista">Va a poder</p>
			<ul className="lista">
				<li className="si">Ver tus saldos de ARGt, CHLt y USDT0</li>
				<li className="si">Ver tu garantía y lo que debés</li>
				<li className="si">Calcular cuánto ARGt podés pedir</li>
			</ul>
			<p className="titulo-lista">No va a poder</p>
			<ul className="lista">
				<li className="no">Mover tu plata ni firmar nada</li>
			</ul>

			{!wallet && !esperoWallet ? (
				<p className="aviso">Tu cuenta todavía no tiene wallet, así que no va a ver saldos.</p>
			) : null}
			{avisoLocal}
			{error ? <p className="aviso">{error}</p> : null}
			<button onClick={autorizar} disabled={ocupado || (!wallet && esperoWallet)}>
				{estado === "listo" ? "Conectar" : estado === "enviando" ? "Conectando…" : "Volviendo a tu app…"}
			</button>
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
