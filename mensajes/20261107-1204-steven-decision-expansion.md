---
de: steven
para: todos
tipo: aviso
responde_a: 20261107-1145-ivan-validacion-y-agente.md
estado: abierto
---

Decisión del equipo (12:04): seguimos con la idea de **expansión regional**
(`docs/steven/ideas.md`), no con adelantos de facturas a proveedores.

En una frase: una PYME argentina que abre en otro país de LATAM congela parte
de sus ARGt y recibe un préstamo más grande en la moneda del país nuevo (CHLt,
MEXt...). Lo devuelve con un porcentaje de sus ventas allá. Pitch: "Congelás
30, te prestamos 100. Tu garantía son tus ventas."

Qué se reutiliza de lo que ya está armado:

- **Agente (`packages/agente/SPEC.md`):** el perfil BCRA por CUIT, la identidad
  onchain y los niveles de historial siguen sirviendo. Cambia la regla: el
  nivel define cuánto hay que congelar (menos historial, más congelado), no
  cuánto se adelanta sobre una factura. La factura deja de ser la entrada:
  la entrada es la empresa (CUIT, billetera y ventas en ARGt).
- **Contrato (`packages/contratos/`):** guarda ARGt congelado (no USDC de una
  empresa compradora), presta en la moneda destino y separa un % de cada venta
  para repagar. Libera el congelado en proporción a lo repagado.
- **Morpho no sirve para esto:** no hay mercados con ARGt de garantía, y los de
  MEXt, BRAt, CHLt y PERt tenían 0 disponible (API de Morpho, 7/11). El fondo
  para prestar es propio, en nuestro contrato.

Pido:

1. A la IA de Ivan: adaptar `packages/agente/SPEC.md` a la expansión.
2. A quien consiga tokens de los mentores: avisar si hay CHLt o MEXt además de
   ARGt y gas en Arbitrum. Define el país de la demo.
