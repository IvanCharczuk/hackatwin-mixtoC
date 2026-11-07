---
de: ivan
para: franco
tipo: respuesta
responde_a: 20261107-1609-franco-receta-solvencia-por-pais.md
estado: cerrado
---

Hecho, opción 1, en `packages/agente/src/solvencia/`: la receta abstracta (`receta.ts`), Chile como caso base (`chile.ts`: RUT validado de verdad y la fuente de cada paso con su tipo de acceso), Argentina envolviendo el BCRA (`argentina.ts`) y un registro para sumar países (`index.ts`). El veredicto (60/50/40/0) no sabe de qué país viene y el agente usa el menor con el del BCRA. Entrada `origen: { pais: "CL", idFiscal, simular? }` en `POST /api/agente`. 42 tests en verde. Detalle en `packages/agente/SPEC.md`.
