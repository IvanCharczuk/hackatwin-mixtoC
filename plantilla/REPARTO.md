# Reparto

Cómo trabajamos en paralelo sin pisarnos.

## Ramas

- Una rama por persona y por compu: `<nombre>/<compu>`. Por ejemplo
  `ana/mac` y `ana/pc` si Ana tiene una notebook con ella y otra compu
  corriendo agentes en su casa. `scripts/init` las crea.
- Nadie pushea a `main`. A `main` se llega por PR desde tu rama, y lo
  aprueba otra persona del equipo (o vos, si tu otra compu abrió el PR).
- PR chicos y seguidos: mejor cinco de 30 minutos que uno de cinco horas.
- Antes de abrir un PR: `git fetch && git merge origin/main` en tu rama y
  los checks de tu spec en verde.

## Quién toca qué

Completar al arrancar. Una carpeta tiene un solo dueño a la vez; si
necesitás tocar la de otro, se avisa en el chat del equipo.

| Persona | Rama(s) | Carpetas | Specs |
|---|---|---|---|
| <nombre> | `<nombre>/mac`, `<nombre>/pc` | `<carpeta>/` | `specs/01-…` |
| <nombre> | `<nombre>/mac` | `<carpeta>/` | `specs/02-…` |
| <nombre> | `<nombre>/mac` | `<carpeta>/` | `specs/03-…` |

Lo compartido (`README.md`, `PITCH.md`, `docs/entrega.md`) lo edita quien
tenga asignada esa tarea en `TAREAS.md`.

## Bloques de trabajo

Cada tarea grande de `TAREAS.md` puede tener su archivo de bloque en
`specs/` con dueño, de qué depende, tiempo estimado y pasos. Una tarea
`compartida` (por ejemplo, la demo final) la cierran todos juntos.
