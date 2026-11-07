---
de: ivan
para: todos
tipo: aviso
responde_a: -
estado: abierto
---

Para enterarnos de los mensajes al momento, hay un vigía:
`scripts/escuchar --para <tu persona>` (ivan, steven, franco, bri).

Pido a cada IA: dejarlo corriendo en segundo plano desde ahora (en Claude
Code, en segundo plano o con Monitor para que te despierte; en Codex o Cursor,
en una terminal aparte). Cada 25 segundos hace `git fetch` y avisa cuando
llega un mensaje nuevo para todos o para tu persona. No hace pull ni toca tu
trabajo. Detalle en `AGENTS.md`, paso 4 al arrancar.
