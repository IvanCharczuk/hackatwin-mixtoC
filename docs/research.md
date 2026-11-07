# HackaTwin stablecoins reference

Checked on 7 November 2026 against the received [track brief](sources/2026-11-07-twin-stablecoins.pdf), the organizer's event page and Twin's public documentation. The PDF defines the specific track requirements. Public documentation describes the broader product and is not proof of competition eligibility.

## Event

HackaTwin is in person at Digital House, Monroe 860, Buenos Aires. Check-in is at 08:00, kickoff at 09:00, submissions at 18:00, demo day from 19:00 and closing at 21:00. Teams have up to four members. The PDF dates the event to Saturday 7 November 2026 and rejects late submissions. We use Buenos Aires local time, UTC-3, for the schedule. [Organizer](https://luma.com/cudf7cqz), [brief](sources/2026-11-07-twin-stablecoins.pdf).

## Stablecoin track

Use at least one of ARGt, BRAt, COLt, PERt, MEXt, CHLt or BOLt. Make local currency central to the product and show a real transaction executed by it. The brief suggests agent payments, merchant working capital and currency conversion as starting points. Other ideas are allowed. [Brief, page 1](sources/2026-11-07-twin-stablecoins.pdf).

Submit a public repository identifying tokens, network and contract addresses; an explorer-verifiable transaction hash; and a deployed app or a live demo. Prepare a three-minute pitch with two minutes of questions. Product logic must be built during the event and commit history must show it. Open templates and libraries are allowed. The track prize is 500 USDT plus merchandise. [Brief, page 5](sources/2026-11-07-twin-stablecoins.pdf).

Judging gives equal weight to idea, problem, business and pitch. Each scores 1 to 5. Show an original use of local currency, an identified user with a real problem, a viable business and a clear working demo. [Brief, page 5](sources/2026-11-07-twin-stablecoins.pdf).

## Integration resources

Twin tokens use ERC-20 with 18 decimals. Always identify a contract by network and address together. The same address may represent a different token on another network. Use the current [contract directory](https://docs.twin.finance/en/stablecoins/contracts); do not infer addresses from another chain.

The brief lists Curve pools paired with USDT0 and Morpho Prime vaults on Arbitrum. These are third-party protocols. Their current liquidity and vault state were not checked. Mentors provide small testing amounts and support on site or at `discord.gg/whU99xqnZ`. [Brief, pages 2 and 5](sources/2026-11-07-twin-stablecoins.pdf).

The bridge uses LayerZero V2 OFT. Approve the adapter, call `quoteSend`, then call `send` with the quoted native fee. The destination endpoint ID differs from the chain ID. Confirm the selected route before integration. [Bridge documentation](https://docs.twin.finance/en/stablecoins/bridge).

The brief provides the [belo price API](https://api.belo.app/public/price) and logos at `https://assets.twin.finance/media/tokens/32x32/<TICKER>.svg`. The research fetch observed `ask`, `bid` and `spread`, with no `mid`, and loaded the ARGt logo. A subsequent direct API request from this machine returned HTTP 403. Access and response shape need checking from the application environment; other logos were not checked. [Brief, page 2](sources/2026-11-07-twin-stablecoins.pdf).

## Differences to resolve

- The brief lists Avalanche plus Arbitrum, Base, Polygon and Ethereum. The public [supported networks](https://docs.twin.finance/en/stablecoins/supported-chains) list only the latter four. Ask mentors for Avalanche token addresses and availability.
- The public [contract directory](https://docs.twin.finance/en/stablecoins/contracts) lists ten tokens, adding PRYt, URYt and VENt. The brief names only seven eligible tokens. Keep to the seven unless organizers confirm otherwise.
- The brief says only ARGt bridging is active across four networks. The [bridge page](https://docs.twin.finance/en/stablecoins/bridge), marked last modified 25 August 2026, says all ten tokens have routes across four networks. Neither claim was tested onchain.
- The [event page](https://luma.com/cudf7cqz) uses broad AI, Blockchain and Fintech labels. The PDF supplies the separate stablecoin-track rules and prize. Its 09:00 to 18:00 build window is the useful deadline despite the event's broader twelve-hour description.

## Ask mentors before building

1. Which token and network have testing funds and gas available today? Does a testnet transaction count?
2. Is Avalanche usable, and are bridge routes beyond ARGt live?
3. Are the chosen Curve pool or Morpho vault usable with today's liquidity?
4. Where do we submit, and can one project compete in multiple tracks?

Product idea, team, stack, network, contract deployment and transaction evidence are still undecided. This research did not execute transactions or validate protocol state.
