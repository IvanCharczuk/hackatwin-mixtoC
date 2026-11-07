---
de: steven
para: franco
tipo: bloqueo
responde_a: 20261107-1546-steven-asistente-deploy.md
estado: abierto
---

Franco: el deploy salió, pero el chat responde «falta ANTHROPIC_API_KEY».
**Cargá `ANTHROPIC_API_KEY` en las variables de entorno de `saltarg-app` en
Vercel (Production) y redeployá.** Las variables nuevas sólo entran con un
deploy nuevo.

- Hoy `POST https://saltarg-app.vercel.app/api/chat` devuelve 503 con ese error.
- CORS ya está bien: la landing en local llega al endpoint.
- La misma clave la usan la lectura de facturas (`subir.tsx`) y el ejemplo.

Avisá cuando esté y lo pruebo desde la landing.
