# fork: servidor de prueba

Copia local de Arbitrum One con **plata de mentira**: los mismos contratos de
Twin (ARGt, CHLt), Morpho y Curve, pero corriendo en tu compu. Nada de lo que
pasa acá toca la red real ni cuesta plata. Los scripts se niegan a correr
contra otra URL que no sea `127.0.0.1`.

- **Dueño:** Ivan
- **Estado:** listo y probado (circuito completo en la copia local).

## Uso

```bash
# 1. Levantar el servidor de prueba (dejarlo corriendo en una terminal)
npm run -w packages/fork node

# 2. Cargarle plata de mentira a una wallet (ETH para gas, USDT0 y CHLt)
npm run -w packages/fork fondear -- 0xTuWallet --usdt0 50 --chlt 50000

# 3. Probar el circuito: colateral en Morpho y préstamo de ARGt directo al proveedor
npm run -w packages/fork probar -- 0xTuWallet 0xProveedor --colateral 10 --pedido 5000

# 4. El agente leyendo el servidor de prueba en vez de Arbitrum
ARBITRUM_RPC_URL=http://127.0.0.1:8545 npm run -w packages/agente perfil -- <cuit> 0xTuWallet
```

Para la web (`apps/web`) en modo demo, con transacciones que sí se ejecutan
en la copia local:

```bash
npm run -w packages/fork fondear -- 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --desbloquear
# apps/web/.env.local
NEXT_PUBLIC_MOCK=1
NEXT_PUBLIC_RPC_ARBITRUM=http://127.0.0.1:8545
```

`--desbloquear` hace que el servidor de prueba firme por esa wallet (la de
demo, `MOCK_ADDRESS`) sin clave: un `eth_sendTransaction` desde ella se
ejecuta en la copia local (probado). Para MetaMask: red con RPC
`http://127.0.0.1:8545` y chain id `42161`.

## Resultado de la prueba (7/11/2026)

Con la wallet de prueba `0x…bEEF`: approve, `supplyCollateral` de 10 USDT0 y
`borrow` de 5.000 ARGt con el proveedor como receptor, las tres en `success`.
El proveedor recibió 5.000 ARGt y el agente leyó la posición (colateral 10
USDT0, deuda 5.000 ARGt, puede pedir 4.822 más al 60%).

## Ojo

- Los hashes de acá **no se ven en Arbiscan**: existen sólo en la copia local.
  La consigna pide una transacción real con hash verificable; para esa, los
  mentores de Twin dan montos chicos de prueba (no es plata del equipo).
- La copia arranca del estado actual de Arbitrum: la liquidez de ARGt en
  Morpho es la real (unos 155.000 ARGt).
