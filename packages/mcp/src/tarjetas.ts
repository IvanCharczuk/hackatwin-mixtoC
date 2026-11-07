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

// ---------------------------------------------------------------------------
// Muestras (para ver la tarjeta en un navegador y para la vista previa).

export const MUESTRA_CUANTO = {
	wallet: "0x7a3B9c2e41F0d8a5E6b1C4f9A2d3E8b7C6a5F401",
	bcra: {
		ok: true,
		simulado: true,
		denominacion: "Empresa de ejemplo",
		situacionMax: 1,
		deudaTotalArs: 0,
		entidades: 1,
		chequesRechazados: 0,
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
	chlt: 208,
	argt: 200,
	pagarA: "0x40326B77C55b2EF41a0ca933B6Bc9Cb4995a4320",
	chequeos: [
		{ id: "C1", titulo: "Tenés los CHLt", ok: true, detalle: "1.250 CHLt en tu wallet" },
		{ id: "C2", titulo: "Hay gas para firmar", ok: true, detalle: "0,1594 ETH en Arbitrum" },
		{ id: "C3", titulo: "El cambio a USDT0 rinde", ok: true, detalle: "Recibís 0,21 USDT0, impacto 0,7 %" },
		{ id: "C4", titulo: "Hay fondos para financiarte", ok: true, detalle: "155.439 ARGt disponibles en Morpho" },
		{ id: "C5", titulo: "Entra en tu límite", ok: true, detalle: "Tu saldo queda en 200 de un límite de 207 ARGt" },
		{ id: "C6", titulo: "Permisos de los tokens", ok: true, detalle: "Se suman 2 aprobaciones al plan" },
	],
	pasos: [
		{ id: "approve-chlt", titulo: "Aprobar CHLt", detalle: "Permite al pool de Curve usar 208 CHLt", tx: { to: "0xe8dbC4680235cCAeFf48e4C0B0EaceeBb89E5e17", data: "0x095ea7b3" + "0".repeat(128) } },
		{ id: "exchange", titulo: "Pasar tus CHLt a dólares", detalle: "Cambia 208 CHLt por al menos 0,21 USDT0", tx: { to: "0xa087f05ecd245476d7844f6eab28d98724696ac2", data: "0x5b41b908" + "0".repeat(256) } },
		{ id: "approve-usdt0", titulo: "Aprobar USDT0", detalle: "Permite a Morpho tomar tu respaldo", tx: { to: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", data: "0x095ea7b3" + "0".repeat(128) } },
		{ id: "supply", titulo: "Dejar tu respaldo", detalle: "0,21 USDT0 quedan en Morpho a tu nombre", tx: { to: "0x6c247b1F6182318877311737BaC0844bAa518F5e", data: "0x238d6579" + "0".repeat(320) } },
		{ id: "borrow", titulo: "Pagarle a tu proveedor", detalle: "200 ARGt van a 0x4032…4320, el saldo queda a tu nombre", tx: { to: "0x6c247b1F6182318877311737BaC0844bAa518F5e", data: "0x50d8cd4b" + "0".repeat(384) } },
	],
	firmarEn: "https://saltarg-app.vercel.app/app?monto=200&proveedor=0x40326B77C55b2EF41a0ca933B6Bc9Cb4995a4320&cuit=30999999023",
};

// ---------------------------------------------------------------------------
// Piezas compartidas. Diseño: el de /app (tarjeta blanca, una cifra grande,
// filas tranquilas) con la marca de la landing (Montserrat, navy, el sol como
// único acento). Tokens copiados de apps/landing/src/index.css.

const ESTILOS = /* css */ `
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
:root{
  --card:#ffffff; --ink:#262f63; --ink2:#545c86; --ink3:#8a90b0; --line:#ece6da; --soft:#f4eee3;
  --sun:#f2ae2e; --sunink:#1b2250; --ok:#2e8b57; --no:#b5524a; --warn:#c98a12; --live:#2fbf71;
  color-scheme: light;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --card:#1b2250; --ink:#f4eee3; --ink2:#b9bfdc; --ink3:#7e86b3; --line:#2a3368; --soft:#232b5e;
  --sun:#f2ae2e; --sunink:#1b2250; --ok:#4fd08a; --no:#ef8a80; --warn:#f2c04e; --live:#2fbf71;
  color-scheme: dark;
}}
:root[data-theme="dark"]{
  --card:#1b2250; --ink:#f4eee3; --ink2:#b9bfdc; --ink3:#7e86b3; --line:#2a3368; --soft:#232b5e;
  --sun:#f2ae2e; --sunink:#1b2250; --ok:#4fd08a; --no:#ef8a80; --warn:#f2c04e; --live:#2fbf71;
  color-scheme: dark;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:transparent}
body{font-family:Montserrat,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.45}
.mono{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace}
.wrap{max-width:560px;margin:0 auto;padding:4px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 1px 2px rgb(0 37 100/.06)}
.top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.marca{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px}
.marca svg{width:20px;height:20px}
.estado{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--ink2)}
.estado i{width:7px;height:7px;border-radius:50%;background:var(--dot,var(--live))}
.etq{font-size:13px;color:var(--ink2);margin:22px 0 2px}
.big{font-size:44px;font-weight:700;letter-spacing:-.025em;line-height:1.05;font-variant-numeric:tabular-nums}
.big small{font-size:16px;font-weight:600;color:var(--ink2);margin-left:6px;letter-spacing:0}
.sub{font-size:13px;color:var(--ink2);margin-top:6px}
.sec{margin-top:24px}
.h{font-size:12px;font-weight:600;color:var(--ink3);margin:0 0 4px;letter-spacing:.02em}
.filas{list-style:none;margin:0;padding:0}
.sec.filas{margin-top:20px}
.fila{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-top:1px solid var(--line)}
.filas .fila:first-child{border-top:0}
.fila .ico{flex:none;width:18px;height:18px;margin-top:1px}
.fila .ico.ok{color:var(--ok)} .fila .ico.no{color:var(--no)}
.fila .t{font-weight:600;font-size:14px}
.fila .d{font-size:13px;color:var(--ink2)}
.fila .der{margin-left:auto;text-align:right;font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.foot{font-size:12px;color:var(--ink3);margin-top:20px}
.fade{opacity:0;transform:translateY(4px);animation:fade .45s ease-out forwards}
@keyframes fade{to{opacity:1;transform:none}}
.vacio{padding:12px 0;text-align:center;color:var(--ink2)}
@media (max-width:420px){.card{padding:20px 18px}.big{font-size:36px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.fade{opacity:1;transform:none}}
`;

const LOGO = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="15" r="5" fill="#f2ae2e"/><path d="M2 19.5h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 4v3M5.5 8l1.8 1.8M18.5 8l-1.8 1.8" stroke="#f2ae2e" stroke-width="1.6" stroke-linecap="round"/></svg>`;

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
// Íconos compartidos (van dentro del JS de cada tarjeta).

const ICONOS = /* js */ `
const SI = '<svg class="ico ok" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8.25" stroke="currentColor" stroke-width="1.5" opacity=".35"/><path d="M5.5 9.2l2.3 2.3 4.7-4.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NO = '<svg class="ico no" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8.25" stroke="currentColor" stroke-width="1.5" opacity=".35"/><path d="M6.3 6.3l5.4 5.4M11.7 6.3l-5.4 5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const vacio = (t) => { document.getElementById("raiz").innerHTML = '<div class="card"><div class="vacio">' + esc(t) + '</div></div>'; };
`;

// ---------------------------------------------------------------------------
// Tarjeta 1: cuánto podés pedir hoy.

const CSS_CUANTO = /* css */ `
.medidor{position:relative;padding:8px 0 22px}
.pista{position:relative;height:6px;border-radius:99px;background:var(--soft)}
.pista .lleno{position:absolute;inset:0 auto 0 0;width:0;border-radius:99px;background:var(--ink);transition:width .8s cubic-bezier(.2,.8,.2,1),background .2s}
.tick{position:absolute;top:-5px;width:2px;height:16px;border-radius:2px}
.tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:11px;color:var(--ink3);white-space:nowrap}
.medidor .pct{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
.medidor .pct b{font-size:15px;font-variant-numeric:tabular-nums}
.medidor input[type=range]{position:absolute;left:-2px;right:-2px;width:calc(100% + 4px);top:-9px;height:24px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer}
.medidor input[type=range]::-webkit-slider-runnable-track{background:transparent;height:24px}
.medidor input[type=range]::-moz-range-track{background:transparent}
.medidor input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;margin-top:3px;border-radius:50%;background:var(--card);border:2px solid var(--ink);box-shadow:0 2px 6px rgb(0 37 100/.18)}
.medidor input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--ink)}
.medidor input[type=range]:focus-visible{outline:none}
.medidor input[type=range]:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 4px rgb(242 174 46/.35)}
.veredicto{font-size:13px;font-weight:500;margin-top:8px}
`;

const JS_CUANTO = /* js */ `
${ICONOS}
function dibujar(d){
  if (d.error && !d.decision) return vacio(d.error);
  const dec = d.decision || {}, mer = d.mercado || {}, pos = d.posicion || {}, bcra = d.bcra || {};
  const tope = dec.tope ?? 0.6, lltv = mer.lltv ?? 0.77, precio = mer.precioArgtPorUsdt0 || 1;
  const colArgt = dec.colateralEnArgt || 0, deuda = pos.deudaArgt || 0, disp = dec.disponibleArgt || 0;
  const estado = dec.estado || "aprobado";
  const est = estado === "rechazado" ? ["var(--no)", "No puede pedir hoy"] : estado === "recortado" ? ["var(--sun)", "Recortado"] : ["var(--live)", "Aprobado"];
  const limitaLiquidez = (dec.liquidezUsableArgt ?? Infinity) < (dec.maxPorColateralArgt ?? 0);
  const bcraOk = bcra.ok && !(bcra.situacionMax >= 2) && !bcra.chequesRechazados;
  const bcraTxt = !bcra.ok ? "BCRA sin consultar" : bcra.situacionMax == null ? "Sin deudas en el BCRA" : "Situación " + bcra.situacionMax + " en el BCRA";
  // El control va de 0 a todo el respaldo: así la perilla queda justo donde termina la barra.
  const maxSlider = colArgt - deuda > 1 ? Math.floor(colArgt - deuda) : Math.max(Math.ceil(disp * 1.2), 1);
  const enBarra = (r) => Math.max(0, Math.min(100, (r * colArgt - deuda) / maxSlider * 100));
  const inicial = dec.otorgadoArgt || disp;
  const pc = (v) => Math.round(v * 100);
  document.getElementById("raiz").innerHTML = \`
  <div class="card">
    <div class="top"><div class="marca">${LOGO} Saltar</div>
      <span class="estado" style="--dot:\${est[0]}"><i></i>\${est[1]}</span></div>
    <div class="etq">Podés pedir hoy</div>
    <div class="big"><span id="num">0</span><small>ARGt</small></div>
    <div class="sub">≈ US$ \${fmt(disp / precio)} · respaldo de \${fmt(dec.colateralUsdt0, 2)} USDT0</div>

    <div class="sec fade" style="animation-delay:.1s">
      <div class="medidor">
        <div class="pct"><span class="h" style="margin:0">Probá otro monto</span><b><span id="prueba">\${fmt(inicial)}</span> ARGt</b></div>
        <div class="pista"><div class="lleno" id="lleno"></div>
          <div class="tick" style="left:\${enBarra(tope)}%;background:var(--sun)"><span>\${pc(tope)}% tope</span></div>
          <div class="tick" style="left:\${enBarra(lltv)}%;background:var(--no)"><span>\${pc(lltv)}% liquida</span></div>
          <input type="range" id="slider" min="0" max="\${maxSlider}" step="1" value="\${Math.round(inicial)}" aria-label="Monto a pedir en ARGt">
        </div>
      </div>
      <div class="veredicto" id="veredicto"></div>
    </div>

    <ul class="filas sec fade" style="animation-delay:.25s">
      <li class="fila">\${bcraOk ? SI : NO}<div><div class="t">\${esc(bcraTxt)}</div><div class="d">\${esc(bcra.denominacion || "")}\${bcra.simulado ? " · muestra" : ""}</div></div></li>
      <li class="fila">\${SI}<div><div class="t">Tu respaldo × \${pc(tope)}%</div><div class="d">\${!limitaLiquidez ? "Es lo que limita hoy" : "Tope por tu respaldo"}</div></div><div class="der">\${fmt(dec.maxPorColateralArgt)}</div></li>
      <li class="fila">\${SI}<div><div class="t">Liquidez en Morpho</div><div class="d">\${limitaLiquidez ? "Es lo que limita hoy" : "Alcanza"}</div></div><div class="der">\${fmt(dec.liquidezUsableArgt)}</div></li>
      \${deuda ? '<li class="fila">' + SI + '<div><div class="t">Ya debés</div></div><div class="der">' + fmt(deuda) + '</div></li>' : ""}
    </ul>
    <div class="foot">Simulación: no pide nada. ARGt no genera intereses; el costo es un descuento sobre la factura.</div>
  </div>\`;
  contar(document.getElementById("num"), disp, 900);
  const s = document.getElementById("slider");
  const mover = () => {
    const monto = Number(s.value);
    const ltv = colArgt > 0 ? (deuda + monto) / colArgt : 0;
    document.getElementById("prueba").textContent = fmt(monto);
    const lleno = document.getElementById("lleno");
    lleno.style.width = Math.min(100, monto / maxSlider * 100) + "%";
    lleno.style.background = ltv >= lltv ? "var(--no)" : ltv > tope ? "var(--sun)" : "var(--ink)";
    const v = document.getElementById("veredicto");
    const usaste = fmt(ltv * 100, 1) + "% de tu respaldo";
    if (estado === "rechazado" || disp <= 0) { v.textContent = "Hoy no se puede pedir con este perfil o respaldo."; v.style.color = "var(--no)"; }
    else if (monto <= disp + 0.01) { v.textContent = "Dentro de lo que podés pedir · " + usaste; v.style.color = "var(--ok)"; }
    else if (ltv < lltv) { v.textContent = "Pasa lo disponible: se recorta a " + fmt(disp) + " ARGt"; v.style.color = "var(--warn)"; }
    else { v.textContent = "Con este monto Morpho liquidaría tu respaldo"; v.style.color = "var(--no)"; }
  };
  s.addEventListener("input", mover);
  setTimeout(mover, 150);
}
`;

export const TARJETA_CUANTO = pagina("Saltar: cuánto podés pedir", CSS_CUANTO, JS_CUANTO, MUESTRA_CUANTO);

// ---------------------------------------------------------------------------
// Tarjeta 2: plan del adelanto (preparar_adelanto).

const CSS_PLAN = /* css */ `
.paso .n{flex:none;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--line);display:grid;place-items:center;font-size:11px;font-weight:700;color:var(--ink2);margin-top:1px}
.fila.check .id{margin-left:auto;font-size:11px;color:var(--ink3);padding-top:2px}
details{margin-top:6px}
summary{cursor:pointer;font-size:12px;color:var(--ink3);list-style:none}
summary::-webkit-details-marker{display:none}
summary:before{content:"+ "} details[open] summary:before{content:"− "}
.txs{margin:8px 0 0;padding:0;list-style:none;font-size:11px;color:var(--ink2)}
.txs li{padding:3px 0;word-break:break-all}
button.firmar{appearance:none;border:0;width:100%;margin-top:22px;border-radius:999px;padding:15px 20px;font:inherit;font-size:15px;font-weight:700;cursor:pointer;color:var(--sunink);background:var(--sun);display:flex;align-items:center;justify-content:center;gap:10px;transition:transform .15s ease,box-shadow .15s ease}
button.firmar:hover{transform:translateY(-1px);box-shadow:0 10px 30px #f2ae2e59}
button.firmar:active{transform:translateY(0)}
button.firmar:disabled{cursor:not-allowed;background:var(--soft);color:var(--ink2);box-shadow:none;transform:none}
.nota{font-size:12px;color:var(--ink3);text-align:center;margin-top:10px}
`;

const JS_PLAN = /* js */ `
${ICONOS}
const monto = (v) => typeof v === "number" ? fmt(v, 2) : (v && typeof v === "object" ? fmt(v.monto ?? v.cantidad ?? v.amount, 2) : esc(v ?? "—"));
function dibujar(d){
  if (d.error && !d.pasos) return vacio(d.error);
  const chequeos = d.chequeos || [], pasos = d.pasos || [];
  const malos = chequeos.filter((c) => !c.ok).length;
  const listo = !!d.ok && malos === 0 && !!d.firmarEn;
  const est = listo ? ["var(--live)", "Listo para firmar"] : ["var(--no)", malos ? malos + (malos === 1 ? " chequeo sin pasar" : " chequeos sin pasar") : "Falta revisar"];
  const destino = d.pagarA && d.wallet && d.pagarA.toLowerCase() !== d.wallet.toLowerCase() ? "se paga a " + corta(d.pagarA) : "llegan a tu wallet";
  document.getElementById("raiz").innerHTML = \`
  <div class="card">
    <div class="top"><div class="marca">${LOGO} Saltar</div>
      <span class="estado" style="--dot:\${est[0]}"><i></i>\${est[1]}</span></div>
    <div class="etq">Recibís</div>
    <div class="big"><span>\${monto(d.argt)}</span><small>ARGt</small></div>
    <div class="sub">Dejás \${monto(d.chlt)} CHLt de respaldo · \${esc(destino)}</div>

    <div class="sec">
      <div class="h">Chequeos · \${chequeos.length - malos} de \${chequeos.length}</div>
      <ul class="filas">\${chequeos.map((c, i) => \`
        <li class="fila check fade" style="animation-delay:\${0.08 + i * 0.07}s">\${c.ok ? SI : NO}
          <div><div class="t">\${esc(c.titulo)}</div><div class="d">\${esc(c.detalle)}</div></div><span class="id mono">\${esc(c.id)}</span></li>\`).join("")}</ul>
    </div>

    <div class="sec fade" style="animation-delay:\${0.15 + chequeos.length * 0.07}s">
      <div class="h">Vas a firmar · \${pasos.length} pasos</div>
      <ol class="filas">\${pasos.map((p, i) => \`
        <li class="fila paso"><span class="n">\${i + 1}</span><div><div class="t">\${esc(p.titulo)}</div><div class="d">\${esc(p.detalle)}</div></div></li>\`).join("")}</ol>
      <details><summary>Ver las transacciones</summary>
        <ul class="txs mono">\${pasos.filter((p) => p.tx).map((p, i) => '<li>' + (i + 1) + '. a ' + esc(p.tx.to) + ' · ' + esc((p.tx.data || "").slice(0, 10)) + '…</li>').join("")}</ul>
      </details>
      <button class="firmar" id="firmar" \${listo ? "" : "disabled"}>\${listo ? "Firmar en Saltar" : "Revisá los chequeos"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="nota">\${listo ? "Firmás vos, con tu wallet. Nada se manda desde acá." : "No se puede firmar hasta que pasen todos los chequeos."}</div>
    </div>
    <div class="foot">ARGt no genera intereses; el costo del adelanto es un descuento sobre la factura.</div>
  </div>\`;
  const b = document.getElementById("firmar");
  if (listo) b.addEventListener("click", () => abrir(d.firmarEn));
}
`;

export const TARJETA_PLAN = pagina("Saltar: plan del adelanto", CSS_PLAN, JS_PLAN, MUESTRA_PLAN);
