// Herramientas del MCP. Todas son de lectura: ninguna firma ni manda
// transacciones (regla 4 de AGENTS.md). Las direcciones, la lectura de Morpho
// y las reglas del tope se reusan tal cual de packages/agente.
import { McpServer } from "@modelcontextprotocol/server";
import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { arbitrum } from "viem/chains";
import { z } from "zod";
import { CHAIN_ID, RPC_DEFAULT, TOKENS } from "../../agente/src/direcciones";
import { leerOnchain } from "../../agente/src/onchain";
import { consultarBcra } from "../../agente/src/bcra";
import { decidir, type Bcra } from "../../agente/src/reglas";
import type { Env, Props } from "./tipos";
import { registrarFlujo } from "./flujo";

const erc20 = parseAbi(["function balanceOf(address) view returns (uint256)"]);

const texto = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const error = (mensaje: string) => ({ content: [{ type: "text" as const, text: mensaje }], isError: true });

const SIN_WALLET =
	"Tu usuario de Privy no tiene una wallet EVM vinculada. Entrá a la web del equipo con el mismo login para que Privy te cree una, y volvé a conectar el MCP.";

export function crearServidor(env: Env, props: Props | undefined) {
	const server = new McpServer({ name: "saltarg", version: "0.1.0" });
	const rpc = env.ARBITRUM_RPC_URL || RPC_DEFAULT;

	server.registerTool(
		"quien_soy",
		{
			description:
				"Devuelve el usuario con el que entraste por Privy: su id (did:privy:...), su email si tiene, y la wallet EVM que usan las demás herramientas.",
		},
		async () => (props ? texto(props) : error("Sin sesión: conectá el MCP con login de Privy.")),
	);

	server.registerTool(
		"saldos",
		{
			description:
				"Saldos en Arbitrum One de la wallet con la que entraste: ETH (para gas), ARGt (peso tokenizado de Twin), CHLt (peso chileno tokenizado) y USDT0. Sólo lectura.",
		},
		async () => {
			if (!props?.wallet) return error(SIN_WALLET);
			const wallet = props.wallet as `0x${string}`;
			const client = createPublicClient({ chain: arbitrum, transport: http(rpc, { timeout: 15_000 }) });
			const token = (t: keyof typeof TOKENS) =>
				client.readContract({ address: TOKENS[t].address, abi: erc20, functionName: "balanceOf", args: [wallet] });
			const [eth, argt, chlt, usdt0] = await Promise.all([
				client.getBalance({ address: wallet }),
				token("ARGt"),
				token("CHLt"),
				token("USDT0"),
			]);
			return texto({
				red: `Arbitrum One (${CHAIN_ID})`,
				wallet,
				saldos: {
					ETH: Number(formatUnits(eth, 18)),
					ARGt: Number(formatUnits(argt, TOKENS.ARGt.decimals)),
					CHLt: Number(formatUnits(chlt, TOKENS.CHLt.decimals)),
					USDT0: Number(formatUnits(usdt0, TOKENS.USDT0.decimals)),
				},
				tokens: TOKENS,
			});
		},
	);

	server.registerTool(
		"mercado_y_posicion",
		{
			description:
				"Lee el mercado de Morpho Blue donde se pide ARGt dejando USDT0 de colateral (liquidez disponible, precio del oráculo, punto de liquidación, tasa anual) y la posición de tu wallet en ese mercado (colateral y deuda). Sólo lectura.",
		},
		async () => {
			if (!props?.wallet) return error(SIN_WALLET);
			const o = await leerOnchain(props.wallet, rpc);
			return texto({ wallet: o.wallet, mercado: o.mercado, posicion: o.posicion });
		},
	);

	server.registerTool(
		"cuanto_puedo_pedir",
		{
			description:
				"Calcula cuánto ARGt puede pedir hoy tu wallet contra su colateral en Morpho, con las reglas del agente del equipo: tope de 60% del colateral (menos si la Central de Deudores del BCRA muestra problemas), recortado por la liquidez del mercado. No pide nada: sólo simula. ARGt no genera intereses; el costo del adelanto es un descuento sobre la factura.",
			inputSchema: z.object({
				cuit: z
					.string()
					.optional()
					.describe("CUIT de la empresa (11 dígitos) para consultar el BCRA. Sin CUIT el tope queda en 50% hasta poder verificar."),
				colateral_extra_usdt0: z
					.number()
					.min(0)
					.optional()
					.describe("USDT0 que pensás sumar de colateral, para simular."),
				pedido_argt: z.number().min(0).optional().describe("ARGt que querés pedir. Si falta, devuelve el máximo."),
			}),
		},
		async ({ cuit, colateral_extra_usdt0, pedido_argt }) => {
			if (!props?.wallet) return error(SIN_WALLET);
			const sinCuit: Bcra = {
				ok: false,
				situacionMax: null,
				deudaTotalArs: 0,
				entidades: 0,
				chequesRechazados: 0,
				error: "Sin CUIT: no se consultó el BCRA.",
			};
			const [onchain, bcra] = await Promise.all([leerOnchain(props.wallet, rpc), cuit ? consultarBcra(cuit) : sinCuit]);
			const decision = decidir({
				bcra,
				mercado: onchain.mercado,
				posicion: onchain.posicion,
				colateralExtraUsdt0: colateral_extra_usdt0,
				pedidoArgt: pedido_argt,
			});
			return texto({ wallet: onchain.wallet, bcra, mercado: onchain.mercado, posicion: onchain.posicion, decision });
		},
	);

	registrarFlujo(server, env, props);
	return server;
}
