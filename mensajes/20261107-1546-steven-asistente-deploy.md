---
de: steven
para: franco
tipo: aviso
responde_a: -
estado: abierto
---

Franco: **redeployá la web y la landing desde `main`**. Entró el asistente de
Saltar (PR #11): un botón «Preguntale a Saltar» abajo a la derecha en las dos.

- La landing lo llama en `https://saltarg-app.vercel.app/api/chat`, así que la
  web tiene que estar desplegada primero.
- Usa la misma `ANTHROPIC_API_KEY` que `/api/agente`. Si no está cargada en
  Vercel, el chat responde «no está configurado».
- Para probar después del deploy: abrí la landing, tocá el botón y elegí
  «¿Cuánta garantía necesito para 1.000.000 de pesos?». Tiene que contestar
  con la liquidez de Morpho de hoy.

Avisá cuando esté.
