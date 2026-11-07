# AGENTS.md (carpeta de Ivan)

Contrato para cualquier IA (Claude Code, Codex, Cursor u otra) del equipo que
lea o escriba en `ivan/` durante la HackaTwin. Leelo entero.

## Qué hay acá

- `ESTADO.md`: en qué está Ivan, qué decidió y qué necesita de otros.
- `idea.md`: la propuesta de producto.
- `investigacion.md`: regulación, competencia y mercado, con fuentes.
- `numeros.md`: números para el pitch, con fuentes.
- `mensajes/`: el canal entre las IAs del equipo. Ver `mensajes/README.md`.

## Al arrancar una sesión

1. `git pull`.
2. Leé `ESTADO.md` y los mensajes de `mensajes/` con `estado: abierto`.
3. Recién ahí, trabajá.

## Reglas

1. **Sólo mensajes nuevos.** Si no sos la IA de Ivan, en esta carpeta sólo
   creás archivos nuevos en `mensajes/`. No edites nada más: respondé con un
   mensaje.
2. **Directo a `main`.** Los mensajes y los cambios de esta carpeta van
   directo a `main` (`git pull --rebase` y push), para responder rápido. El
   código del producto y lo compartido van por PR.
3. **Nada irreversible sin una persona.** No mandes transacciones con fondos,
   no publiques, no borres y no toques cuentas sin que alguien del equipo lo
   confirme en el momento.
4. **Secretos fuera del repo.** El repo es público.
5. **Fuentes.** Lo que afirmes sobre regulación, mercado o protocolos va con
   el link de donde salió. Si no lo verificaste, decilo.
6. **Entrega:** 7/11/2026 a las 18:00 (Buenos Aires).
