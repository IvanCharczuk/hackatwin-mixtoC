// Flujo completo del adelanto desde Claude: leer la factura, decidir el
// préstamo y PREPARAR las transacciones. Nada se firma ni se manda desde acá
// (regla 4 de AGENTS.md): la persona firma con Privy en la web.
import type { McpServer } from "@modelcontextprotocol/server";
import { createPublicClient, formatUnits, getAddress, http, isAddress, type PublicClient } from "viem";
import { arbitrum } from "viem/chains";
import { z } from "zod";
import { RPC_DEFAULT } from "../../agente/src/direcciones";
import { evaluar, type Pedido, type Resultado } from "../../agente/src/index";
import { explicacionArmada } from "../../agente/src/explicar";
import { POOL_CHLT_USDT0, TOPE, chequear, curveAbi, leerCredito } from "./circuito";
import type { Env, Props } from "./tipos";

const WEB_FIRMA = "https://saltarg-app.vercel.app/app";

const SIN_WALLET =
	"Tu usuario de Privy no tiene una wallet EVM vinculada. Entrá a la web del equipo con el mismo login para que Privy te cree una, y volvé a conectar el MCP.";

/** Contrato de salida: el mismo objeto en texto (JSON) y en structuredContent. */
const salida = <T extends object>(v: T) => ({
	content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }],
	structuredContent: v as Record<string, unknown>,
});
const error = (mensaje: string) => ({ content: [{ type: "text" as const, text: mensaje }], isError: true });
const mensajeDe = (e: unknown) => (e instanceof Error ? e.message : String(e));

const bcraSimuladoSchema = z
	.object({
		situacion: z.number().int().min(1).max(5).nullable().describe("Situación en la Central de Deudores: 1 normal … 5 irrecuperable; null = sin deudas."),
		cheques_rechazados: z.number().int().min(0).optional(),
	})
	.optional();

/** Link a la web donde la persona firma con Privy, con el pedido precargado. */
export function linkFirma(monto: number, proveedor?: string, cuit?: string) {
	const u = new URL(WEB_FIRMA);
	u.searchParams.set("monto", String(monto));
	if (proveedor) u.searchParams.set("proveedor", proveedor);
	if (cuit) u.searchParams.set("cuit", cuit.replace(/\D/g, ""));
	return u.toString();
}

/** Redondea para que parseUnits no reciba notación científica ni decimales de más. */
const redondear = (n: number, d = 6) => Number(n.toFixed(d));

export function registrarFlujo(server: McpServer, env: Env, props: Props | undefined) {
	const rpc = env.ARBITRUM_RPC_URL || RPC_DEFAULT;

	server.registerTool(
		"evaluar_factura",
		{
			description:
				"Evalúa una factura para pedir un adelanto en ARGt. Si la persona pegó la factura (PDF o foto), LEELA VOS y extraé los campos: CUIT de quien la recibe y paga (cuit_empresa), CUIT de quien la emite (cuit_proveedor), importe total en pesos (monto_ars), número, y si figuran, vencimiento y wallet del proveedor. Consulta al BCRA (Central de Deudores) a la empresa y al proveedor, lee la wallet con la que entraste en Arbitrum (saldos, colateral y deuda en Morpho) y decide cuánto ARGt se puede adelantar y de dónde se paga la factura. Para una empresa de afuera (por ejemplo chilena) pasá origen con su país e id fiscal (RUT). No pide ni firma nada. ARGt no genera intereses: el costo del adelanto es un descuento sobre la factura.",
			inputSchema: z.object({
				cuit_empresa: z.string().describe("CUIT (11 dígitos) de la empresa que recibe la factura y la paga."),
				cuit_proveedor: z.string().describe("CUIT (11 dígitos) del proveedor que emitió la factura."),
				monto_ars: z.number().positive().describe("Importe total de la factura en pesos (= ARGt)."),
				numero: z.string().optional().describe("Número de la factura, por ejemplo 0003-00001234."),
				vencimiento_pago: z.string().optional().describe("Fecha de vencimiento del pago (AAAA-MM-DD), si figura."),
				wallet_proveedor: z.string().optional().describe("Wallet del proveedor en Arbitrum (0x...), si se conoce: el ARGt le llega directo."),
				origen: z
					.object({
						pais: z.enum(["CL", "AR"]).describe("País de origen de la empresa."),
						id_fiscal: z.string().describe("RUT (Chile) o CUIT (Argentina) de la empresa en su país."),
						simular: z.boolean().optional().describe("true = fuentes de ejemplo, para la demo."),
					})
					.optional()
					.describe("Empresa de afuera: verifica su solvencia en su país de origen."),
				bcra_simulado: bcraSimuladoSchema.describe("Sólo demo: perfil BCRA de ejemplo para la empresa, sin consultar el real."),
				bcra_simulado_proveedor: bcraSimuladoSchema.describe("Sólo demo: perfil BCRA de ejemplo para el proveedor."),
			}),
		},
		async (a) => {
			if (!props?.wallet) return error(SIN_WALLET);
			if (a.wallet_proveedor && !isAddress(a.wallet_proveedor)) return error(`wallet_proveedor inválida: ${a.wallet_proveedor}`);
			const sim = (s: z.infer<typeof bcraSimuladoSchema>) =>
				s ? { situacion: s.situacion, chequesRechazados: s.cheques_rechazados } : undefined;
			const pedido: Pedido = {
				cuit: a.cuit_empresa,
				wallet: props.wallet,
				// Sin llamar a la API de Anthropic desde el Worker: la explicación es la armada.
				conExplicacion: false,
				bcraSimulado: sim(a.bcra_simulado),
				factura: {
					cuitProveedor: a.cuit_proveedor,
					montoArs: a.monto_ars,
					numero: a.numero,
					bcraSimulado: sim(a.bcra_simulado_proveedor),
				},
				origen: a.origen ? { pais: a.origen.pais, idFiscal: a.origen.id_fiscal, simular: a.origen.simular } : undefined,
			};
			let r: Resultado;
			try {
				r = await evaluar(pedido);
			} catch (e) {
				return error(`No se pudo evaluar la factura: ${mensajeDe(e)}`);
			}
			r.explicacion = { texto: explicacionArmada(r.decision, r.perfil.bcra), fuente: "armada" };
			// Agregado (no cambia Resultado): lo que hace falta para preparar_adelanto.
			// Se pide lo que falta después de usar el ARGt que ya tiene; preparar_adelanto
			// calcula los CHLt de respaldo nuevo, así que no depende del colateral de hoy.
			const argt = redondear(Math.max(0, a.monto_ars - r.perfil.onchain.saldos.ARGt), 2);
			return salida({
				...r,
				siguiente: {
					herramienta: "preparar_adelanto",
					argt,
					pagar_a: a.wallet_proveedor ? getAddress(a.wallet_proveedor) : null,
					cuit: a.cuit_empresa.replace(/\D/g, ""),
					vencimiento_pago: a.vencimiento_pago ?? null,
				},
			});
		},
	);

	server.registerTool(
		"preparar_adelanto",
		{
			description:
				"PREPARA (no firma, no manda) el adelanto en ARGt para la wallet con la que entraste: pone CHLt, los cambia a USDT0 en Curve, los deja de colateral en Morpho y pide ARGt, que van a tu wallet o directo al proveedor. Lee la cadena y corre los chequeos previos (C1 tenés los CHLt, C2 gas, C3 el cambio rinde, C4 liquidez, C5 límite del 60%, C6 permisos) y arma cada transacción (to + data). Devuelve firmarEn: el link a la web donde la persona revisa y firma con Privy. Esta herramienta nunca firma ni envía nada.",
			inputSchema: z.object({
				argt: z.number().positive().describe("ARGt a pedir prestado (por ejemplo el monto de la factura o lo que sugirió evaluar_factura)."),
				chlt: z
					.number()
					.positive()
					.optional()
					.describe("CHLt que la persona pone de respaldo. Si falta, se calcula lo justo para el límite del 60% más 5% de margen."),
				pagar_a: z.string().optional().describe("Wallet del proveedor (0x...) para que el ARGt le llegue directo. Si falta, va a tu wallet."),
				cuit: z.string().optional().describe("CUIT de la empresa, para precargar la web de firma."),
			}),
		},
		async (a) => {
			if (!props?.wallet) return error(SIN_WALLET);
			if (a.pagar_a && !isAddress(a.pagar_a)) return error(`pagar_a inválida: ${a.pagar_a}`);
			const wallet = getAddress(props.wallet);
			const pagarA = a.pagar_a ? getAddress(a.pagar_a) : wallet;
			const argt = redondear(a.argt, 6);
			try {
				const client = createPublicClient({ chain: arbitrum, transport: http(rpc, { timeout: 15_000 }) }) as PublicClient;
				const credito = await leerCredito(client, wallet);
				let chlt = a.chlt;
				if (!chlt) {
					// Respaldo que falta para que deuda + argt entre en el 60%, pasado a CHLt al precio del pool.
					const chltPorUsdt0 = await client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "price_oracle" });
					const usdt0 = Math.max(0, (credito.deudaArgt + argt) / TOPE / credito.argtPorUsdt0 - credito.garantiaUsdt0) * 1.05;
					chlt = Math.max(1, Math.ceil(usdt0 * Number(formatUnits(chltPorUsdt0, 18))));
				}
				chlt = redondear(chlt, 6);
				const r = await chequear(client, wallet, credito, chlt, argt, pagarA);
				return salida({
					ok: r.ok,
					wallet,
					chlt,
					argt,
					pagarA,
					chequeos: r.chequeos,
					pasos: r.pasos,
					firmarEn: linkFirma(argt, pagarA === wallet ? undefined : pagarA, a.cuit),
				});
			} catch (e) {
				return error(`No se pudo preparar el adelanto: ${mensajeDe(e)}`);
			}
		},
	);

	server.registerPrompt(
		"pedir_adelanto",
		{
			title: "Pedir un adelanto sobre una factura",
			description: "Guía paso a paso: factura → evaluación → cuánto se puede pedir → transacciones listas para firmar en la web.",
		},
		() => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `Quiero pedir un adelanto en ARGt sobre una factura con Saltar. Guiame así, en castellano simple:

1. Pedime la factura (PDF o foto) si todavía no la pegué. Leela vos y sacá: CUIT de quien la recibe y paga, CUIT del proveedor, importe total en pesos, número, vencimiento y la wallet del proveedor si figura. Si falta algo, preguntame sólo eso.
2. Llamá a quien_soy y a saldos para ver con qué wallet entré y qué tengo (ETH para gas, CHLt, USDT0, ARGt).
3. Llamá a evaluar_factura con los datos de la factura. Si la empresa es de afuera (por ejemplo chilena), pasá origen con su país y su RUT.
4. Llamá a cuanto_puedo_pedir con el CUIT de la empresa para confirmar el tope.
5. Llamá a preparar_adelanto con los ARGt a pedir (lo que sugirió evaluar_factura) y la wallet del proveedor si la hay.
6. Explicame el resultado en pocas líneas: cuánto ARGt, cuánto CHLt pongo de respaldo, qué chequeos pasaron o fallaron y qué hacer si alguno falló, y los pasos que voy a firmar.
7. Terminá con el link firmarEn: ahí reviso y firmo con mi login de Privy. Vos no firmás ni mandás nada.

Recordá: ARGt no genera intereses. El costo del adelanto es un descuento sobre la factura, no una tasa.`,
					},
				},
			],
		}),
	);
}
