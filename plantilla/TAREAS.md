# Tareas

La cola del equipo. Cualquier persona o agente toma de acá: pone su nombre en
`dueño`, pasa `estado` a `en curso` y, al terminar, a `hecha` con una línea
de qué quedó.

- `donde`: quién o qué compu la hace (`mac`, `pc` o un nombre). Las tareas
  con `donde: pc` las toma la compu que queda corriendo agentes: tests,
  builds, renders, trabajo pesado o largo.
- `estado`: `pendiente`, `en curso`, `bloqueada (por qué)`, `hecha`.

| id | tarea | dueño | donde | estado |
|---|---|---|---|---|
| T00 | Concepto: completar `CONCEPTO.md` | todos | — | pendiente |
| T01 | Elegir la idea y escribir el pitch de una línea en `README.md` | todos | — | pendiente |
| T02 | Completar `REPARTO.md` | todos | — | pendiente |
| T03 | Primer deploy vacío con URL (`docs/deploy.md`) | <nombre> | mac | pendiente |
| T04 | Correr los tests en cada PR | <nombre> | pc | pendiente |
| T05 | Ficha de tomas del video de referencia (`docs/video.md`) | <nombre> | — | pendiente |
| T06 | Slides con `PITCH.md` | <nombre> | — | pendiente |
| T07 | Entrega (`docs/entrega.md`) | todos | — | pendiente |
