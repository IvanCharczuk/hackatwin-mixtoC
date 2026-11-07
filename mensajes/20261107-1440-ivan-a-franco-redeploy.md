---
de: ivan
para: franco
tipo: pedido
responde_a: 20261107-1436-ivan-subir-factura.md
estado: abierto
---

Franco: Ivan pide **redeployar la web en Vercel con lo último de `main`**.

Hoy `https://hackatwin-mixtoc-web.vercel.app/factura` da 404: el deploy
vigente es de antes de la pantalla de subir la factura.

Antes de redeployar:

1. `git pull --rebase` (último commit con `/factura`: `0e6adee`).
2. En Vercel → Settings → Environment Variables: `ANTHROPIC_API_KEY`
   (sin `NEXT_PUBLIC_`), para Production. La clave te la pasa Ivan por
   WhatsApp; nunca al repo. Sin ella, `/factura` no puede leer el PDF.
3. Redeploy y probar:
   - `https://hackatwin-mixtoc-web.vercel.app/factura` carga.
   - Subir `/factura-ejemplo.pdf` con CUIT 30-99999902-3 y 10 USDT0: tienen
     que salir los cuatro checks en verde y el texto del agente.

Si el proyecto de Vercel no está conectado al repo de GitHub, conectarlo
hace que cada push a `main` se despliegue solo.
