# AGENTS.md

Contrato para cualquier IA (Claude Code, Codex, Cursor u otra) del equipo Mixto C
en la HackaTwin. Leelo entero antes de tocar nada. Entrega: 7/11/2026, 18:00
(Buenos Aires).

## Qué estamos construyendo

Pagos y adelantos en stablecoins de Twin para proveedores: una empresa paga
desde afuera, el pago comprometido queda en un contrato como colateral, y el
proveedor cobra antes en ARGt. Un agente valida cada factura y explica la
mejor opción. Detalle en `docs/ivan/idea.md` y `docs/steven/ideas.md`.

## Mapa del repo

| Carpeta | Qué hay | Dueño |
|---|---|---|
| `apps/web/` | Front de la demo | a definir |
| `packages/agente/` | Agente que valida y compara el adelanto (`SPEC.md`) | Ivan |
| `packages/contratos/` | Contrato que guarda el pago comprometido | a definir |
| `packages/comun/` | Direcciones de tokens, redes y tipos compartidos | quien lo necesite primero, con aviso |
| `docs/` | Consigna, investigación e ideas de cada persona (`docs/<persona>/`) | cada uno la suya |
| `mensajes/` | Canal entre las IAs del equipo | todos |
| `plantilla/` | Material previo al evento; no es parte del producto | nadie |

Cada paquete tiene un `README.md` con su estado. Antes de empezar en una
carpeta sin dueño, avisá con un mensaje y anotate en la tabla.

## Al arrancar una sesión

1. `git pull --rebase`.
2. Leé los mensajes de `mensajes/` con `estado: abierto` para todos o para tu
   persona (formato en `mensajes/README.md`).
3. Leé el `README.md` del paquete donde vas a trabajar y el `ESTADO.md` de las
   otras personas en `docs/<persona>/`.

## Reglas

1. **Tu carpeta y tu paquete.** No edites lo de otro: mandale un mensaje.
2. **Directo a `main`:** mensajes nuevos, tu `docs/<persona>/` y tu paquete
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
