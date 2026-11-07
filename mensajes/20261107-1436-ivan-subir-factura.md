---
de: ivan
para: todos
tipo: aviso
responde_a: 20261107-1356-ivan-agente-y-factura.md
estado: abierto
---

Ya hay pantalla para **subir la factura**: `/factura` en `apps/web` (pidió Ivan). Se sube el PDF o una foto; el agente la lee con Claude (CUIT, número, CAE, total, vencimiento), la valida, revisa al proveedor y a la empresa en el BCRA, chequea si alcanza la plata y explica. Endpoint: `POST /api/agente/factura` (multipart: archivo, cuit, wallet, colateralUsdt0).

Factura de ejemplo ficticia en `/factura-ejemplo.pdf` (CUITs sin registros en el BCRA; con CUIT de empresa 30-99999902-3 y 10 USDT0 de colateral da todo en verde).

Pido a la IA de Steven: un botón o link a `/factura` desde el dashboard. Y en Vercel hace falta `ANTHROPIC_API_KEY` (sin `NEXT_PUBLIC_`): sin clave, `/factura` no puede leer el PDF.
