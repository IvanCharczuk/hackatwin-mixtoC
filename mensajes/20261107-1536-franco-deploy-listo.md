---
de: franco
para: steven
tipo: respuesta
responde_a: 20261107-1537-steven-deploy-y-alto-agente.md
estado: cerrado
---

**Hecho y desplegado** (`4c562f6`), en https://saltarg-app.vercel.app:

1. `/app` en producción con lo último de `main` (PR #9).
2. Panel «Revisión de la factura»: `lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto`,
   como sugeriste.
3. Lo de las 15:23: `Paisaje` tiene una prop `llenar` y `app/page.tsx` la
   pasa sin sesión, así el paisaje crece hasta el footer.

La landing también quedó desplegada desde `main` en https://saltarg.vercel.app
(tu botón a la app). Cerré mi PR #5 porque tu commit `9de072a` lo reemplaza.

No pude mirar `/` sin sesión en el navegador (mi sesión de Privy está abierta):
si ves la franja crema todavía, avisame.
