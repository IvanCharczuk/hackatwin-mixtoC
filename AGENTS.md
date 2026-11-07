# AGENTS.md

Contrato para cualquier IA (Claude Code, Codex, Cursor u otra) del equipo Mixto C
en la HackaTwin. Leelo entero antes de tocar nada. Entrega: 7/11/2026, 18:00
(Buenos Aires).

## Qué estamos construyendo

Dirección del equipo desde las 12:10: una empresa de afuera (el ejemplo es
chilena) que entra a Argentina usa sus stablecoins de colateral y recibe ARGt
para operar acá, con transacciones reales en Morpho y Curve (ver
`packages/circuito/SPEC.md`). Las ideas en discusión, una por archivo, están en
`docs/ideas/`; la decisión vigente se anuncia en `mensajes/`.

## Mapa del repo

| Carpeta | Qué hay | Dueño |
|---|---|---|
| `apps/web/` | Front de la demo | Franco |
| `apps/landing/` | Landing pública (diseño C · Amanecer) | Steven |
| `packages/agente/` | Agente que valida la factura y arma el perfil (`SPEC.md`) | Ivan (en pausa) |
| `packages/circuito/` | Circuito CHLt → colateral en Morpho → ARGt → repago (`SPEC.md`) | Franco |
| `packages/contratos/` | Contrato que guarda el pago comprometido | a definir |
| `packages/comun/` | Direcciones de tokens, redes y tipos compartidos | quien lo necesite primero, con aviso |
| `packages/mcp/` | MCP remoto con login Privy | Steven |
| `docs/estado.md` | Estado del equipo: una sección por persona | cada uno su sección |
| `docs/ideas/` | Ideas en discusión, un archivo por idea | quien la propone |
| `docs/investigacion/` | Regulación, competencia, números y consigna (`research.md`, `sources/`) | todos, con fuentes |
| `mensajes/` | Canal entre las IAs del equipo | todos |
| `plantilla/` | Material previo al evento; no es parte del producto | nadie |

Cada paquete tiene un `README.md` con su estado. Antes de empezar en una
carpeta sin dueño, avisá con un mensaje y anotate en la tabla.

## Al arrancar una sesión

1. `git pull --rebase`.
2. Leé los mensajes de `mensajes/` con `estado: abierto` para todos o para tu
   persona (formato en `mensajes/README.md`).
3. Leé `docs/estado.md` y el `README.md` del paquete donde vas a trabajar.
4. Dejá corriendo el vigía del canal, en segundo plano:
   `scripts/escuchar --para <tu persona>`. Cada 25 segundos hace `git fetch` y
   avisa cuando llega un mensaje nuevo para todos o para tu persona (no hace
   pull ni toca tu trabajo). En Claude Code, corrélo en segundo plano o con
   Monitor para que te despierte; en Codex o Cursor, en una terminal aparte.
   Cuando avise, `git pull --rebase` y leé el mensaje entero.

## Reglas

1. **Un lugar para todos, por tema.** No hay carpetas por persona: lo que
   escribas va en `docs/ideas/`, `docs/investigacion/` o el paquete que
   corresponda. Tu estado, en tu sección de `docs/estado.md`. No edites lo que
   escribió otro: mandale un mensaje.
2. **Directo a `main`:** mensajes nuevos, tu sección de `docs/estado.md`, tus
   archivos de `docs/` y tu paquete
   mientras sea sólo tuyo. **Por PR:** cambios en `packages/comun/`, en este
   archivo, en `README.md` o en un paquete de otro.
3. **Un solo `npm install` en la raíz.** Los paquetes son workspaces de npm;
   las dependencias se agregan con `npm install <dep> -w packages/<paquete>`.
4. **Nada irreversible sin una persona.** No mandes transacciones con fondos,
   no publiques, no borres y no toques cuentas sin que alguien del equipo lo
   confirme en el momento.
5. **Secretos en `.env`**, nunca en el repo: es público. Las variables que hacen
   falta van en `.env.example` sin valores.
6. **Listo es con check.** No digas "listo" sin correr los criterios de
   aceptación de la spec del paquete y verlos en verde.
7. **Fuentes.** Lo que afirmes sobre regulación, mercado o protocolos va con el
   link de donde salió. Si no lo verificaste, decilo.
8. **Sin promesas de rendimiento.** ARGt no genera intereses (condición de la
   CNV): el costo del adelanto es un descuento sobre la factura.
