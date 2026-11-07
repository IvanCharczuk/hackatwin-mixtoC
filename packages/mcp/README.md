# mcp

MCP remoto del equipo en Cloudflare Workers. Se agrega por URL en Claude,
Claude Code o Cursor; el login es Privy (email o wallet), el mismo usuario y la
misma wallet que la web. Todas las herramientas son de lectura: ninguna firma
ni manda transacciones (regla 4 de `AGENTS.md`).

- **Dueño:** Steven
- **Estado:** desplegado en `https://mixtoc-mcp.stevenmolina.workers.dev/mcp`.
  Probado de punta a punta el 7/11 a las 14:45: registro, login con email en
  Privy, autorizar, token y las cuatro herramientas contra Arbitrum.
- **Lee de:** Privy (usuario y wallet), Arbitrum por RPC, Morpho y el BCRA.
  Reusa direcciones, lectura de Morpho y reglas del tope de `packages/agente`.

## Herramientas

| Herramienta | Qué devuelve |
|---|---|
| `quien_soy` | Usuario de Privy (`did:privy:...`), email y la wallet que usan las demás |
| `saldos` | ETH, ARGt, CHLt y USDT0 de tu wallet en Arbitrum One |
| `mercado_y_posicion` | Mercado ARGt/USDT0 de Morpho (liquidez, precio, tasa) y tu colateral y deuda ahí |
| `cuanto_puedo_pedir` | Cuánto ARGt podés pedir hoy con las reglas del agente (tope 60%, BCRA, liquidez). Simula, no pide |

## Agregarlo

- **Claude (web o desktop):** Configuración, Conectores, Agregar conector
  personalizado, URL `https://mixtoc-mcp.stevenmolina.workers.dev/mcp`.
- **Claude Code:** `claude mcp add --transport http mixtoc https://mixtoc-mcp.stevenmolina.workers.dev/mcp`
  y después `/mcp` para entrar.
- **Cursor:** en `mcp.json`, `{"mixtoc": {"url": "https://mixtoc-mcp.stevenmolina.workers.dev/mcp"}}`.

Se abre la página de login: entrás con Privy, ves qué app pide acceso y
apretás Autorizar.

## Cómo funciona

1. El cliente MCP se registra solo (`/register`) y abre `/authorize`.
2. El Worker sirve la página de Privy, que también es el consentimiento: dice
   qué app pide acceso y a dónde vuelve.
3. La página manda el token de Privy a `/callback`. El Worker lo valida (JWT
   ES256 con la clave pública de la app, emisor `privy.io`, audiencia el app
   id) y lee la wallet del usuario con la API de Privy.
4. El Worker le da al cliente su propio token, que lleva adentro el usuario
   de Privy y la wallet. Cada herramienta los recibe.

OAuth 2.1 con PKCE y registro dinámico: `@cloudflare/workers-oauth-provider`.
MCP: `agents/mcp/server` con `@modelcontextprotocol/server`.

## Correr y desplegar

```bash
npm install                          # una vez, en la raíz
cp packages/mcp/.dev.vars.example packages/mcp/.dev.vars   # completar PRIVY_*
npm run -w packages/mcp dev          # compila el login y levanta http://localhost:8788
npm run -w packages/mcp probar       # metadatos, registro, /authorize, 401 (otra terminal)
npm run -w packages/mcp typecheck
npm run -w packages/mcp deploy       # wrangler deploy (cuenta de Steven)
```

Secretos en producción: `PRIVY_APP_ID` y `PRIVY_APP_SECRET` con
`wrangler secret put`. Opcional `ARBITRUM_RPC_URL`. KV `OAUTH_KV` guarda
clientes, consentimientos y tokens.

Privy: la app "hacka" no tiene dominios permitidos cargados, así que acepta
cualquier origen. Si se cargan, hay que sumar
`https://mixtoc-mcp.stevenmolina.workers.dev` (y `http://localhost:8788` para
local).
