# Stack de Twin: tokens, pools, vaults y tracción

Fuentes: [twinfinance.notion.site/stack](https://twinfinance.notion.site/stack)
(pools y vaults, sólo Arbitrum) y
[stablecoins.twin.finance](https://stablecoins.twin.finance/) (direcciones de
los tokens y tracción; datos de Dune, cotizaciones de CriptoYa). Leído el
7/11/2026. Antes de usar una dirección, confirmar red y dirección juntas.

## Tokens (ERC-20)

| Token | Ethereum | Arbitrum | Base | Polygon |
|---|---|---|---|---|
| ARGt | `0x59863989d080b22476db95656d0c3cc18be92214` | `0x59863989d080b22476db95656d0c3cc18be92214` | `0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd` | `0x50464be58912745447e24eb3bbdedcee10d3e056` |
| BOLt | `0x619FB742CB2B77361793DAaEBac8017642178a56` | `0x1edf5e61b6a4fe19fef3a695328f61aaa07728ea` | `0x1d2e8c1fe82ab2ad8dc43ed98a2f507dfb5b4995` | `0x20eca820d3cd00ed9c9f2861cdf6429bacd8ed55` |
| BRAt | `0xFEE29845569570F8e0119291dff77B7b93283aaB` | `0xc4ed6aba5373d78e160f4df39e011f078be54df8` | `0xfee29845569570f8e0119291dff77b7b93283aab` | `0x59863989d080b22476db95656d0c3cc18be92214` |
| CHLt | `0x350fc4F9aA8Fd42db5e8a7242E80beaeD76Db7bb` | `0xe8dbc4680235ccaeff48e4c0b0eaceebb89e5e17` | `0x95ef2370166b250e7ce3b8f236c7e7e9fed12c2e` | `0xfa658f62ca6cacaa769035adbcbed9bf75f9f72d` |
| COLt | `0xf016413834E6D1A14F3D628B11D6Ef725a6bdbDD` | `0xa16d5db80a45157e0e451750b81ff0cc0b61d558` | `0xd70ad085684b2a9f4b5d54d7bdb2eca37a273216` | `0x1ea02ba45fc146f534b371c49fbb2a4c86dce93d` |
| MEXt | `0x25DF36D0ec7D26EC791316167A5E949e65c9F8E5` | `0xb96aa6babccd738d6644add4912fe5efbebf5a25` | `0x59863989d080b22476db95656d0c3cc18be92214` | `0xb9a848a8e1aff1a16a27f1ad3b66d873d5c38d62` |
| PERt | `0x6d937FF125CAeb81B33EE166be50f482d61e1466` | `0x899438713f62b04d6cd8e8709986f7256fb6e3d9` | `0xd09aba2969b822d66dc4bc3bb58ee520bcf9f0c3` | `0x53bd6e8af3da05781afc98729378424f66c9da52` |

Ojo: la misma dirección `0x5986…2214` es ARGt en Ethereum y Arbitrum, BRAt en
Polygon y MEXt en Base. Nunca usar una dirección sin su red.

## Pools de Curve en Arbitrum (token / USDT0)

| Token | Pool |
|---|---|
| ARGt | [`0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853`](https://www.curve.finance/dex/arbitrum/pools/0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853) |
| BRAt | [`0xEef48Df5F1c509cD9730774b4e8A4464626ef8D5`](https://www.curve.finance/dex/arbitrum/pools/0xEef48Df5F1c509cD9730774b4e8A4464626ef8D5) |
| COLt | [`0x7D2dFfa9e903b8377c96196dA424C7965b06BCc3`](https://www.curve.finance/dex/arbitrum/pools/0x7D2dFfa9e903b8377c96196dA424C7965b06BCc3) |
| PERt | [`0x41af8cC0811DD07F167752B821CF5B11DBa7Ca85`](https://www.curve.finance/dex/arbitrum/pools/0x41af8cC0811DD07F167752B821CF5B11DBa7Ca85) |
| MEXt | [`0x6EdBF3adA7B6D9524c3248955538D573AAE449CF`](https://www.curve.finance/dex/arbitrum/pools/0x6EdBF3adA7B6D9524c3248955538D573AAE449CF) |
| CHLt | [`0xA087f05ecD245476d7844f6eab28D98724696ac2`](https://www.curve.finance/dex/arbitrum/pools/0xA087f05ecD245476d7844f6eab28D98724696ac2) |
| BOLt | [`0x9c7809c813BcC67e288c56d5Ce5e0225996bFcD2`](https://www.curve.finance/dex/arbitrum/pools/0x9c7809c813BcC67e288c56d5Ce5e0225996bFcD2) |

## Vaults de Morpho «Prime» en Arbitrum (chain 42161)

| Token | Vault |
|---|---|
| ARGt | [`0x9Dd3F844747AB78d616BF76DB92756E17A064aDD`](https://www.monarchlend.xyz/vault/42161/0x9Dd3F844747AB78d616BF76DB92756E17A064aDD) |
| BRAt | [`0x207396cbe2f6f50670eaa69584c9f723924c7fe9`](https://www.monarchlend.xyz/vault/42161/0x207396cbe2f6f50670eaa69584c9f723924c7fe9) |
| COLt | [`0x596FD4C6cAb1aeBCe2a847773Ca87F24349D0c56`](https://www.monarchlend.xyz/vault/42161/0x596FD4C6cAb1aeBCe2a847773Ca87F24349D0c56) |
| MEXt | [`0x3046bc254bD2269eC5C3478692be619441Bb11A5`](https://www.monarchlend.xyz/vault/42161/0x3046bc254bD2269eC5C3478692be619441Bb11A5) |
| PERt | [`0x5eD1aeFACb3B6CCC3F924B1d8915754Ed780266F`](https://www.monarchlend.xyz/vault/42161/0x5eD1aeFACb3B6CCC3F924B1d8915754Ed780266F) |
| CHLt | [`0xb5cd19e8e884e8e0e6dD8eDF54C172BD865A7BAd`](https://www.monarchlend.xyz/vault/42161/0xb5cd19e8e884e8e0e6dD8eDF54C172BD865A7BAd) |
| BOLt | [`0x8dE92AFea0266A67c451b5AD1318bc0A9d834a7E`](https://www.monarchlend.xyz/vault/42161/0x8dE92AFea0266A67c451b5AD1318bc0A9d834a7E) |

## Tracción (todas las monedas, desde el lanzamiento)

| Dato | Valor |
|---|---|
| Oferta en circulación | 10,2 M USDT |
| Holders | 394 |
| Transferencias | 10.300 |
| Volumen transferido | 44,0 M USDT |

## Lo que importa para la demo

- **Casi todo el ARGt está en el vault de Morpho:** 16.000 M ARGt
  (unos 9,7 M USDT). El pool de Curve de ARGt tiene 24,5 M ARGt (unos
  14.800 USDT).
- **CHLt tiene muy poca liquidez:** el pool de Curve CHLt/USDT0 tiene
  3,1 M CHLt (unos 3.100 USDT) y el vault, 19,7 M CHLt (unos 20.100 USDT). Un
  cambio de CHLt a USDT0 de más de unos cientos de dólares va a mover mucho el
  precio: **montos chicos en la demo**.
- **No hay Avalanche** en ninguna de las dos páginas: todo está en Arbitrum
  (y los tokens también en Ethereum, Base y Polygon).
- Los vaults dan rendimiento a quien deposita: en el pitch no prometemos
  ahorro ni rendimiento con ARGt (condición de la CNV).
