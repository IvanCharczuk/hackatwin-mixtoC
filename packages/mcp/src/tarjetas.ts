// Tarjetas interactivas para Claude con MCP Apps (extensión de UI de MCP).
// Una herramienta declara `_meta.ui.resourceUri` apuntando a un recurso `ui://`
// con mimeType `text/html;profile=mcp-app`; el cliente dibuja ese HTML en un
// iframe y le pasa el resultado de la herramienta por postMessage (JSON-RPC:
// `ui/initialize`, `ui/notifications/tool-result`, `ui/open-link`).
// Spec: https://github.com/modelcontextprotocol/ext-apps (protocolo 2026-01-26).
// Cada tarjeta es un solo HTML sin dependencias. Abierta fuera de un cliente
// MCP (en un navegador) se dibuja con datos de muestra.
import type { McpServer } from "@modelcontextprotocol/server";

export const UI_CUANTO = "ui://saltarg/cuanto-puedo-pedir.html";
export const UI_PLAN = "ui://saltarg/preparar-adelanto.html";
export const MIME_APP = "text/html;profile=mcp-app";

/** `_meta` para la herramienta: la clave nueva y la vieja (`ui/resourceUri`) que todavía leen algunos clientes. */
export const metaUi = (uri: string) => ({ ui: { resourceUri: uri }, "ui/resourceUri": uri });

const CSP = { resourceDomains: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"] };

export function registrarTarjetas(server: McpServer) {
	const recurso = (nombre: string, uri: string, titulo: string, html: string) =>
		server.registerResource(
			nombre,
			uri,
			{ title: titulo, mimeType: MIME_APP, _meta: { ui: { csp: CSP, prefersBorder: false } } },
			async () => ({
				contents: [{ uri, mimeType: MIME_APP, text: html, _meta: { ui: { csp: CSP, prefersBorder: false } } }],
			}),
		);
	recurso("tarjeta_cuanto_puedo_pedir", UI_CUANTO, "Saltar: cuánto podés pedir", TARJETA_CUANTO);
	recurso("tarjeta_preparar_adelanto", UI_PLAN, "Saltar: plan del adelanto", TARJETA_PLAN);
}

// ---------------------------------------------------------------------------
// Muestras (para ver la tarjeta en un navegador y para la vista previa).

export const MUESTRA_CUANTO = {
	wallet: "0x7a3B9c2e41F0d8a5E6b1C4f9A2d3E8b7C6a5F401",
	bcra: {
		ok: true,
		simulado: true,
		denominacion: "ANDES LOGÍSTICA SPA (sucursal Argentina)",
		situacionMax: 1,
		deudaTotalArs: 18_400_000,
		entidades: 2,
		chequesRechazados: 0,
		periodo: "202609",
	},
	mercado: { liquidezArgt: 650_000, precioArgtPorUsdt0: 1450, lltv: 0.77, tasaAnual: 0 },
	posicion: { colateralUsdt0: 1000, deudaArgt: 0 },
	decision: {
		estado: "aprobado",
		tope: 0.6,
		motivos: [
			"Situación 1 en el BCRA (normal): puede pedir el máximo seguro, 60% de su colateral.",
			"La liquidez del mercado alcanza para 590909.09 ARGt (con 10% de margen): eso limita lo que puede pedir hoy.",
		],
		colateralUsdt0: 1000,
		colateralEnArgt: 1_450_000,
		maxPorColateralArgt: 870_000,
		liquidezUsableArgt: 590_909.09,
		disponibleArgt: 590_909.09,
		pedidoArgt: null,
		otorgadoArgt: 590_909.09,
		ltvResultante: 0.41,
	},
};

export const MUESTRA_PLAN = {
	ok: true,
	wallet: "0x7a3B9c2e41F0d8a5E6b1C4f9A2d3E8b7C6a5F401",
	chlt: 1_000_000,
	argt: 870_000,
	pagarA: "0x1f2E3d4C5b6A79880716253443526170F8e9D0c1",
	chequeos: [
		{ id: "C1", titulo: "La wallet tiene CHLt", ok: true, detalle: "1.000.000 CHLt disponibles" },
		{ id: "C2", titulo: "Pool de Curve con liquidez", ok: true, detalle: "CHLt → USDT0 sin impacto mayor a 1%" },
		{ id: "C3", titulo: "Tope sobre el colateral", ok: true, detalle: "Pide 60% del colateral (Morpho liquida a 77%)" },
		{ id: "C4", titulo: "Liquidez en Morpho", ok: true, detalle: "Hay ARGt de sobra, con 10% de margen" },
		{ id: "C5", titulo: "BCRA sin problemas", ok: true, detalle: "Situación 1, sin cheques rechazados" },
		{ id: "C6", titulo: "Gas para firmar", ok: true, detalle: "0,0021 ETH en Arbitrum" },
	],
	pasos: [
		{ id: "aprobar-chlt", titulo: "Autorizar CHLt", detalle: "Curve puede mover tus CHLt", tx: { to: "0x5e0F9a1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f", data: "0x095ea7b3" + "0".repeat(128) } },
		{ id: "cambiar", titulo: "Cambiar CHLt por USDT0", detalle: "En el pool de Curve", tx: { to: "0x9a8B7c6D5e4F3a2B1c0D9e8F7a6B5c4D3e2F1a0B", data: "0x3df02124" + "0".repeat(256) } },
		{ id: "colateral", titulo: "Dejar USDT0 de colateral", detalle: "En el mercado ARGt/USDT0 de Morpho", tx: { to: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb", data: "0x238d6579" + "0".repeat(320) } },
		{ id: "pedir", titulo: "Pedir ARGt", detalle: "870.000 ARGt a tu wallet", tx: { to: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb", data: "0x50d8cd4b" + "0".repeat(384) } },
		{ id: "pagar", titulo: "Pagar al proveedor", detalle: "Transferir ARGt a quien cobra", tx: { to: "0x4c1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D", data: "0xa9059cbb" + "0".repeat(128) } },
	],
	firmarEn: "https://saltar-hackatwin.vercel.app/app?plan=demo",
};

// ---------------------------------------------------------------------------
// Piezas compartidas: estilos y puente con el cliente.

const ESTILOS = /* css */ `
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
:root{
  --bg:#fbf8f2; --card:#ffffff; --ink:#262f63; --ink2:#545c86; --line:#e6decf; --soft:#f4eee3;
  --sun:#f2ae2e; --sun2:#f8d995; --sunink:#94601a; --lav:#8c98c8; --mist:#dde1f2;
  --ok:#2e8b57; --okbg:#e3f3e9; --warn:#c98a12; --warnbg:#fbf0d6; --no:#b5524a; --nobg:#f7e3e1;
  --sky:linear-gradient(160deg,#161c45 0%,#2b3470 55%,#8a7fa6 85%,#f3c98a 100%);
  color-scheme: light;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --bg:#12163a; --card:#1b2250; --ink:#f4eee3; --ink2:#b9bfdc; --line:#2f3870; --soft:#232b5e;
  --sun:#f6be52; --sun2:#5a4a2a; --sunink:#f8d995; --lav:#8c98c8; --mist:#2b3470;
  --ok:#4fd08a; --okbg:#173d33; --warn:#f2c04e; --warnbg:#3b3420; --no:#ef8a80; --nobg:#40232a;
  color-scheme: dark;
}}
:root[data-theme="dark"]{
  --bg:#12163a; --card:#1b2250; --ink:#f4eee3; --ink2:#b9bfdc; --line:#2f3870; --soft:#232b5e;
  --sun:#f6be52; --sun2:#5a4a2a; --sunink:#f8d995; --lav:#8c98c8; --mist:#2b3470;
  --ok:#4fd08a; --okbg:#173d33; --warn:#f2c04e; --warnbg:#3b3420; --no:#ef8a80; --nobg:#40232a;
  color-scheme: dark;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:transparent}
body{font-family:Montserrat,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4}
.mono{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace}
.wrap{max-width:640px;margin:0 auto;padding:4px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.02),0 12px 32px -18px rgba(27,34,80,.35)}
.hero{background:var(--sky);color:#fbf8f2;padding:18px 20px 20px;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;left:50%;bottom:-120px;width:340px;height:200px;transform:translateX(-50%);background:radial-gradient(ellipse at center,#ffd98acc 0%,#ffd98a00 70%);pointer-events:none;animation:sol 1.6s ease-out both}
@keyframes sol{from{opacity:0;transform:translate(-50%,40px)}to{opacity:1;transform:translate(-50%,0)}}
.top{display:flex;align-items:center;justify-content:space-between;gap:8px;position:relative;z-index:1}
.marca{display:flex;align-items:center;gap:8px;font-weight:600;letter-spacing:.02em;font-size:13px;opacity:.95}
.marca svg{width:22px;height:22px}
.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:600;white-space:nowrap}
.pill.ok{background:var(--okbg);color:var(--ok)} .pill.warn{background:var(--warnbg);color:var(--warn)} .pill.no{background:var(--nobg);color:var(--no)}
.hero .pill{background:rgba(251,248,242,.14);color:#fbf8f2;border:1px solid rgba(251,248,242,.25)}
.hero .pill i{width:8px;height:8px;border-radius:50%;background:var(--dot,#2fbf71);box-shadow:0 0 0 3px rgba(47,191,113,.25)}
.etq{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.8;margin:14px 0 2px;position:relative;z-index:1}
.big{font-size:40px;font-weight:700;letter-spacing:-.02em;line-height:1.05;position:relative;z-index:1;font-variant-numeric:tabular-nums}
.big small{font-size:16px;font-weight:600;opacity:.8;margin-left:6px;letter-spacing:0}
.sub{font-size:13px;opacity:.85;position:relative;z-index:1;margin-top:4px}
.body{padding:16px 20px 18px}
.sec{margin-top:16px}
.sec:first-child{margin-top:0}
.h{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink2);font-weight:600;margin:0 0 8px}
.muted{color:var(--ink2)}
.foot{font-size:12px;color:var(--ink2);border-top:1px solid var(--line);padding:10px 20px 12px;background:var(--soft)}
.fade{opacity:0;transform:translateY(6px);animation:fade .5s ease-out forwards}
@keyframes fade{to{opacity:1;transform:none}}
.vacio{padding:28px 20px;text-align:center;color:var(--ink2)}
@media (max-width:420px){.big{font-size:32px}.body{padding:14px 16px 16px}.hero{padding:16px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.fade{opacity:1;transform:none}}
`;

const LOGO = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="15" r="5" fill="#f2ae2e"/><path d="M2 19h20" stroke="#fbf8f2" stroke-width="1.6" stroke-linecap="round"/><path d="M12 4v3M5.5 8l1.8 1.8M18.5 8l-1.8 1.8" stroke="#f8d995" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// Puente mínimo del lado de la tarjeta (equivale a `App` de @modelcontextprotocol/ext-apps).
const PUENTE = /* js */ `
const enCliente = window.parent && window.parent !== window;
let sigId = 1; const pendientes = new Map();
function pedir(method, params){
  const id = sigId++;
  window.parent.postMessage({ jsonrpc: "2.0", id, method, params }, "*");
  return new Promise((ok, mal) => {
    pendientes.set(id, { ok, mal });
    setTimeout(() => { if (pendientes.has(id)) { pendientes.delete(id); mal(new Error("timeout " + method)); } }, 10000);
  });
}
function avisar(method, params){ if (enCliente) window.parent.postMessage({ jsonrpc: "2.0", method, params: params || {} }, "*"); }
function tema(t){ if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t); }
function datosDe(r){
  if (!r) return null;
  if (r.structuredContent) return r.structuredContent;
  const t = (r.content || []).find((c) => c.type === "text");
  if (t) { try { return JSON.parse(t.text); } catch (e) { return { error: t.text }; } }
  return null;
}
async function abrir(url){
  if (enCliente) { try { const r = await pedir("ui/open-link", { url }); if (!r || !r.isError) return; } catch (e) {} }
  window.open(url, "_blank", "noopener");
}
window.addEventListener("message", (e) => {
  const m = e.data; if (!m || m.jsonrpc !== "2.0") return;
  if (m.id != null && !m.method && pendientes.has(m.id)) {
    const p = pendientes.get(m.id); pendientes.delete(m.id);
    m.error ? p.mal(m.error) : p.ok(m.result); return;
  }
  if (m.method === "ui/notifications/tool-result") { const d = datosDe(m.params); if (d) dibujar(d); return; }
  if (m.method === "ui/notifications/host-context-changed") { tema(m.params && m.params.theme); return; }
  if (m.id != null && m.method) window.parent.postMessage({ jsonrpc: "2.0", id: m.id, result: {} }, "*");
});
let ultimoAlto = 0;
new ResizeObserver(() => {
  const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
  if (h !== ultimoAlto) { ultimoAlto = h; avisar("ui/notifications/size-changed", { height: h }); }
}).observe(document.documentElement);
const fmt = (n, d) => Number(n || 0).toLocaleString("es-AR", { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 });
const corta = (a) => a && a.length > 12 ? a.slice(0, 6) + "…" + a.slice(-4) : (a || "");
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function contar(el, hasta, ms){
  const t0 = performance.now();
  const paso = (t) => { const p = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(hasta * e); if (p < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}
if (enCliente) {
  pedir("ui/initialize", { appInfo: { name: "saltarg-tarjeta", version: "0.1.0" }, appCapabilities: {}, protocolVersion: "2026-01-26" })
    .then((r) => { tema(r && r.hostContext && r.hostContext.theme); avisar("ui/notifications/initialized"); })
    .catch(() => {});
} else {
  const q = new URLSearchParams(location.search); tema(q.get("tema"));
  dibujar(MUESTRA);
}
`;

const pagina = (titulo: string, cuerpo: string, script: string, muestra: unknown) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title><style>${ESTILOS}${cuerpo}</style></head>
<body><div class="wrap" id="raiz"><div class="card"><div class="vacio">Esperando el resultado…</div></div></div>
<script>
const MUESTRA = ${JSON.stringify(muestra)};
${script}
${PUENTE}
</script></body></html>`;

// ---------------------------------------------------------------------------
// Tarjeta 1: cuánto podés pedir hoy.

const CSS_CUANTO = /* css */ `
.gauge{display:grid;grid-template-columns:minmax(0,220px) 1fr;gap:16px;align-items:center}
.gauge svg{width:100%;height:auto;overflow:visible}
.arco{fill:none;stroke-width:16;stroke-linecap:butt}
.aguja{transform-box:view-box;transform-origin:110px 110px;transition:transform .9s cubic-bezier(.2,.9,.25,1.15)}
.ltv{font-size:28px;font-weight:700;font-variant-numeric:tabular-nums}
.ley{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--ink2)}
.ley span{display:flex;align-items:center;gap:8px}
.ley b{display:inline-block;width:10px;height:10px;border-radius:3px}
.barras{display:flex;flex-direction:column;gap:10px}
.barra .fila{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;gap:8px}
.barra .fila b{font-variant-numeric:tabular-nums}
.pista{height:10px;border-radius:99px;background:var(--soft);overflow:hidden}
.pista i{display:block;height:100%;border-radius:99px;width:0;transition:width 1s cubic-bezier(.2,.8,.2,1)}
.limita{font-size:11px;font-weight:700;color:var(--sunink);background:var(--sun2);border-radius:99px;padding:1px 8px;margin-left:6px}
.prueba{background:var(--soft);border-radius:14px;padding:12px 14px}
.prueba .fila{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.prueba .monto{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}
input[type=range]{width:100%;margin:10px 0 6px;accent-color:var(--sun);height:28px}
.veredicto{font-size:13px;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);border-radius:999px;padding:4px 10px;font-size:12px;background:var(--card)}
.motivos{margin:0;padding-left:18px;color:var(--ink2);font-size:13px}
.motivos li{margin:3px 0}
@media (max-width:460px){.gauge{grid-template-columns:1fr}.gauge svg{max-width:240px;margin:0 auto;display:block}}
`;

const JS_CUANTO = /* js */ `
const ESCALA = 1; // el medidor va de 0% a 100% del colateral
function arco(desde, hasta, r){
  const p = (v) => { const a = Math.PI * (1 - v / ESCALA); return [110 + r * Math.cos(a), 110 - r * Math.sin(a)]; };
  const [x1, y1] = p(desde), [x2, y2] = p(hasta);
  return "M" + x1.toFixed(2) + " " + y1.toFixed(2) + " A" + r + " " + r + " 0 0 1 " + x2.toFixed(2) + " " + y2.toFixed(2);
}
function marca(v, txt){
  const a = Math.PI * (1 - v / ESCALA);
  const x1 = 110 + 70 * Math.cos(a), y1 = 110 - 70 * Math.sin(a), x2 = 110 + 100 * Math.cos(a), y2 = 110 - 100 * Math.sin(a);
  const tx = 110 + 112 * Math.cos(a), ty = 110 - 112 * Math.sin(a);
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 3"/>' +
    '<text x="' + tx + '" y="' + ty + '" font-size="11" font-weight="700" fill="var(--ink)" text-anchor="middle">' + txt + '</text>';
}
function dibujar(d){
  if (d.error && !d.decision) { document.getElementById("raiz").innerHTML = '<div class="card"><div class="vacio">' + esc(d.error) + '</div></div>'; return; }
  const dec = d.decision || {}, mer = d.mercado || {}, pos = d.posicion || {}, bcra = d.bcra || {};
  const tope = dec.tope ?? 0.6, lltv = mer.lltv ?? 0.77, precio = mer.precioArgtPorUsdt0 || 1;
  const colArgt = dec.colateralEnArgt || 0, deuda = pos.deudaArgt || 0, disp = dec.disponibleArgt || 0;
  const estado = dec.estado || "aprobado";
  const pill = estado === "rechazado" ? ["no", "#b5524a", "No puede pedir hoy"] : estado === "recortado" ? ["warn", "#f2ae2e", "Recortado"] : ["ok", "#2fbf71", "Aprobado"];
  const limitaLiquidez = (dec.liquidezUsableArgt ?? Infinity) < (dec.maxPorColateralArgt ?? 0);
  const maxBarra = Math.max(dec.maxPorColateralArgt || 0, dec.liquidezUsableArgt || 0, 1);
  const bcraTxt = bcra.ok
    ? (bcra.situacionMax == null ? "BCRA: sin deudas" : "BCRA: situación " + bcra.situacionMax) + (bcra.chequesRechazados ? " · " + bcra.chequesRechazados + " cheque(s) rechazado(s)" : "")
    : "BCRA sin consultar";
  const bcraCls = !bcra.ok ? "warn" : (bcra.situacionMax >= 3 ? "no" : bcra.situacionMax === 2 || bcra.chequesRechazados ? "warn" : "ok");
  const maxSlider = Math.max(Math.floor(colArgt * 0.9 - deuda), Math.ceil(disp * 1.2), 1);
  const inicial = dec.otorgadoArgt || disp;
  document.getElementById("raiz").innerHTML = \`
  <div class="card">
    <div class="hero">
      <div class="top"><div class="marca">${LOGO} Saltar · adelanto en ARGt</div>
        <span class="pill" style="--dot:\${pill[1]}"><i></i>\${pill[2]}</span></div>
      <div class="etq">Podés pedir hoy</div>
      <div class="big"><span id="num">0</span><small>ARGt</small></div>
      <div class="sub">≈ US$ \${fmt(disp / precio)} · contra \${fmt(dec.colateralUsdt0, 2)} USDT0 de colateral (\${fmt(colArgt)} ARGt)</div>
    </div>
    <div class="body">
      <div class="sec fade" style="animation-delay:.15s">
        <div class="h">Préstamo sobre tu colateral</div>
        <div class="gauge">
          <svg viewBox="0 0 220 128" role="img" aria-label="Medidor del préstamo">
            <path class="arco" d="\${arco(0, tope, 88)}" stroke="var(--ok)" opacity=".85"/>
            <path class="arco" d="\${arco(tope, lltv, 88)}" stroke="var(--sun)"/>
            <path class="arco" d="\${arco(lltv, 1, 88)}" stroke="var(--no)" opacity=".85"/>
            \${marca(tope, Math.round(tope * 100) + "%")}
            \${marca(lltv, Math.round(lltv * 100) + "%")}
            <g class="aguja" id="aguja" style="transform:rotate(0deg)">
              <line x1="110" y1="110" x2="38" y2="110" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
            </g>
            <circle cx="110" cy="110" r="8" fill="var(--ink)"/><circle cx="110" cy="110" r="3" fill="var(--sun)"/>
          </svg>
          <div>
            <div class="ltv"><span id="ltv">0</span>%</div>
            <div class="muted" style="font-size:12px;margin-bottom:10px">de tu colateral queda prestado</div>
            <div class="ley">
              <span><b style="background:var(--ok)"></b>Hasta \${Math.round(tope * 100)}%: tope seguro</span>
              <span><b style="background:var(--sun)"></b>\${Math.round(tope * 100)}% a \${Math.round(lltv * 100)}%: fuera del tope</span>
              <span><b style="background:var(--no)"></b>Desde \${Math.round(lltv * 100)}%: Morpho liquida</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sec fade" style="animation-delay:.3s">
        <div class="h">Qué lo limita</div>
        <div class="barras">
          <div class="barra"><div class="fila"><span>Tu colateral × \${Math.round(tope * 100)}%\${!limitaLiquidez ? '<span class="limita">limita</span>' : ""}</span><b>\${fmt(dec.maxPorColateralArgt)} ARGt</b></div>
            <div class="pista"><i data-w="\${(dec.maxPorColateralArgt || 0) / maxBarra * 100}" style="background:var(--lav)"></i></div></div>
          <div class="barra"><div class="fila"><span>Liquidez del mercado\${limitaLiquidez ? '<span class="limita">limita</span>' : ""}</span><b>\${fmt(dec.liquidezUsableArgt)} ARGt</b></div>
            <div class="pista"><i data-w="\${(dec.liquidezUsableArgt || 0) / maxBarra * 100}" style="background:var(--sun)"></i></div></div>
        </div>
      </div>
      <div class="sec fade" style="animation-delay:.45s">
        <div class="h">Probá otro monto</div>
        <div class="prueba">
          <div class="fila"><span class="monto"><span id="prueba">\${fmt(inicial)}</span> ARGt</span><span class="muted" id="pruebaUsd"></span></div>
          <input type="range" id="slider" min="0" max="\${maxSlider}" step="1" value="\${Math.round(inicial)}" aria-label="Monto a pedir en ARGt">
          <div class="veredicto" id="veredicto"></div>
        </div>
      </div>
      <div class="sec fade" style="animation-delay:.6s">
        <div class="chips">
          <span class="pill \${bcraCls}">\${esc(bcraTxt)}\${bcra.simulado ? " (muestra)" : ""}</span>
          \${bcra.denominacion ? '<span class="chip">' + esc(bcra.denominacion) + '</span>' : ""}
          \${d.wallet ? '<span class="chip mono">' + esc(corta(d.wallet)) + '</span>' : ""}
          \${deuda ? '<span class="chip">Ya debés ' + fmt(deuda) + ' ARGt</span>' : ""}
        </div>
        \${(dec.motivos || []).length ? '<ul class="motivos" style="margin-top:10px">' + dec.motivos.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul>" : ""}
      </div>
    </div>
    <div class="foot">Simulación: no pide nada. ARGt no genera intereses; el costo del adelanto es un descuento sobre la factura.</div>
  </div>\`;
  contar(document.getElementById("num"), disp, 1100);
  requestAnimationFrame(() => document.querySelectorAll(".pista i").forEach((i) => { i.style.width = i.dataset.w + "%"; }));
  const s = document.getElementById("slider");
  const mover = () => {
    const monto = Number(s.value);
    const ltv = colArgt > 0 ? (deuda + monto) / colArgt : 0;
    document.getElementById("prueba").textContent = fmt(monto);
    document.getElementById("pruebaUsd").textContent = "≈ US$ " + fmt(monto / precio);
    document.getElementById("ltv").textContent = fmt(ltv * 100, 1);
    document.getElementById("aguja").style.transform = "rotate(" + Math.min(1, ltv / ESCALA) * 180 + "deg)";
    const v = document.getElementById("veredicto");
    if (estado === "rechazado" || disp <= 0) { v.textContent = "Hoy no se puede pedir ARGt con este perfil o colateral."; v.style.color = "var(--no)"; }
    else if (monto <= disp + 0.01) { v.textContent = "✓ Dentro de lo que podés pedir hoy."; v.style.color = "var(--ok)"; }
    else if (ltv < lltv) { v.textContent = "Pasa lo disponible: se recortaría a " + fmt(disp) + " ARGt."; v.style.color = "var(--warn)"; }
    else { v.textContent = "Con este monto Morpho liquidaría tu colateral."; v.style.color = "var(--no)"; }
  };
  s.addEventListener("input", mover);
  setTimeout(mover, 120);
}
`;

export const TARJETA_CUANTO = pagina("Saltar: cuánto podés pedir", CSS_CUANTO, JS_CUANTO, MUESTRA_CUANTO);

// ---------------------------------------------------------------------------
// Tarjeta 2: plan del adelanto (preparar_adelanto).

const CSS_PLAN = /* css */ `
.resumen{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;position:relative;z-index:1}
.resumen>div{background:rgba(251,248,242,.1);border:1px solid rgba(251,248,242,.2);border-radius:14px;padding:10px 12px}
.resumen .k{font-size:11px;text-transform:uppercase;letter-spacing:.08em;opacity:.8}
.resumen .v{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;margin-top:2px}
.checks{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.check{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:14px;padding:10px 12px;background:var(--card);opacity:0;transform:scale(.97);animation:pop .45s cubic-bezier(.2,.9,.3,1.2) forwards}
@keyframes pop{to{opacity:1;transform:none}}
.ico{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--soft)}
.ico svg{width:14px;height:14px}
.check.ok .ico{background:var(--okbg);color:var(--ok)} .check.no .ico{background:var(--nobg);color:var(--no)}
.check.no{border-color:var(--no)}
.ico path{stroke-dasharray:24;stroke-dashoffset:24;animation:trazo .4s ease-out forwards;animation-delay:inherit}
@keyframes trazo{to{stroke-dashoffset:0}}
.check .t{font-weight:600;font-size:13px}
.check .t .id{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;color:var(--ink2);margin-right:6px}
.check .d{font-size:12px;color:var(--ink2);margin-top:2px}
.pasos{list-style:none;margin:0;padding:0;position:relative}
.paso{display:grid;grid-template-columns:32px 1fr;gap:12px;position:relative;padding-bottom:14px}
.paso:last-child{padding-bottom:0}
.paso:not(:last-child):before{content:"";position:absolute;left:15px;top:32px;bottom:2px;width:2px;background:var(--line)}
.n{width:32px;height:32px;border-radius:50%;background:var(--ink);color:var(--card);display:grid;place-items:center;font-weight:700;font-size:13px}
.paso .t{font-weight:600;padding-top:5px}
.paso .d{font-size:13px;color:var(--ink2)}
.paso .tx{font-size:11px;color:var(--ink2);margin-top:4px;display:flex;gap:8px;flex-wrap:wrap}
.paso .tx span{background:var(--soft);border-radius:6px;padding:2px 6px}
.cta{display:flex;flex-direction:column;align-items:stretch;gap:8px;margin-top:18px}
button.firmar{appearance:none;border:0;border-radius:14px;padding:15px 18px;font:inherit;font-size:16px;font-weight:700;cursor:pointer;color:#1b2250;background:linear-gradient(180deg,#f8c560,#f2ae2e);box-shadow:0 10px 24px -12px rgba(242,174,46,.9),inset 0 -2px 0 rgba(148,96,26,.25);transition:transform .15s ease,box-shadow .15s ease;display:flex;align-items:center;justify-content:center;gap:10px}
button.firmar:hover{transform:translateY(-1px);box-shadow:0 14px 28px -12px rgba(242,174,46,1),inset 0 -2px 0 rgba(148,96,26,.25)}
button.firmar:active{transform:translateY(1px)}
button.firmar:disabled{cursor:not-allowed;background:var(--soft);color:var(--ink2);box-shadow:none;transform:none}
.cta .nota{font-size:12px;color:var(--ink2);text-align:center}
@media (max-width:460px){.checks{grid-template-columns:1fr}.resumen .v{font-size:17px}}
`;

const JS_PLAN = /* js */ `
const SI = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NO = '<svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
const monto = (v) => typeof v === "number" ? fmt(v, 2) : (v && typeof v === "object" ? fmt(v.monto ?? v.cantidad ?? v.amount, 2) : esc(v ?? "—"));
function dibujar(d){
  if (d.error && !d.pasos) { document.getElementById("raiz").innerHTML = '<div class="card"><div class="vacio">' + esc(d.error) + '</div></div>'; return; }
  const chequeos = d.chequeos || [], pasos = d.pasos || [];
  const malos = chequeos.filter((c) => !c.ok).length;
  const listo = !!d.ok && malos === 0 && !!d.firmarEn;
  const pill = listo ? ["#2fbf71", "Listo para firmar"] : ["#b5524a", malos ? malos + " chequeo(s) sin pasar" : "Falta revisar"];
  document.getElementById("raiz").innerHTML = \`
  <div class="card">
    <div class="hero">
      <div class="top"><div class="marca">${LOGO} Saltar · plan del adelanto</div>
        <span class="pill" style="--dot:\${pill[0]}"><i></i>\${pill[1]}</span></div>
      <div class="etq">Recibís</div>
      <div class="big"><span>\${monto(d.argt)}</span><small>ARGt</small></div>
      <div class="resumen">
        <div><div class="k">Dejás de garantía</div><div class="v">\${monto(d.chlt)} <small style="font-size:12px;opacity:.8">CHLt</small></div></div>
        <div><div class="k">Se paga a</div><div class="v mono" style="font-size:15px;padding-top:4px">\${esc(corta(d.pagarA) || "tu wallet")}</div></div>
      </div>
    </div>
    <div class="body">
      <div class="sec">
        <div class="h">Chequeos (\${chequeos.length - malos} de \${chequeos.length})</div>
        <div class="checks">\${chequeos.map((c, i) => \`
          <div class="check \${c.ok ? "ok" : "no"}" style="animation-delay:\${0.12 + i * 0.12}s">
            <div class="ico" style="animation-delay:\${0.3 + i * 0.12}s">\${c.ok ? SI : NO}</div>
            <div><div class="t"><span class="id">\${esc(c.id)}</span>\${esc(c.titulo)}</div><div class="d">\${esc(c.detalle)}</div></div>
          </div>\`).join("")}</div>
      </div>
      <div class="sec fade" style="animation-delay:\${0.2 + chequeos.length * 0.12}s">
        <div class="h">Lo que vas a firmar (\${pasos.length} pasos)</div>
        <ol class="pasos">\${pasos.map((p, i) => \`
          <li class="paso"><div class="n">\${i + 1}</div><div>
            <div class="t">\${esc(p.titulo)}</div><div class="d">\${esc(p.detalle)}</div>
            \${p.tx ? '<div class="tx mono"><span>a ' + esc(corta(p.tx.to)) + '</span><span>' + esc((p.tx.data || "").slice(0, 10)) + '…</span></div>' : ""}
          </div></li>\`).join("")}</ol>
        <div class="cta">
          <button class="firmar" id="firmar" \${listo ? "" : "disabled"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h16M6 16l9.5-9.5a2.1 2.1 0 013 3L9 19H6v-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            \${listo ? "Firmar en Saltar" : "Revisá los chequeos"}</button>
          <div class="nota">\${listo ? "Se abre Saltar con el plan cargado. Firmás vos, con tu wallet: nada se manda desde acá." : "No se puede firmar hasta que pasen todos los chequeos."}</div>
        </div>
      </div>
    </div>
    <div class="foot">ARGt no genera intereses; el costo del adelanto es un descuento sobre la factura.</div>
  </div>\`;
  const b = document.getElementById("firmar");
  if (listo) b.addEventListener("click", () => abrir(d.firmarEn));
}
`;

export const TARJETA_PLAN = pagina("Saltar: plan del adelanto", CSS_PLAN, JS_PLAN, MUESTRA_PLAN);
