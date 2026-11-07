# AGENTS.md

Contrato para cualquier agente (Claude Code, Codex, Cursor u otro) que trabaje
en este repo. Es corto a propósito: leelo entero.

1. **Spec primero.** Antes de tocar nada, leé la spec activa en `specs/`
   (la que te pasaron o la que figura en tu tarea de `TAREAS.md`). Si no hay
   spec, pedila o escribila con `specs/PLANTILLA.md`.
2. **No te salgas del alcance.** Lo que no está en el "dentro" de la spec,
   no se hace: se anota en `TAREAS.md` y se avisa.
3. **Sólo tu rama.** Trabajás en la rama de quien te lanzó
   (`<nombre>/<compu>`, ver `REPARTO.md`) y sólo en sus carpetas.
4. **Nunca `main` directo.** No pushees a `main`, no fusiones y no uses
   `--force` ni `--no-verify`. A `main` se llega por PR, que revisa otra
   persona.
5. **Listo es con check.** No digas "listo" sin correr el check de cada
   criterio de aceptación de la spec y verlo en verde. Si un check falla, se
   arregla el código, no el check.
6. **Nada irreversible sin una persona.** No mandes mails, no publiques, no
   borres datos, no gastes plata ni toques cuentas de servicios sin que
   alguien del equipo lo confirme en el momento.
7. **Secretos fuera del repo.** Claves sólo en `.env` (ignorado por git) o
   en las variables de entorno del deploy. Si ves una clave en el código,
   pará y avisá.
8. **Sesiones cortas.** Una tarea por sesión. Al terminar, dejá en la tarea
   de `TAREAS.md` qué hiciste y qué falta, para que la próxima sesión arranque
   leyendo eso (ver `docs/tokens.md`).
9. **Seguí `CONCEPTO.md`.** Las decisiones de UI, de copy y de mensajes
   siguen `CONCEPTO.md`. Si falta una decisión, proponela y anotala ahí en
   vez de usar el valor por defecto de la herramienta.
