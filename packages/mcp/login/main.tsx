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

	const quien = (
		<p>
			<b>{datos.cliente}</b> quiere leer tu cuenta de Saltar. El acceso se envía a <b>{datos.destino}</b>.
		</p>
	);
	const avisoLocal = datos.destinoLocal ? (
		<p className="aviso">Va a una app de tu compu (localhost). Seguí sólo si la abriste vos.</p>
	) : null;

	if (!ready) return <p>Cargando Privy…</p>;

	if (!authenticated) {
		return (
			<>
				<p className="eyebrow">Conectar asistente</p>
				<h1>Entrá a Saltar</h1>
				{quien}
				{avisoLocal}
				<button onClick={login}>Entrar con Privy</button>
			</>
		);
	}

	const email = user?.email?.address ?? null;
	return (
		<>
			<p className="eyebrow">Conectar asistente</p>
				<h1>Autorizar acceso</h1>
			{quien}
			{avisoLocal}
			<p>
				Entraste como <b>{email ?? user?.id}</b>
				{wallet ? (
					<>
						{" "}con la wallet <code>{wallet}</code>
					</>
				) : null}
				.
			</p>
			{!wallet && esperoWallet ? <p>Creando tu wallet…</p> : null}
			{!wallet && !esperoWallet ? <p className="aviso">Tu usuario no tiene wallet todavía: las herramientas de saldos no van a andar.</p> : null}
			<p className="nota">Sólo lectura: ve tus saldos y tu posición, pero no firma ni manda transacciones.</p>
			{error ? <p className="aviso">{error}</p> : null}
			<button onClick={autorizar} disabled={estado !== "listo" || (!wallet && esperoWallet)}>
				{estado === "listo" ? `Autorizar a ${datos.cliente}` : estado === "enviando" ? "Autorizando…" : "Volviendo a tu app…"}
			</button>
			<button className="secundario" onClick={logout} disabled={estado !== "listo"}>
				Usar otra cuenta
			</button>
		</>
	);
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
