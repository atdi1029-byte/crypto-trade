# Crypto Backtest Notes
## Settings: 10% SL / 18% TP / 50 bar lookforward / 4h timeframe

## Purpose
Collect avg drawdown, avg favorable, and win rate across all crypto tickers
to determine optimal SL/TP targets. User selectively enters trades (~85% actual WR)
so backtester WR (~30%) reflects blind entry on every signal.

## Data Status
ALL tickers flagged/strong. Data complete for tickers #1-529. BACKTEST COMPLETE.

---

## Flagged Tickers (Avoid)

| # | Ticker | Issue |
|---|--------|-------|
| 1 | 0GUSDT | Bad buy (0W/7L, 0% WR, -24% DD) |
| 2 | 1000CATUSDT | Bad buy (0W/14L, 0% WR) |
| 10 | ACTUSDT | Bad buy (8.3% WR, 1W/11L) |
| 13 | ADAUSDT | Bad buy (14.9% WR, big sample 116 sig) |
| 18 | AIAUSDT | Never short (-706% adverse) |
| 20 | AIOTUSDT.P | Never short (-64% sell adverse) |
| 23 | AIXBTUSDT.P | Avoid sells (-34.6% adverse) |
| 32 | ANKRUSD | Bad buy (14% WR, 8W/49L) |
| 39 | ARIAUSDT.P | Bad buy (0% WR, -36% DD) |
| 43 | ARUSDT | Avoid sells (8.3% WR, 2W/22L) |
| 45 | ASTERUSDT | Bad buy (0W/3L, 0% WR) |
| 47 | ATHUSD | Bad both sides (11% buy WR, 0% sell WR) |
| 51 | AUSDT | Bad buy (0W/4L, 0% WR) |
| 53 | AVAUSDT.P | Bad buy (11.1% WR, 1W/8L) |
| 55 | AVNTUSDT | Bad both sides (10% buy WR, 0% sell WR, -25% DD) |
| 69 | BASUSDT.P | Never short (-346% sell adverse) |
| 72 | BCHUSDT | Bad sell (15.4% WR, 0% REDUCE WR) |
| 81 | BLUAIUSDT.P | Bad buy (0W/3L, 0% WR) |
| 84 | BNBUSDT | Bad sell (12.8% WR, -5% edge) |
| 91 | BROCCOLI714USDC | Bad both sides (0% buy, -57% sell adverse) |
| 94 | BTCUSDT | Bad sell (16.7% WR, structurally bullish) |
| 95 | BTRUSDT.P | Never short (-103% sell adverse) |
| 98 | CAKEUSDT | Bad sell (13.3% WR) — but strong buy! |
| 104 | CETUSUSDC | Bad sell (0W/5L, -36% adverse) |
| 109 | CHILLGUYUSDT.P | Bad both (7.1% buy WR 1W/13L, 0W/3L sell) |
| 111 | CHZUSD | Bad sell (0W/6L, 8.3% combined) |
| 114 | CLOUSDT.P | Bad both + never short (-50% buy DD, -96% sell adverse) |
| 115 | COAIUSDT.P | Bad buy (-42% DD, 20% WR) |
| 126 | CTKUSDT.P | Bad sell (6.7% WR, 1W/14L) |
| 127 | CTSIUSD | Bad sell initial (13.3% WR, 4W/26L) |
| 133 | CYSUSDT | Bad both (-69% buy DD, -37% sell adverse) |
| 135 | DEEPUSD | Bad both (0% WR buy 0W/10L, 0% sell, -33% sell adverse) |
| 136 | DEGOUSDT.P | Bad both (11.1% buy WR, 0% sell/reduce) |
| 137 | DENTUSDT.P | Bad buy (19% WR, 11W/47L) |
| 138 | DEXEUSDT | Bad sell (20% WR) + bad reduce (0W/9L) |
| 142 | DOGSUSDT | Bad buy (16.7% WR, 3W/15L) |
| 151 | EDENUSDT | Bad buy (16.7% WR, -26.5% DD) |
| 154 | EIGENUSDT | Bad sell (11.1% WR, 1W/8L, -24% adverse) |
| 158 | ENSOUSDT | Never short (-41% sell adverse) |
| 159 | ENSOUSDT.P | Never short (-40% sell adverse) |
| 161 | EPTUSDT | Bad overall (22% buy, 17% sell, -31% reduce adverse) |
| 169 | EULUSD | Bad buy (11.1% WR, 1W/8L) |
| 170 | EVAAUSDT | Never short (-62% sell adverse) |
| 175 | FIDAUSDT.P | Bad sell (14.3% WR, 1W/6L) |
| 177 | FIOUSDT | Bad sell (6.3% WR, 1W/15L) — but strong buy! |
| 180 | FLOWUSDT | Bad buy (15.6% WR, 7W/38L, -5.64% edge) |
| 181 | FLRUSD | Bad sell (9.1% WR, 1W/10L, -25% adverse) |
| 187 | FUNUSDT | Never short (3.8% sell WR, 1W/25L, -42% adverse) |
| 198 | GRASSUSDT.P | Bad buy (11.1% WR, 1W/8L) |
| 201 | GTCUSDT.P | Bad buy (16% WR, 8W/42L, -5.52% edge) |
| 202 | GTUSDT.P | Bad sell (0% WR, 0W/7L) + bad buy (21.4%) |
| 203 | GUAUSDT | Never short (0% sell WR, -57% adverse, no buy signals) |
| 204 | GUNUSDT | Never short (-52% sell adverse, -75% reduce adverse) |
| 226 | ICPUSDT | Bad buy (26.5% WR, 9W/25L, big sample 67 sig) |
| 244 | JCTUSDT.P | Bad buy (0W/2L, 0% WR, -28.65% DD, no sell signals) |
| 245 | JELLYJELLYUSDT.P | Never short (-121% sell adverse) |
| 250 | KAIAUSDT | Never short (-49.56% sell adverse) |
| 255 | KGENUSDT.P | Bad both (0% buy WR 0W/4L, -21% DD; 0% sell WR) |
| 260 | KOMAUSDT | Bad buy (33.3% WR, -18.96% DD) |
| 277 | LUNA2USD | Bad sell (33.3% WR 4W/8L, -27.81% adverse) |
| 282 | MAGMAUSDT.P | Bad buy (0W/2L, 0% WR, -26.63% DD, no sell) |
| 284 | MANTAUSDT | Bad buy (25.9% WR, 7W/20L) |
| 294 | MEUSDT | Bad buy (22.2% WR, 2W/7L) |
| 298 | MITOUSDT | Bad buy (22.2% WR, 2W/7L) |
| 301 | MOCAUSDT | Bad buy (17.6% WR, 3W/14L) — but sell 81.8%! |
| 310 | MUSDT | Never short (-102.92% sell adverse) |
| 311 | MYXUSDT.P | Never short (-98% sell adverse) |
| 312 | NAORISUSDT.P | Never short (-85.96% sell adverse), 0% buy |
| 318 | NIGHTUSD | Too few signals (2 buy, 0 sell), 0% buy |
| 324 | NXPCUSDC | Bad buy (22.2% WR, 2W/7L) |
| 327 | OKBUSDT | Bad sell (35.3% WR, 12W/22L) |
| 340 | OREUSDT | Bad buy (0% WR, 0W/2L, -33.3% DD, no sell) |
| 344 | PENGUINUSDT | Too few signals (1 buy, 0 sell), 0% buy |
| 345 | PENGUUSDT | Bad buy (20% WR, 1W/4L) |
| 354 | PNUTUSDT | Bad both (30.8% buy, 25% sell) |
| 357 | PORTALUSDT | Bad buy (29% WR, 9W/22L) |
| 364 | PUFFERUSD | Bad buy (12.5% WR, 1W/7L) |
| 371 | QUSD | Never short (-191.2% sell adverse!) |
| 373 | REZUSDC | Bad buy (23.1% WR, 3W/10L) |
| 381 | RIVERUSDT.P | Never short (-101.74% sell adverse) |
| 385 | ROSEUSDT | Bad buy (27.8% WR, 10W/26L) |
| 396 | SCRUSDT | Bad buy (21.1% WR, 4W/15L, -18.27% DD) |
| 421 | SQDUSDT.P | Bad buy (14.3% WR, 1W/6L, -23.94% DD) + extreme sell adverse (-49.6%) |
| 438 | SYNUSDT.P | Never short (-85% sell adverse, 0W/2L sell) — but buy 81%! |
| 445 | TAUSDT.P | Never short (-85.35% sell adverse) |
| 463 | TSTUSDT | Never short (-77.1% sell adverse, 0W/3L sell) — but buy 62.5%! |
| 465 | TURTLEUSDT.P | Bad buy (0W/3L, 0% WR, -15.48% DD) |
| 477 | VANAUSDC | Bad buy (20% WR, 1W/4L, -13.76% DD) |
| 480 | VELVETUSDT.P | Never short (-111.9% sell adverse!) |
| 481 | VETUSDT | Bad buy (33.3% WR, 22W/44L, big sample 115 sig) |
| 484 | VINEUSD | Never short (-109.09% sell adverse) |
| 486 | VTHOUSDT | Bad sell (33.3% WR, 5W/10L, -42.38% adverse, -6.8% edge) |
| 487 | VVVUSD | Bad buy (36.4% WR, 4W/7L, -20.69% DD, -3.77% edge) |
| 488 | WALUSDT | Bad both (0% buy 0W/6L, 0% sell 0W/1L) |
| 489 | WAXPUSDT.P | Bad buy (26.3% WR, 5W/14L) — but sell 100%! |
| 491 | WETUSDT.P | Bad buy (0% WR, 0W/4L, -23.24% DD) |
| 493 | WLDUSDT | Bad sell (40% WR, -32.55% adverse, -6.8% edge) |
| 496 | WUSDT | Bad both (34.5% buy, 30% sell) |
| 498 | XANUSD | Bad buy (20% WR, 1W/4L, -20.32% DD) |
| 499 | XAUTUST | Not tradeable (gold — tiny moves, all No Hits) |
| 500 | XDCUSD | Bad overall (25% buy, 40% sell, 0% reduce) |
| 504 | XPINUSDT.P | Bad buy (0% WR, 0W/2L, -30.08% DD) |
| 510 | YALAUSDT | Bad both (22.2% buy, 0% sell) + never short (-51.81%) |
| 519 | ZETAUSDT.P | Bad buy (30% WR, 6W/14L) — but sell 75%! |
| 520 | ZILUSDT | Bad buy (36.2% WR, 25W/44L, big sample 113 sig) |
| 522 | ZKJUSDT.P | Bad buy (25% WR, 1W/3L) |
| 526 | ZROUSDT | Bad sell (33.3% WR, -29.88% adverse, -6.25% edge) |

## Strong Tickers

| # | Ticker | Strength |
|---|--------|----------|
| 7 | AAVEUSDT | Sell 35.7% WR (better than buy), big sample |
| 14 | AERGOUSDT | Buy 52.3% WR, +4.64% edge |
| 16 | AEVOUSDT | Sell 50% WR, +2.25% edge |
| 17 | AGLDUSDT.P | Reduce 55.6% WR, positive sell edge |
| 19 | AINUSDT.P | Sell 66.7% WR (small sample) |
| 32 | ANKRUSD | Sell 34.4% WR + Reduce 50% WR (bad buy) |
| 34 | APEXUSDT | Buy 35.7% WR, +26% fav, low DD |
| 38 | ARBUSDT | Sell low adverse (-9.5%), Reduce 42.9% |
| 40 | ARKMUSDT.P | Sell 43.8% WR, Reduce 60% WR, +3.33% edge |
| 41 | ARKUSDT | Buy 41.7% WR, +1.67% edge, both sides positive |
| 42 | ARPAUSDT | Buy 35.8% WR, +18% fav, positive edge (bad sell) |
| 44 | ASRUSDT.P | Both sides 50% WR, +8.67% sell edge |
| 50 | AUCTIONUSDT.P | Buy 52% WR, +4.56% edge |
| 56 | AWEUSDT | Buy 50% WR, +4% edge |
| 57 | AXLUSDT | Buy 37% WR, positive edge, good fav |
| 58 | AXSUSDT | Buy +19.34% favorable, solid |
| 60 | B2USD | Buy 50% WR, +31.56% fav |
| 61 | B3USDT.P | Both sides positive edge |
| 62 | BABYUSDT | Both sides positive edge |
| 63 | BANANAS31USDT | Buy 40% WR, low DD (-9.7%), +21.56% fav |
| 67 | BANUSDT.P | Buy 44.4% WR, +36.32% fav |
| 68 | BARDUSDT | Buy 75% WR, +11% edge |
| 78 | BIGTIMEUSDT.P | Sell 53.3% WR, +3.26% combined edge |
| 79 | BIOUSDT | Sell 75% WR, +10% edge |
| 87 | BOMEUSDT.P | Sell 42.9% combined, +2% edge |
| 88 | BONKUSDT | Buy 37.2% WR, +23.77% fav |
| 89 | BRETTUSDT | Both sides strong, sell 50% combined |
| 93 | BSVUSDT | Buy 38.7% WR, low DD (-9.88%) |
| 96 | BUSDT.P | Both sides strong (50% buy, 57.1% sell) |
| 97 | C98USDT | Sell 38.7% combined, +0.84% edge |
| 98 | CAKEUSDT | Buy 42.2% WR, +1.82% edge (bad sell though) |
| 101 | CCUSDT | Both sides 66.7% WR, +8.67% edge |
| 105 | CFXUSDT | Buy 44% WR, +2.32% edge (big sample 66) |
| 120 | COREUSDT | Sell 52.9% combined, +4.82% edge |
| 123 | COWUSD | Buy 44.4% WR, +2.44% edge |
| 129 | CUSDT.P | Sell 66.7% combined, +8.67% edge |
| 131 | CVXUSDT | Sell REDUCE 100% WR (6W/0L) |
| 134 | DCRUSDT | Buy 41.8% WR, +1.71% edge, low DD (bad sell 13%) |
| 139 | DIAUSD | Buy 40.6% WR, +1.38% edge, very low DD -8.72% |
| 143 | DOGUSDT | Reduce 50% WR, sell positive edge +0.67% |
| 145 | DOODUSDT.P | Buy 55.6% WR, +5.56% edge |
| 146 | DOTUSDT.P | Reduce 60% WR (bad buy/sell) |
| 148 | DUSKUSDT | Buy 37.3% WR, +22% fav, big sample 102 sig |
| 150 | DYMUSDT.P | Sell 42.9% WR, +1.67% edge (bad buy 14.7%) |
| 156 | ENAUSDT | Both sides strong! Buy 39.1%, Sell 66.7%, Reduce 62.5%, +8.2% edge |
| 162 | ERAUSDT.P | Sell 100% WR (3W/0L combined, +18% edge, small sample) |
| 168 | ETHWUSDT.P | Both sides strong, Buy 42.1%, Sell 50%, +2% edge |
| 177 | FIOUSDT | Buy 39.1% WR, +0.96% edge, low DD -11.5% (bad sell 6.3%) |
| 178 | FLOCKUSDC | Buy 66.7% WR, +8.67% edge (small sample) |
| 179 | FLOKIUSDT | Sell 42.9% WR, +1.2% combined edge |
| 182 | FLUIDUSDT | Buy 58.3% WR, +6.33% edge, low DD -8.95%, Reduce 100% |
| 188 | FUSDT.P | Buy 60% WR, +6.8% edge (small sample) |
| 192 | GIGGLEUSDT | Both sides strong, sell 100% WR, +11% combined edge (small sample) |
| 196 | GOATUSDT.P | Reduce 75% WR, sell 33.3%, +4% combined edge |
| 200 | GRTUSDT | Buy 42.9% WR, +2% edge, Sell 39.1%, both sides positive |
| 225 | ICNTUSDT.P | Buy 88.9% WR (8W/1L), +40.42% fav (small sample) |
| 229 | IDUSDT | Sell 58.3% WR (7W/5L), Reduce 75%, both sides positive |
| 230 | ILVUSDT.P | Sell 72.7% WR (8W/3L), Reduce 62.5%, both sides positive |
| 233 | INJUSDT | Buy 54.5% WR (24W/20L, big sample 67), Reduce 77.8% |
| 236 | IOSTUSDT | Both sides 42%+ WR, Reduce 64.7% (11W/6L) |
| 238 | IOTXUSDT.P | Both sides 50%+ WR (buy 50%, sell 55.6%) |
| 239 | IOUSDT.P | Sell 58.3%, Reduce 71.4%, +27.63% reduce fav |
| 246 | JOEUSDT | Buy 55% WR (22W/18L, big sample 65 sig), +1.5% edge |
| 248 | JTOUSDT | Both sides strong! Buy 56%, Sell 60%, positive edge both |
| 249 | JUPUSDT | Sell 58.3% WR, Reduce 55.6%, sell +1% edge |
| 252 | KASUSDT | Both sides strong! Buy 59%, Sell 63.6%, Reduce 83.3%, +2.69% edge |
| 254 | KERNELUSDT.P | Sell 100% WR (5W/0L), Reduce 75%, +9.33% sell edge |
| 258 | KMNOUSDC | Buy 66.7% WR, +5% edge, low DD -9.31% |
| 259 | KNCUSD | Buy 50%, Sell 72% WR (18W/7L, big sample), Reduce 60% |
| 265 | LDOUSD | Buy 63.3%, Sell 58.3%, Reduce 100% (6W/0L), +4.18% edge |
| 268 | LINKUSDT | Both sides strong! Buy 63.5% (40W/23L big sample 98), Sell 56.3%, Reduce 91.7% |
| 272 | LQTYUSDT | Buy 65% (13W/7L), Reduce 100% (5W/0L), +4.68% edge |
| 275 | LTCUSDT.P | Buy 63% (17W/10L), low DD -9.23%, +4.07% edge |
| 292 | METISUSDC | Sell 77.8% (14W/4L), Reduce 90% (9W/1L), +7.11% sell edge |
| 296 | MINAUSD | Buy 56.4% (22W/17L big sample), +2.14% edge |
| 305 | MORPHOUSDT | Both incredible! Buy 73.3%, Sell 100% (10W/0L), +7%/+8.6% edge |
| 306 | MOVEUSD | Buy 70%, Sell 100% (4W/0L), +6.15% buy edge |
| 308 | MTLUSDT.P | Both strong, Buy 59.1%, Sell 75% (12W/4L), +4% sell edge |
| 309 | MUBARAKUSDT | Buy 70% (7W/3L), +38% fav, low DD -9.2% |
| 319 | NILUSDC.P | Both strong! Buy 80% (4W/1L), Sell 80% (4W/1L), Reduce 100% |
| 320 | NMRUSDC | Buy 100% (3W/0L), Sell 100% (1W/0L) — low signals but perfect |
| 322 | NOTUSDT | Buy 52.6% (10W/9L), Sell 80% (4W/1L), Reduce 100% (4W/0L) |
| 317 | NFPUSDT | Sell 70% (7W/3L), Reduce 100% (4W/0L), +5.93% sell edge |
| 323 | NTRNUSD | Sell 100% (3W/0L), Reduce 100% (2W/0L), +13% sell edge |
| 325 | OGNUSD | Both strong! Buy 63.3% (19W/11L), Sell 62.5% (10W/6L), Reduce 100%, +4.37% edge |
| 341 | OXTUSDT.P | Buy 52.9%, Sell 85.7% (12W/2L), Reduce 100% (3W/0L), +9.12% sell edge |
| 330 | ONDOUSDT | Sell 76.9% (10W/3L), Reduce 100% (6W/0L), +7.79% sell edge |
| 339 | ORDIUSDT | Buy 50%, Reduce 85.7% (6W/1L), +19.83% buy fav |
| 359 | POWRUSD | Buy 68.2% (15W/7L), Sell 60%, Reduce 80%, +5.61% edge |
| 360 | PROMPTUSDT.P | Buy 72.7% (8W/3L), Sell 100% (2W/0L), +6.95% edge |
| 352 | PIXELUSDT | Sell 100% (7W/0L), Reduce 100% (2W/0L), +13% sell edge |
| 351 | PIUSDT | Buy 62.5%, Sell 100% (4W/0L), +3.94%/+6.4% edge |
| 355 | POLUSDT | Sell 100% (5W/0L), Reduce 100% (3W/0L), +13% sell edge |
| 347 | PEPEUSDT | Sell 66.7% (12W/6L), Reduce 72.7% (8W/3L), +2.76% sell edge |
| 367 | PUNDIXUSDT | Buy 55.9% (19W/15L big sample 64), +1.99% edge |
| 374 | RDNTUSDT.P | Sell 80% (4W/1L), Reduce 100% (2W/0L), +9.4% sell edge |
| 378 | RLCUSD | Buy 57.9% (11W/8L), Reduce 100% (2W/0L), +2.81% edge |
| 380 | RENDERUSDT | Sell 70% (7W/3L), Reduce 75% (3W/1L), +5.3% sell edge |
| 384 | RSRUSDT | Both strong! Buy 58.9% (33W/23L big sample 86), Sell 57.1%, Reduce 73.3% |
| 386 | RUNEUSDT | Sell 66.7% (10W/5L), Reduce 81.3% (13W/3L), +4.67% sell edge |
| 394 | SANDUSDT | Sell 75% (15W/5L big sample), Reduce 66.7%, +3.72% sell edge |
| 401 | SHIBUSD | Both strong! Buy 56.7%, Sell 59.1%, Reduce 90% (9W/1L), big sample 125 sig |
| 403 | SIRENUSDT.P | Buy 83.3% (5W/1L), Sell 100% (4W/0L), +10.08%/+7.5% edge |
| 420 | SPXUSDT | Buy 69.6% (16W/7L), +6.02% edge, Reduce 75% |
| 425 | STEEMUSDT | Sell 88.9% (8W/1L), Reduce 80%, Buy 54.8%, big sample 92 sig |
| 426 | STGUSDT | Sell 78.6% (11W/3L big sample 49), Buy 50%, Reduce 60% |
| 429 | STRKUSDT | Sell 100% (9W/0L!), Reduce 100%, +13% sell edge — incredible |
| 430 | STXUSDT | Sell 63.3% (19W/11L), Reduce 81.3% (13W/3L), big sample 147 sig |
| 433 | SUPERUSD | Buy 57.5% (23W/17L), Reduce 100% (9W/0L), +4.75% sell edge |
| 438 | SYNUSDT.P | Buy 81% (17W/4L), +9.38% edge (never short though!) |
| 444 | TAOUSDT | Sell 80% (8W/2L), Reduce 66.7%, +4.75% sell edge |
| 447 | THEUSDT | Both 66.7%! Buy +5.17% edge, Reduce 100% (5W/0L), +7% sell edge |
| 458 | TRUMPUSDT | Sell 75% (3W/1L), Reduce 100% (2W/0L), +7.5% sell edge |
| 461 | TRUUSDT.P | Buy 68.8% (22W/10L big sample 46), Sell 57.1%, Reduce 83.3%, +5.78% edge |
| 462 | TRXUSDT | Sell 81.1% (30W/7L! big sample 89), +4.42% sell edge — incredible sell side |
| 466 | TUSDT | Sell 72.7% (8W/3L), Reduce 80%, +4.75% sell edge |
| 468 | TWTUSDT | Sell 66.7% (10W/5L), Reduce 100% (7W/0L), +5.5% sell edge |
| 472 | UNIUSDT | Both sides 50%+, Buy 50%, Sell 56%, Reduce 75% (6W/2L) |
| 474 | USTCUSDT.P | Sell 100% (7W/0L!), Reduce 100% (3W/0L), +13% sell edge |
| 475 | USUALUSDT | Sell 83.3% (5W/1L), Reduce 100% (5W/0L), strong sell/reduce |
| 478 | VANRYUSDT | Sell 70% (7W/3L), Reduce 100% (2W/0L), +5.3% sell edge |
| 483 | VICUSDT.P | Buy 62.5%, Sell 100%, Reduce 100%, all sides strong (small sample) |
| 485 | VIRTUALUSDT | Sell 100% (3W/0L), Reduce 100% (3W/0L), +13% edge |
| 489 | WAXPUSDT.P | Sell 100% (6W/0L!), +13% edge — incredible sell (bad buy though) |
| 492 | WIFUSDT | Both strong! Buy 55%, Sell 66.7% (8W/4L), Reduce 80% (8W/2L) |
| 502 | XNOUSDT | Buy 57.8% (26W/19L big sample 86), Sell 55.6%, +2.54% edge |
| 503 | XNYUSDT.P | Buy 85.7% (6W/1L), +10.79% edge (small sample) |
| 507 | XRPUSDT.P | Sell 65.4% (17W/9L big sample), Reduce 66.7%, +3.45% sell edge |
| 508 | XTZUSD | Buy 50% low DD -9.8%, Sell 62.5% (20W/12L), Reduce 72.7%, big sample 154 |
| 509 | XVSUSDT | Both 50%+, Sell 58.6% (17W/12L), Reduce 66.7%, big sample 113 |
| 515 | ZBCNUSDT | Buy 69.6% (16W/7L), Sell 82.4% (14W/3L!), +6.02% buy edge — incredible |
| 517 | ZENUSDT | Sell 65.4% (17W/9L), Reduce 83.3% (10W/2L!), +3.45% sell edge |
| 519 | ZETAUSDT.P | Sell 75% (9W/3L), +2% edge (bad buy 30% though) |
| 524 | ZKUSD | Both strong! Buy 53.3%, Sell 66.7%, Reduce 75%, +3.1% sell edge |
| 527 | ZRXUSD | Both strong! Buy 54.8%, Sell 77.3% (17W/5L!), Reduce 71.4%, big sample 102 |
| 529 | DFUSDT | Buy 54.3%, Sell 55.6%, Reduce 100% (3W/0L), +1.51% buy edge |

## Notable Observations
- REDUCEs consistently outperform initial sell entries across almost all tickers
- "Never short" pattern: AIAUSDT (-706%), AIOTUSDT.P (-64%), BASUSDT.P (-346%), BTRUSDT.P (-103%), CLOUSDT.P (-96%), ENSOUSDT (-41%), EVAAUSDT (-62%), JELLYJELLYUSDT.P (-121%), KAIAUSDT (-50%), MUSDT (-103%), MYXUSDT.P (-98%), NAORISUSDT.P (-86%), QUSD (-191%), RIVERUSDT.P (-102%), SYNUSDT.P (-85%), TAUSDT.P (-85%), TSTUSDT (-77%), VELVETUSDT.P (-112%), VINEUSD (-109%), YALAUSDT (-52%)
- BTC, BNB, ETH all flagged for bad sell sides — structurally bullish assets
- Several tickers show "strong buy but bad sell" split (CAKEUSDT, COWUSD, BSVUSDT, AERGOUSDT, ARPAUSDT, DCRUSDT, DIAUSD, DEXEUSDT)
- ~20% of tickers flagged bad, ~20% strong, ~60% average
- ETHW performs way better than ETH with this indicator

## FINAL Cumulative Drawdown & Favorable (tickers 1-529, signal-weighted, settings-independent)

| Metric | BUY | SELL | REDUCE |
|---|---|---|---|
| Total Signals | 17,035 | 7,898 | 3,791 |
| Avg Drawdown | -13.44% | -18.93% | -14.01% |
| Avg Favorable | +15.45% | +12.80% | +14.22% |

- Overall: 28,724 signals | Avg DD: -15.03% | Avg Fav: +14.56%
- These numbers are independent of SL/TP settings — they measure actual price movement
- Buy DD: -13.44% → **optimal SL = 14.5%**
- Buy Fav: +15.45% → **optimal TP = 15%, Half TP = 7%**
- Sell Adverse: -18.93% → **optimal SL = 20%**
- Sell Fav: +12.80% → **optimal TP = 13%, Half TP = 7%**
- **FINAL SETTINGS LOCKED: Buy 14.5% SL / 15% TP / 7% Half TP | Sell 20% SL / 13% TP / 7% Half TP**

## Win Rate Comparison by Settings

| Setting | Buy WR | Sell WR | Reduce WR |
|---|---|---|---|
| Old (10% SL / 18% TP) tickers A-G | 28.5% | 24.7% | 36.4% |
| New (15/16 buy, 15/13 sell) tickers H | 43.1% | 49.7% | 52.1% |
| New (15/16 buy, 15/13 sell) tickers I | 43.6% | 50.2% | 67.5% |
| New (15/15 buy, 15/13 sell) tickers J | 47.6% | 50.0% | 51.3% |
| New (15/15 buy, 20/13 sell) tickers K | 48.0% | 59.8% | 54.3% |
| New (14.5/15 buy, 20/13 sell) tickers L | 50.2% | 53.0% | 74.3% |
| New (14.5/15 buy, 20/13 sell) tickers M | 50.5% | 63.8% | 65.6% |
| New (14.5/15 buy, 20/13 sell) tickers N | 42.7% | 63.4% | 78.4% |
| New (14/15 buy, 20/13 sell) tickers O | 45.9% | 57.2% | 71.3% |
| New (14.5/15 buy, 20/13 sell) tickers P | 47.3% | 58.3% | 67.9% |
| New (14.5/15 buy, 20/13 sell) tickers Q | 43.0% | 41.2% | 61.9% |
| New (14.5/15 buy, 20/13 sell) tickers R | 47.2% | 56.0% | 72.0% |
| New (14.5/15 buy, 20/13 sell) tickers S | 47.7% | 60.3% | 72.3% |
| New (14.5/15 buy, 20/13 sell) tickers T | 46.4% | 57.8% | 78.0% |
| New (14.5/15 buy, 20/13 sell) tickers U | 51.3% | 68.2% | 70.0% |
| New (14.5/15 buy, 20/13 sell) tickers V | 42.4% | 56.3% | 75.0% |
| New (14.5/15 buy, 20/13 sell) tickers W | 40.3% | 54.3% | 55.2% |
| New (14.5/15 buy, 20/13 sell) tickers X | 48.8% | 58.8% | 60.7% |
| New (14.5/15 buy, 20/13 sell) tickers Y | 41.4% | 51.1% | 57.1% |
| New (14.5/15 buy, 20/13 sell) tickers Z | 48.1% | 66.2% | 63.8% |
| **Improvement vs Old** | **+17.9%** | **+33.1%** | **+41.6%** |

---

## Raw Data (Tickers #1-529)

### Format: Ticker | Side | Signals | W/L | WR | Avg DD/Adverse | Avg Favorable

### #1 0GUSDT
- BUY: 7 sig, 0W/7L, 0%, -24.33%, +8.34%
- SELL: 1 sig, 0W/0L, 0%, -9.69%, +11.04%
- REDUCE: 0 sig

### #2 1000CATUSDT
- BUY: 18 sig, 0W/14L, 0%, -16.63%, +23.86%
- SELL: 6 sig, 2W/3L, 40%, -16.65%, +23.60%
- REDUCE: 4 sig, 0W/3L, 0%, -15.83%, +7.45%

### #3 1INCHUSDT
- BUY: 73 sig, 13W/37L, 26%, -14.16%, +12.83%
- SELL: 38 sig, 6W/20L, 23.1%, -18.68%, +12.96%
- REDUCE: 17 sig, 5W/7L, 41.7%, -16.35%, +12.66%

### #4 2ZUSDC
- BUY: 4 sig, 0W/3L, 0%, -23.47%, +56.52%
- SELL: 1 sig, 1W/0L, 100%, -4.55%, +30.32%
- REDUCE: 0 sig

### #5 4USDT.P
- BUY: 5 sig, 2W/3L, 40%, -27.90%, +28.37%
- SELL: 0 sig
- REDUCE: 0 sig

### #6 A2ZUSDT
- BUY: 4 sig, 1W/2L, 33.3%, -12.98%, +13.29%
- SELL: 1 sig, 0W/1L, 0%, -23.62%, +2.57%
- REDUCE: 0 sig

### #7 AAVEUSDT
- BUY: 85 sig, 14W/51L, 21.5%, -13.72%, +12.80%
- SELL: 45 sig, 10W/18L, 35.7%, -14.45%, +13.95%
- REDUCE: 22 sig, 5W/8L, 38.5%, -12.94%, +13.63%

### #8 ACEUSDT.P
- BUY: 24 sig, 5W/15L, 25%, -16.06%, +15.40%
- SELL: 15 sig, 4W/8L, 33.3%, -12.11%, +13.84%
- REDUCE: 6 sig, 1W/3L, 25%, -24.41%, +25.32%

### #9 ACHUSDT
- BUY: 60 sig, 9W/32L, 22%, -13.94%, +14.26%
- SELL: 24 sig, 4W/16L, 20%, -19.65%, +15.58%
- REDUCE: 13 sig, 0W/7L, 0%, -14.73%, +12.10%

### #10 ACTUSDT
- BUY: 16 sig, 1W/11L, 8.3%, -15.43%, +19.05%
- SELL: 6 sig, 1W/3L, 25%, -14.33%, +17.57%
- REDUCE: 2 sig, 1W/1L, 50%, -13.12%, +14.96%

### #11 ACUUSDT.P
- BUY: 2 sig, 1W/1L, 50%, -9.24%, +33.34%
- SELL: 0 sig
- REDUCE: 0 sig

### #12 ACXUSD
- BUY: 22 sig, 4W/11L, 26.7%, -12.28%, +12.32%
- SELL: 6 sig, 1W/4L, 20%, -16.50%, +14.88%
- REDUCE: 4 sig, 3W/1L, 75%, -7.73%, +26.23%

### #13 ADAUSDT
- BUY: 116 sig, 10W/57L, 14.9%, -11.57%, +9.66%
- SELL: 72 sig, 10W/35L, 22.2%, -15.47%, +11.23%
- REDUCE: 31 sig, 4W/11L, 26.7%, -10.85%, +14.02%

### #14 AERGOUSDT
- BUY: 59 sig, 23W/21L, 52.3%, -11.58%, +27.02%
- SELL: 23 sig, 4W/14L, 22.2%, -15.63%, +11.80%
- REDUCE: 10 sig, 1W/7L, 12.5%, -20.74%, +14.57%

### #15 AEROUSD
- BUY: 34 sig, 8W/23L, 25.8%, -15.30%, +15.06%
- SELL: 13 sig, 2W/9L, 18.2%, -16.55%, +16.27%
- REDUCE: 7 sig, 3W/4L, 42.9%, -20.96%, +16.39%

### #16 AEVOUSDT
- BUY: 31 sig, 6W/20L, 23.1%, -17.85%, +12.84%
- SELL: 11 sig, 5W/5L, 50%, -13.47%, +16.01%
- REDUCE: 8 sig, 2W/4L, 33.3%, -11.28%, +11.75%

### #17 AGLDUSDT.P
- BUY: 61 sig, 14W/34L, 29.2%, -13.33%, +13.59%
- SELL: 23 sig, 5W/11L, 31.3%, -15.87%, +12.91%
- REDUCE: 11 sig, 5W/4L, 55.6%, -22.30%, +18.59%

### #18 AIAUSDT
- BUY: 3 sig, 2W/1L, 66.7%, -9.56%, +234.25%
- SELL: 2 sig, 0W/2L, 0%, -705.92%, +36.09%
- REDUCE: 1 sig, 0W/0L, 0%, -7.95%, +9.52%

### #19 AINUSDT.P
- BUY: 7 sig, 1W/5L, 16.7%, -19.94%, +10.35%
- SELL: 3 sig, 2W/1L, 66.7%, -11.60%, +17.30%
- REDUCE: 2 sig, 1W/1L, 50%, -24.20%, +19.45%

### #20 AIOTUSDT.P
- BUY: 12 sig, 4W/8L, 33.3%, -28.47%, +13.76%
- SELL: 5 sig, 1W/4L, 20%, -64.09%, +22.33%
- REDUCE: 1 sig, 1W/0L, 100%, -2.09%, +19.47%

### #21 AIOUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -23.91%, +3.83%
- SELL: 2 sig, 1W/1L, 50%, -26.72%, +21.95%
- REDUCE: 1 sig, 0W/0L, 0%, -9.45%, +3.62%

### #22 AIUSDT
- BUY: 24 sig, 6W/16L, 27.3%, -16.33%, +16.68%
- SELL: 18 sig, 3W/11L, 21.4%, -17.94%, +12.18%
- REDUCE: 10 sig, 2W/4L, 33.3%, -15.43%, +12.60%

### #23 AIXBTUSDT.P
- BUY: 22 sig, 5W/17L, 22.7%, -20.11%, +17.40%
- SELL: 5 sig, 1W/4L, 20%, -34.59%, +10.07%
- REDUCE: 3 sig, 1W/2L, 33.3%, -16.41%, +33.83%

### #24 AKEUSD
- BUY: 6 sig, 1W/5L, 16.7%, -26.25%, +34.71%
- SELL: 1 sig, 0W/0L, 0%, -5.61%, +14.69%
- REDUCE: 1 sig, 1W/0L, 100%, -9.00%, +52.66%

### #25 ALCHUSD
- BUY: 4 sig, 1W/3L, 25%, -20.93%, +13.81%
- SELL: 3 sig, 1W/2L, 33.3%, -35.70%, +22.77%
- REDUCE: 1 sig, 1W/0L, 100%, -6.59%, +41.49%

### #26 ALGOUSDT
- BUY: 95 sig, 15W/49L, 23.4%, -12.25%, +13.01%
- SELL: 50 sig, 12W/28L, 30%, -20.57%, +13.19%
- REDUCE: 26 sig, 4W/13L, 23.5%, -12.33%, +12.62%

### #27 ALICEUSDT
- BUY: 75 sig, 14W/42L, 25%, -14.45%, +16.31%
- SELL: 39 sig, 8W/21L, 27.6%, -17.10%, +14.98%
- REDUCE: 26 sig, 5W/14L, 26.3%, -13.11%, +12.43%

### #28 ALLOUSDT
- BUY: 4 sig, 1W/2L, 33.3%, -16.04%, +12.04%
- SELL: 0 sig
- REDUCE: 0 sig

### #29 ALPINEUSDT
- BUY: 16 sig, 3W/7L, 30%, -9.27%, +15.04%
- SELL: 5 sig, 0W/3L, 0%, -12.72%, +7.52%
- REDUCE: 2 sig, 1W/0L, 100%, -6.79%, +10.90%

### #30 ALTUSDT
- BUY: 26 sig, 5W/15L, 25%, -17.30%, +16.34%
- SELL: 11 sig, 2W/7L, 22.2%, -15.97%, +21.89%
- REDUCE: 6 sig, 1W/4L, 20%, -15.16%, +26.47%

### #31 ANIMEUSDT
- BUY: 16 sig, 2W/9L, 18.2%, -15.39%, +17.46%
- SELL: 4 sig, 1W/2L, 33.3%, -17.05%, +15.54%
- REDUCE: 3 sig, 1W/1L, 50%, -12.53%, +35.07%

### #32 ANKRUSD
- BUY: 78 sig, 8W/49L, 14%, -14.97%, +11.20%
- SELL: 47 sig, 11W/21L, 34.4%, -13.21%, +13.61%
- REDUCE: 23 sig, 5W/5L, 50%, -6.03%, +14.10%

### #33 APEUSDT
- BUY: 61 sig, 8W/31L, 20.5%, -14.27%, +11.95%
- SELL: 17 sig, 4W/8L, 33.3%, -11.25%, +14.22%
- REDUCE: 5 sig, 0W/1L, 0%, -13.77%, +9.10%

### #34 APEXUSDT
- BUY: 55 sig, 15W/27L, 35.7%, -12.01%, +26.37%
- SELL: 19 sig, 5W/6L, 45.5%, -28.53%, +14.86%
- REDUCE: 14 sig, 3W/4L, 42.9%, -69.53%, +12.86%

### #35 API3USDT.P
- BUY: 62 sig, 13W/33L, 28.3%, -14.14%, +14.96%
- SELL: 19 sig, 5W/14L, 26.3%, -19.81%, +15.52%
- REDUCE: 9 sig, 2W/3L, 40%, -10.07%, +17.72%

### #36 APRUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -18.91%, +6.19%
- SELL: 1 sig, 1W/0L, 100%, -2.40%, +33.08%
- REDUCE: 0 sig

### #37 APTUSD
- BUY: 51 sig, 10W/22L, 31.3%, -12.79%, +13.16%
- SELL: 20 sig, 2W/8L, 20%, -14.37%, +9.77%
- REDUCE: 9 sig, 1W/4L, 20%, -10.44%, +11.62%

### #38 ARBUSDT
- BUY: 45 sig, 7W/20L, 25.9%, -13.98%, +11.18%
- SELL: 19 sig, 3W/6L, 33.3%, -9.52%, +10.87%
- REDUCE: 9 sig, 3W/4L, 42.9%, -9.81%, +17.89%

### #39 ARIAUSDT.P
- BUY: 4 sig, 0W/4L, 0%, -36.45%, +8.22%
- SELL: 0 sig
- REDUCE: 0 sig

### #40 ARKMUSDT.P
- BUY: 35 sig, 7W/24L, 22.6%, -15.18%, +13.27%
- SELL: 20 sig, 7W/9L, 43.8%, -21.11%, +15.00%
- REDUCE: 7 sig, 3W/2L, 60%, -8.35%, +16.47%

### #41 ARKUSDT
- BUY: 29 sig, 10W/14L, 41.7%, -12.53%, +19.94%
- SELL: 11 sig, 3W/5L, 37.5%, -23.05%, +14.86%
- REDUCE: 6 sig, 2W/2L, 50%, -9.02%, +11.47%

### #42 ARPAUSDT
- BUY: 72 sig, 19W/34L, 35.8%, -14.15%, +18.33%
- SELL: 39 sig, 6W/26L, 18.8%, -21.15%, +11.77%
- REDUCE: 18 sig, 2W/12L, 14.3%, -27.52%, +9.21%

### #43 ARUSDT
- BUY: 65 sig, 12W/42L, 22.2%, -18.03%, +12.57%
- SELL: 34 sig, 2W/22L, 8.3%, -18.55%, +12.13%
- REDUCE: 18 sig, 4W/7L, 36.4%, -13.24%, +15.37%

### #44 ASRUSDT.P
- BUY: 8 sig, 2W/2L, 50%, -6.65%, +15.14%
- SELL: 3 sig, 1W/1L, 50%, -11.29%, +21.52%
- REDUCE: 2 sig, 1W/0L, 100%, -3.56%, +14.91%

### #45 ASTERUSDT
- BUY: 4 sig, 0W/3L, 0%, -18.49%, +15.81%
- SELL: 1 sig, 0W/0L, 0%, -5.37%, +10.86%
- REDUCE: 1 sig, 1W/0L, 100%, -2.67%, +26.47%

### #46 ASTRUSDT
- BUY: 62 sig, 15W/29L, 34.1%, -13.89%, +10.95%
- SELL: 20 sig, 4W/12L, 25%, -18.46%, +10.25%
- REDUCE: 11 sig, 2W/4L, 33.3%, -11.73%, +14.80%

### #47 ATHUSD
- BUY: 12 sig, 1W/8L, 11.1%, -18.99%, +10.31%
- SELL: 3 sig, 0W/2L, 0%, -19.15%, +5.82%
- REDUCE: 0 sig

### #48 ATOMUSDT
- BUY: 94 sig, 20W/43L, 31.7%, -11.33%, +14.01%
- SELL: 50 sig, 6W/23L, 20.7%, -14.46%, +11.09%
- REDUCE: 21 sig, 1W/10L, 9.1%, -12.52%, +9.60%

### #49 ATUSDT.P
- BUY: 1 sig, 1W/0L, 100%, -8.06%, +27.34%
- SELL: 1 sig, 0W/1L, 0%, -38.14%, +2.20%
- REDUCE: 0 sig

### #50 AUCTIONUSDT.P
- BUY: 32 sig, 13W/12L, 52%, -10.84%, +19.30%
- SELL: 13 sig, 1W/9L, 10%, -17.44%, +18.18%
- REDUCE: 6 sig, 2W/0L, 100%, -5.01%, +14.90%

### #51 AUSDT
- BUY: 10 sig, 0W/4L, 0%, -10.22%, +8.59%
- SELL: 1 sig, 0W/0L, 0%, -3.81%, +8.01%
- REDUCE: 0 sig

### #52 AVAAIUSDT.P
- BUY: 12 sig, 3W/8L, 27.3%, -20.42%, +17.92%
- SELL: 5 sig, 1W/3L, 25%, -16.57%, +17.69%
- REDUCE: 4 sig, 1W/3L, 25%, -19.26%, +27.29%

### #53 AVAUSDT.P
- BUY: 11 sig, 1W/8L, 11.1%, -14.80%, +7.13%
- SELL: 5 sig, 0W/3L, 0%, -12.13%, +5.94%
- REDUCE: 3 sig, 2W/0L, 100%, -4.67%, +36.43%

### #54 AVAXUSDT
- BUY: 91 sig, 18W/46L, 28.1%, -12.02%, +13.08%
- SELL: 43 sig, 6W/20L, 23.1%, -20.93%, +9.85%
- REDUCE: 18 sig, 6W/9L, 40%, -11.71%, +12.09%

### #55 AVNTUSDT
- BUY: 10 sig, 1W/9L, 10%, -25.34%, +12.68%
- SELL: 3 sig, 0W/3L, 0%, -14.92%, +33.49%
- REDUCE: 2 sig, 1W/1L, 50%, -30.81%, +15.98%

### #56 AWEUSDT
- BUY: 9 sig, 3W/3L, 50%, -11.08%, +14.16%
- SELL: 4 sig, 1W/3L, 25%, -29.04%, +10.70%
- REDUCE: 3 sig, 1W/0L, 100%, -4.70%, +13.12%

### #57 AXLUSDT
- BUY: 32 sig, 10W/17L, 37%, -13.75%, +17.75%
- SELL: 10 sig, 2W/5L, 28.6%, -10.58%, +13.97%
- REDUCE: 7 sig, 2W/3L, 40%, -13.14%, +21.84%

### #58 AXSUSDT
- BUY: 80 sig, 17W/36L, 32.1%, -12.51%, +19.34%
- SELL: 30 sig, 6W/14L, 30%, -20.92%, +13.60%
- REDUCE: 16 sig, 5W/5L, 50%, -19.36%, +18.77%

### #59 AZTECUSDT.P
- 0 signals both sides — skipped

### #60 B2USD
- BUY: 4 sig, 2W/2L, 50%, -20.89%, +31.56%
- SELL: 1 sig, 1W/0L, 100%, -5.89%, +23.18%
- REDUCE: 1 sig, 0W/1L, 0%, -15.05%, +3.93%

### #61 B3USDT.P
- BUY: 13 sig, 4W/5L, 44.4%, -11.87%, +18.69%
- SELL: 3 sig, 1W/1L, 50%, -22.62%, +13.75%
- REDUCE: 2 sig, 0W/0L, 0%, -3.02%, +17.32%

### #62 BABYUSDT
- BUY: 17 sig, 5W/7L, 41.7%, -13.36%, +12.68%
- SELL: 5 sig, 2W/2L, 50%, -8.74%, +31.68%
- REDUCE: 4 sig, 1W/2L, 33.3%, -21.85%, +18.85%

### #63 BANANAS31USDT
- BUY: 8 sig, 2W/3L, 40%, -9.70%, +21.56%
- SELL: 1 sig, 0W/1L, 0%, -13.66%, +77.06%
- REDUCE: 1 sig, 0W/1L, 0%, -23.65%, +22.50%

### #64 BANANAUSDT
- BUY: 27 sig, 7W/16L, 30.4%, -14.59%, +18.81%
- SELL: 10 sig, 2W/7L, 22.2%, -20.39%, +13.29%
- REDUCE: 4 sig, 1W/1L, 50%, -17.27%, +30.34%

### #65 BANDUSDT
- BUY: 84 sig, 21W/42L, 33.3%, -13.25%, +15.26%
- SELL: 51 sig, 14W/32L, 30.4%, -26.39%, +15.00%
- REDUCE: 26 sig, 7W/13L, 35%, -12.64%, +14.66%

### #66 BANKUSDT
- BUY: 3 sig, 1W/1L, 50%, -8.65%, +37.99%
- SELL: 0 sig
- REDUCE: 0 sig

### #67 BANUSDT.P
- BUY: 10 sig, 4W/5L, 44.4%, -17.23%, +36.32%
- SELL: 5 sig, 2W/3L, 40%, -11.19%, +15.94%
- REDUCE: 3 sig, 0W/3L, 0%, -28.84%, +5.17%

### #68 BARDUSDT
- BUY: 5 sig, 3W/1L, 75%, -21.35%, +20.83%
- SELL: 2 sig, 0W/2L, 0%, -25.79%, +1.98%
- REDUCE: 0 sig

### #69 BASUSDT.P
- BUY: 5 sig, 1W/3L, 25%, -13.79%, +16.01%
- SELL: 2 sig, 1W/1L, 50%, -346.07%, +61.07%
- REDUCE: 1 sig, 0W/1L, 0%, -42.83%, +36.09%

### #70 BATUSD
- BUY: 84 sig, 15W/34L, 30.6%, -11.76%, +12.65%
- SELL: 54 sig, 10W/35L, 22.2%, -16.38%, +12.67%
- REDUCE: 21 sig, 4W/10L, 28.6%, -12.99%, +11.56%

### #71 BBUSDT
- BUY: 33 sig, 6W/24L, 20%, -17.61%, +15.74%
- SELL: 9 sig, 2W/6L, 25%, -14.60%, +16.13%
- REDUCE: 4 sig, 1W/2L, 33.3%, -6.95%, +17.71%

### #72 BCHUSDT
- BUY: 79 sig, 11W/30L, 26.8%, -10.57%, +10.42%
- SELL: 45 sig, 4W/22L, 15.4%, -15.59%, +9.56%
- REDUCE: 18 sig, 0W/6L, 0%, -10.75%, +7.49%

### #73 BDXNUSDT
- BUY: 3 sig, 2W/1L, 66.7%, -11.35%, +116.55%
- SELL: 1 sig, 0W/1L, 0%, -16.45%, +5.27%
- REDUCE: 0 sig

### #74 BEAMXUSDT
- BUY: 26 sig, 6W/16L, 27.3%, -15.90%, +13.97%
- SELL: 11 sig, 2W/7L, 22.2%, -19.10%, +9.83%
- REDUCE: 6 sig, 3W/3L, 50%, -13.00%, +18.78%

### #75 BEATUSDT.P
- BUY: 2 sig, 1W/1L, 50%, -40.66%, +16.13%
- SELL: 1 sig, 0W/1L, 0%, -15.34%, +62.86%
- REDUCE: 0 sig

### #76 BERAUSDT
- BUY: 22 sig, 5W/14L, 26.3%, -19.98%, +18.37%
- SELL: 6 sig, 1W/5L, 16.7%, -18.35%, +20.18%
- REDUCE: 3 sig, 1W/1L, 50%, -83.36%, +13.83%

### #77 BICOUSDT
- BUY: 61 sig, 8W/34L, 19%, -12.69%, +12.32%
- SELL: 23 sig, 5W/14L, 26.3%, -14.09%, +13.00%
- REDUCE: 13 sig, 1W/5L, 16.7%, -12.79%, +13.89%

### #78 BIGTIMEUSDT.P
- BUY: 40 sig, 6W/21L, 22.2%, -14.46%, +15.49%
- SELL: 16 sig, 8W/7L, 53.3%, -14.63%, +19.36%
- REDUCE: 6 sig, 1W/3L, 25%, -17.18%, +14.09%

### #79 BIOUSDT
- BUY: 17 sig, 5W/12L, 29.4%, -20.40%, +19.25%
- SELL: 4 sig, 3W/1L, 75%, -9.04%, +34.05%
- REDUCE: 3 sig, 2W/1L, 66.7%, -28.53%, +18.77%

### #80 BLESSUSDT.P
- BUY: 4 sig, 2W/1L, 66.7%, -16.18%, +18.31%
- SELL: 1 sig, 0W/1L, 0%, -12.67%, +17.36%
- REDUCE: 0 sig

### #81 BLUAIUSDT.P
- BUY: 3 sig, 0W/3L, 0%, -20.09%, +9.47%
- SELL: 0 sig
- REDUCE: 0 sig

### #82 BLURUSDT.P
- BUY: 40 sig, 7W/19L, 26.9%, -13.86%, +13.56%
- SELL: 25 sig, 4W/16L, 20%, -21.83%, +10.20%
- REDUCE: 10 sig, 4W/6L, 40%, -17.73%, +15.63%

### #83 BMTUSDT.P
- BUY: 9 sig, 2W/4L, 33.3%, -10.16%, +11.57%
- SELL: 2 sig, 1W/1L, 50%, -21.39%, +19.47%
- REDUCE: 2 sig, 0W/1L, 0%, -9.21%, +44.51%

### #84 BNBUSDT
- BUY: 119 sig, 15W/37L, 28.8%, -9.57%, +10.69%
- SELL: 88 sig, 6W/41L, 12.8%, -15.78%, +7.95%
- REDUCE: 28 sig, 4W/5L, 44.4%, -8.07%, +9.35%

### #85 BNTUSDT
- BUY: 84 sig, 12W/38L, 24%, -12.35%, +12.72%
- SELL: 43 sig, 7W/17L, 29.2%, -15.22%, +10.57%
- REDUCE: 17 sig, 4W/5L, 44.4%, -13.81%, +11.15%

### #86 BOBBOBUSDC
- BUY: 5 sig, 1W/3L, 25%, -12.28%, +13.97%
- SELL: 0 sig
- REDUCE: 0 sig

### #87 BOMEUSDT.P
- BUY: 25 sig, 7W/15L, 31.8%, -13.32%, +16.28%
- SELL: 10 sig, 3W/6L, 33.3%, -13.97%, +18.13%
- REDUCE: 7 sig, 3W/2L, 60%, -12.49%, +24.08%

### #88 BONKUSDT
- BUY: 48 sig, 16W/27L, 37.2%, -14.80%, +23.77%
- SELL: 10 sig, 2W/8L, 20%, -19.40%, +16.00%
- REDUCE: 6 sig, 3W/2L, 60%, -10.68%, +24.75%

### #89 BRETTUSDT
- BUY: 28 sig, 10W/17L, 37%, -16.31%, +24.93%
- SELL: 11 sig, 4W/6L, 40%, -33.24%, +20.24%
- REDUCE: 7 sig, 4W/2L, 66.7%, -19.79%, +22.78%

### #90 BREVUSDT
- 0 signals both sides — skipped

### #91 BROCCOLI714USDC
- BUY: 7 sig, 0W/5L, 0%, -14.32%, +11.28%
- SELL: 3 sig, 0W/3L, 0%, -57.52%, +4.20%
- REDUCE: 1 sig, 1W/0L, 100%, -13.52%, +18.68%

### #92 BRUSDT.P
- BUY: 9 sig, 2W/3L, 40%, -13.98%, +16.81%
- SELL: 2 sig, 1W/1L, 50%, -15.70%, +18.45%
- REDUCE: 2 sig, 0W/0L, 0%, -7.64%, +14.12%

### #93 BSVUSDT
- BUY: 57 sig, 12W/19L, 38.7%, -9.88%, +12.70%
- SELL: 15 sig, 1W/5L, 16.7%, -13.93%, +11.99%
- REDUCE: 8 sig, 1W/2L, 33.3%, -8.59%, +8.15%

### #94 BTCUSDT
- BUY: 99 sig, 11W/23L, 32.4%, -8.19%, +7.86%
- SELL: 67 sig, 3W/15L, 16.7%, -7.43%, +7.92%
- REDUCE: 30 sig, 2W/3L, 40%, -4.33%, +7.81%

### #95 BTRUSDT.P
- BUY: 8 sig, 3W/5L, 37.5%, -15.62%, +19.05%
- SELL: 3 sig, 0W/3L, 0%, -102.66%, +11.95%
- REDUCE: 1 sig, 1W/0L, 100%, -5.80%, +75.14%

### #96 BUSDT.P
- BUY: 6 sig, 3W/3L, 50%, -16.73%, +24.11%
- SELL: 5 sig, 3W/1L, 75%, -22.45%, +20.63%
- REDUCE: 3 sig, 1W/2L, 33.3%, -14.87%, +32.58%

### #97 C98USDT
- BUY: 68 sig, 15W/34L, 30.6%, -10.65%, +13.61%
- SELL: 33 sig, 7W/14L, 33.3%, -10.82%, +17.46%
- REDUCE: 20 sig, 5W/5L, 50%, -9.44%, +12.53%

### #98 CAKEUSDT
- BUY: 82 sig, 19W/26L, 42.2%, -9.53%, +13.49%
- SELL: 48 sig, 4W/26L, 13.3%, -15.65%, +8.83%
- REDUCE: 20 sig, 2W/5L, 28.6%, -10.82%, +9.30%

### #99 CARVEUR
- BUY: 12 sig, 3W/8L, 27.3%, -17.71%, +12.03%
- SELL: 2 sig, 0W/2L, 0%, -31.32%, +19.28%
- REDUCE: 1 sig, 0W/1L, 0%, -23.88%, +16.85%

### #100 CATIUSDC.P
- BUY: 10 sig, 2W/7L, 22.2%, -18.38%, +11.83%
- SELL: 6 sig, 1W/4L, 20%, -36.86%, +15.10%
- REDUCE: 4 sig, 0W/1L, 0%, -29.27%, +6.12%

### #101 CCUSDT
- BUY: 4 sig, 2W/1L, 66.7%, -6.86%, +27.26%
- SELL: 2 sig, 1W/1L, 50%, -20.44%, +11.35%
- REDUCE: 1 sig, 1W/0L, 100%, -7.42%, +27.02%

### #102 CELOUSDT
- BUY: 71 sig, 11W/41L, 21.2%, -15.52%, +11.19%
- SELL: 36 sig, 7W/21L, 25%, -19.41%, +12.85%
- REDUCE: 17 sig, 3W/6L, 33.3%, -8.05%, +14.27%

### #103 CELRUSD
- BUY: 70 sig, 13W/41L, 24.1%, -14.50%, +15.49%
- SELL: 45 sig, 8W/29L, 21.6%, -18.40%, +12.35%
- REDUCE: 16 sig, 3W/10L, 23.1%, -13.54%, +16.04%

### #104 CETUSUSDC
- BUY: 23 sig, 5W/15L, 25%, -15.01%, +12.41%
- SELL: 5 sig, 0W/4L, 0%, -36.36%, +19.65%
- REDUCE: 1 sig, 0W/1L, 0%, -20.13%, +31.90%

### #105 CFXUSDT
- BUY: 66 sig, 22W/28L, 44%, -14.77%, +21.34%
- SELL: 37 sig, 6W/19L, 24%, -19.18%, +13.33%
- REDUCE: 17 sig, 5W/5L, 50%, -10.91%, +14.89%

### #106 CGPTUSDC
- BUY: 17 sig, 3W/11L, 21.4%, -17.07%, +9.96%
- SELL: 2 sig, 1W/0L, 100%, -5.65%, +14.12%
- REDUCE: 1 sig, 0W/0L, 0%, -2.46%, +17.45%

### #107 CHEEMSUSDT
- BUY: 17 sig, 3W/6L, 33.3%, -9.50%, +18.37%
- SELL: 8 sig, 1W/4L, 20%, -19.22%, +9.95%
- REDUCE: 3 sig, 1W/1L, 50%, -27.87%, +10.04%

### #108 CHESSUSDT
- BUY: 47 sig, 12W/26L, 31.6%, -16.02%, +16.21%
- SELL: 19 sig, 3W/12L, 20%, -17.14%, +10.67%
- REDUCE: 12 sig, 3W/8L, 27.3%, -23.38%, +15.64%

### #109 CHILLGUYUSDT.P
- BUY: 14 sig, 1W/13L, 7.1%, DD cut off, fav cut off
- SELL: 3 sig, 0W/3L, 0%, -19.96%, +29.66%
- REDUCE: 2 sig, 1W/1L, 50%, -8.46%, +54.92%

### #110 CHRUSDT
- BUY: 90 sig, 20W/52L, 27.8%, -15.29%, +16.77%
- SELL: 42 sig, 11W/22L, 33.3%, -18.98%, +14.39%
- REDUCE: 21 sig, 5W/9L, 35.7%, -14.16%, +16.76%

### #111 CHZUSD
- BUY: 35 sig, 8W/19L, 29.6%, -13.08%, +13.06%
- SELL: 11 sig, 0W/6L, 0%, -17.15%, +9.35%
- REDUCE: 6 sig, 1W/5L, 16.7%, -21.00%, +8.02%

### #112 CKBUSDC
- BUY: 27 sig, 7W/14L, 33.3%, -13.27%, +11.95%
- SELL: 9 sig, 2W/7L, 22.2%, -22.70%, +8.90%
- REDUCE: 5 sig, 2W/3L, 40%, -34.52%, +24.15%

### #113 CLANKERUSDT.P
- BUY: 9 sig, 2W/6L, 25%, -16.86%, +19.27%
- SELL: 6 sig, 2W/4L, 33.3%, -30.38%, +24.33%
- REDUCE: 4 sig, 1W/3L, 25%, -18.13%, +20.01%

### #114 CLOUSDT.P
- BUY: 5 sig, 0W/5L, 0%, -50.36%, +11.44%
- SELL: 1 sig, 0W/1L, 0%, -95.63%, +4.54%
- REDUCE: 0 sig

### #115 COAIUSDT.P
- BUY: 5 sig, 1W/4L, 20%, -42.25%, +7.36%
- SELL: 1 sig, 0W/0L, 0%, -9.92%, +6.95%
- REDUCE: 0 sig

### #116 COLLECTUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -38.31%, +76.07%
- SELL: 0 sig
- REDUCE: 0 sig

### #117 COMMONUSDT
- BUY: 5 sig, 1W/4L, 20%, -24.91%, +47.24%
- SELL: 0 sig
- REDUCE: 0 sig

### #118 COMPUSD
- BUY: 89 sig, 18W/39L, 31.6%, -12.39%, +13.24%
- SELL: 42 sig, 10W/21L, 32.3%, -12.78%, +12.51%
- REDUCE: 23 sig, 6W/11L, 35.3%, -15.82%, +16.99%

### #119 COOKIEUSD
- BUY: 13 sig, 4W/8L, 33.3%, -15.07%, +14.13%
- SELL: 5 sig, 1W/3L, 25%, -15.37%, +14.26%
- REDUCE: 3 sig, 1W/1L, 50%, -9.92%, +23.62%

### #120 COREUSDT
- BUY: 43 sig, 9W/25L, 26.5%, -14.03%, +14.99%
- SELL: 18 sig, 5W/5L, 50%, -14.55%, +14.96%
- REDUCE: 9 sig, 4W/3L, 57.1%, -15.29%, +14.02%

### #121 COSUSDT.P
- BUY: 25 sig, 5W/15L, 25%, -12.78%, +13.38%
- SELL: 5 sig, 1W/2L, 33.3%, -14.05%, +19.83%
- REDUCE: 4 sig, 1W/1L, 50%, -5.45%, +28.33%

### #122 COTIUSDT
- BUY: 82 sig, 20W/46L, 30.3%, -13.57%, +17.82%
- SELL: 48 sig, 11W/31L, 26.2%, -19.44%, +16.01%
- REDUCE: 21 sig, 2W/15L, 11.8%, -19.49%, +17.35%

### #123 COWUSD
- BUY: 19 sig, 8W/10L, 44.4%, -14.65%, +17.85%
- SELL: 6 sig, 1W/4L, 20%, -23.16%, +9.32%
- REDUCE: 2 sig, 0W/1L, 0%, -14.16%, +7.34%

### #124 CROSSUSDT.P
- BUY: 6 sig, 1W/4L, 20%, -13.47%, +10.27%
- SELL: 1 sig, 0W/0L, 0%, -5.61%, +14.97%
- REDUCE: 1 sig, 0W/0L, 0%, -5.97%, +15.05%

### #125 CRVUSDT
- BUY: 84 sig, 18W/43L, 29.5%, -14.91%, +13.60%
- SELL: 43 sig, 8W/26L, 23.5%, -18.91%, +14.27%
- REDUCE: 20 sig, 6W/8L, 42.9%, -18.90%, +14.87%

### #126 CTKUSDT.P
- BUY: 45 sig, 8W/19L, 29.6%, -12.01%, +12.02%
- SELL: 23 sig, 1W/14L, 6.7%, -22.86%, +12.30%
- REDUCE: 9 sig, 2W/5L, 28.6%, -33.77%, +15.09%

### #127 CTSIUSD
- BUY: 74 sig, 12W/41L, 22.6%, -12.81%, +14.24%
- SELL: 40 sig, 4W/26L, 13.3%, -22.14%, +10.30%
- REDUCE: 15 sig, 6W/6L, 50%, -12.02%, +15.82%

### #128 CUDISUSDT
- BUY: 7 sig, 3W/4L, 42.9%, -32.56%, +209.44%
- SELL: 4 sig, 1W/2L, 33.3%, -14.17%, +15.40%
- REDUCE: 2 sig, 0W/1L, 0%, -15.08%, +6.44%

### #129 CUSDT.P
- BUY: 12 sig, 2W/7L, 22.2%, -12.89%, +11.96%
- SELL: 2 sig, 2W/0L, 100%, -2.61%, +28.63%
- REDUCE: 1 sig, 0W/1L, 0%, -14.33%, +19.44%

### #130 CVCUSD
- BUY: 80 sig, 13W/39L, 25%, -12.17%, +15.76%
- SELL: 47 sig, 9W/30L, 23.1%, -15.56%, +10.19%
- REDUCE: 18 sig, 4W/8L, 33.3%, -12.32%, +12.85%

### #131 CVXUSDT
- BUY: 65 sig, 11W/29L, 27.5%, -12.27%, +22.05%
- SELL: 23 sig, 4W/14L, 22.2%, -17.61%, +12.67%
- REDUCE: 9 sig, 6W/0L, 100%, -18.98%, +23.51%

### #132 CYBERUSDT
- BUY: 30 sig, 7W/18L, 28%, -13.93%, +16.18%
- SELL: 18 sig, 4W/12L, 25%, -25.02%, +15.47%
- REDUCE: 8 sig, 4W/3L, 57.1%, -15.94%, +22.70%

### #133 CYSUSDT
- BUY: 2 sig, 0W/2L, 0%, -69.07%, +3.44%
- SELL: 2 sig, 0W/2L, 0%, -37.33%, +5.90%
- REDUCE: 1 sig, 0W/1L, 0%, -30.34%, +13.99%

### #134 DCRUSDT
- BUY: 78 sig, 23W/32L, 41.8%, -11.08%, +18.52%
- SELL: 33 sig, 3W/20L, 13%, -17.51%, +11.98%
- REDUCE: 16 sig, 3W/6L, 33.3%, -16.63%, +12.58%

### #135 DEEPUSD
- BUY: 11 sig, 0W/10L, 0%, -21.04%, +13.40%
- SELL: 1 sig, 0W/1L, 0%, -33.55%, +6.30%
- REDUCE: 0 sig

### #136 DEGOUSDT.P
- BUY: 10 sig, 1W/8L, 11.1%, -13.64%, +7.95%
- SELL: 2 sig, 0W/2L, 0%, -15.17%, +29.78%
- REDUCE: 1 sig, 0W/1L, 0%, -28.09%, +4.89%

### #137 DENTUSDT.P
- BUY: 79 sig, 11W/47L, 19%, -15.89%, +13.27%
- SELL: 30 sig, 8W/14L, 36.4%, -23.83%, +13.39%
- REDUCE: 16 sig, 4W/7L, 36.4%, -11.43%, +10.05%

### #138 DEXEUSDT
- BUY: 43 sig, 11W/19L, 36.7%, -11.69%, +16.92%
- SELL: 23 sig, 3W/12L, 20%, -20.92%, +10.94%
- REDUCE: 12 sig, 0W/9L, 0%, -25.83%, +8.26%

### #139 DIAUSD
- BUY: 51 sig, 13W/19L, 40.6%, -8.72%, +12.30%
- SELL: 34 sig, 3W/21L, 12.5%, -22.99%, +10.29%
- REDUCE: 16 sig, 3W/6L, 33.3%, -9.05%, +12.69%

### #140 DNUSDT
- 0 signals both sides — skipped

### #141 DOGEUSDT
- BUY: 83 sig, 9W/34L, 20.9%, -10.99%, +10.30%
- SELL: 61 sig, 12W/29L, 29.3%, -15.34%, +12.81%
- REDUCE: 30 sig, 4W/9L, 30.8%, -8.93%, +12.18%

### #142 DOGSUSDT
- BUY: 22 sig, 3W/15L, 16.7%, -17.10%, +19.51%
- SELL: 10 sig, 2W/5L, 28.6%, -17.88%, +14.46%
- REDUCE: 5 sig, 1W/3L, 25%, -17.38%, +13.07%

### #143 DOGUSDT
- BUY: 32 sig, 7W/23L, 23.3%, -19.83%, +19.29%
- SELL: 15 sig, 4W/9L, 30.8%, -21.25%, +17.04%
- REDUCE: 10 sig, 4W/4L, 50%, -15.58%, +19.32%

### #144 DOLOUSDT
- BUY: 7 sig, 2W/5L, 28.6%, -17.49%, +23.21%
- SELL: 0 sig
- REDUCE: 0 sig

### #145 DOODUSDT.P
- BUY: 11 sig, 5W/4L, 55.6%, -10.30%, +26.52%
- SELL: 4 sig, 0W/4L, 0%, -22.01%, +7.10%
- REDUCE: 1 sig, 1W/0L, 100%, -2.09%, +19.47% (note: placeholder)

### #146 DOTUSDT.P
- BUY: 88 sig, 10W/38L, 20.8%, -12.16%, +10.19%
- SELL: 50 sig, 3W/24L, 11.1%, -15.00%, +9.84%
- REDUCE: 19 sig, 3W/2L, 60%, -7.76%, +11.02%

### #147 DRIFTUSD
- BUY: 17 sig, 3W/14L, 17.6%, -16.12%, +13.71%
- SELL: 8 sig, 1W/5L, 16.7%, -24.39%, +11.33%
- REDUCE: 3 sig, 1W/1L, 50%, -9.19%, +15.98%

### #148 DUSKUSDT
- BUY: 102 sig, 28W/47L, 37.3%, -14.11%, +22.49%
- SELL: 48 sig, 5W/34L, 12.8%, -22.98%, +11.62%
- REDUCE: 23 sig, 6W/10L, 37.5%, -12.39%, +15.84%

### #149 DYDXUSDT
- BUY: 67 sig, 13W/38L, 25.5%, -14.56%, +13.81%
- SELL: 26 sig, 4W/15L, 21.1%, -13.86%, +10.98%
- REDUCE: 13 sig, 4W/6L, 40%, -10.23%, +16.07%

### #150 DYMUSDT.P
- BUY: 36 sig, 5W/29L, 14.7%, -15.88%, +16.20%
- SELL: 9 sig, 3W/4L, 42.9%, -17.26%, +18.08%
- REDUCE: 7 sig, 2W/3L, 40%, -15.58%, +13.26%

### #151 EDENUSDT
- BUY: 6 sig, 1W/5L, 16.7%, -26.54%, +8.87%
- SELL: 0 sig
- REDUCE: 0 sig

### #152 EDUUSDT
- BUY: 31 sig, 7W/17L, 29.2%, -15.54%, +13.23%
- SELL: 15 sig, 4W/8L, 33.3%, -15.56%, +11.59%
- REDUCE: 7 sig, 2W/2L, 50%, -8.42%, +11.47%

### #153 EGLDUSDT
- BUY: 87 sig, 18W/42L, 30%, -13.45%, +13.76%
- SELL: 38 sig, 8W/21L, 27.6%, -24.65%, +13.22%
- REDUCE: 20 sig, 4W/9L, 30.8%, -10.49%, +14.35%

### #154 EIGENUSDT
- BUY: 22 sig, 6W/15L, 28.6%, -16.64%, +19.26%
- SELL: 9 sig, 1W/8L, 11.1%, -24.24%, +8.32%
- REDUCE: 2 sig, 1W/0L, 100%, -6.96%, +16.90%

### #155 ELSAUSDT.P
- 0 signals both sides — skipped

### #156 ENAUSDT
- BUY: 26 sig, 9W/14L, 39.1%, -14.25%, +24.38%
- SELL: 14 sig, 8W/4L, 66.7%, -12.98%, +21.24%
- REDUCE: 10 sig, 5W/3L, 62.5%, -7.09%, +23.93%

### #157 ENJUSDT
- BUY: 105 sig, 18W/55L, 24.7%, -13.10%, +13.47%
- SELL: 53 sig, 11W/30L, 26.8%, -20.77%, +13.76%
- REDUCE: 23 sig, 3W/10L, 23.1%, -11.74%, +13.01%

### #158 ENSOUSDT
- BUY: 2 sig, 1W/0L, 100%, -3.42%, +174.26%
- SELL: 2 sig, 0W/2L, 0%, -41.24%, +34.36%
- REDUCE: 1 sig, 0W/0L, 0%, -2.27%, +14.61%

### #159 ENSOUSDT.P
- BUY: 2 sig, 1W/0L, 100%, -3.63%, +156.00%
- SELL: 1 sig, 0W/1L, 0%, -39.69%, +51.50%
- REDUCE: 1 sig, 0W/0L, 0%, -0.55%, +14.75%

### #160 EPICUSDT.P
- BUY: 13 sig, 3W/8L, 27.3%, -12.56%, +16.20%
- SELL: 3 sig, 1W/2L, 33.3%, -8.71%, +21.26%
- REDUCE: 1 sig, 0W/1L, 0%, -14.40%, +9.15%

### #161 EPTUSDT
- BUY: 11 sig, 2W/7L, 22.2%, -18.35%, +20.31%
- SELL: 8 sig, 1W/5L, 16.7%, -17.21%, +18.10%
- REDUCE: 5 sig, 1W/4L, 20%, -31.31%, +11.74%

### #162 ERAUSDT.P
- BUY: 9 sig, 2W/6L, 25%, -13.29%, +7.19%
- SELL: 2 sig, 2W/0L, 100%, -5.54%, +23.71%
- REDUCE: 1 sig, 1W/0L, 100%, -1.87%, +27.77%

### #163 ESPORTSUSD
- BUY: 1 sig, 0W/1L, 0%, -15.94%, +11.56%
- SELL: 0 sig
- REDUCE: 0 sig

### #164 ESPUSDT.P
- 0 signals both sides — skipped

### #165 ETCUSDT
- BUY: 121 sig, 15W/50L, 23.1%, -11.02%, +11.09%
- SELL: 66 sig, 13W/33L, 28.3%, -13.81%, +11.70%
- REDUCE: 32 sig, 3W/14L, 17.6%, -11.53%, +11.80%

### #166 ETHFIUSDT
- BUY: 32 sig, 9W/19L, 32.1%, -15.14%, +25.99%
- SELL: 13 sig, 4W/6L, 40%, -15.51%, +16.92%
- REDUCE: 7 sig, 1W/5L, 16.7%, -18.37%, +9.01%

### #167 ETHUSDT
- BUY: 120 sig, 15W/46L, 24.6%, -10.55%, +9.78%
- SELL: 96 sig, 13W/46L, 22%, -14.05%, +9.78%
- REDUCE: 35 sig, 5W/10L, 33.3%, -10.30%, +10.42%

### #168 ETHWUSDT.P
- BUY: 25 sig, 8W/11L, 42.1%, -13.19%, +15.60%
- SELL: 13 sig, 5W/5L, 50%, -16.07%, +15.25%
- REDUCE: 6 sig, 1W/3L, 25%, -17.17%, +9.14%

### #169 EULUSD
- BUY: 11 sig, 1W/8L, 11.1%, -17.67%, +13.63%
- SELL: 2 sig, 0W/2L, 0%, -15.45%, +10.62%
- REDUCE: 2 sig, 2W/0L, 100%, -5.11%, +30.87%

### #170 EVAAUSDT
- BUY: 5 sig, 2W/3L, 40%, -31.59%, +21.80%
- SELL: 1 sig, 0W/1L, 0%, -61.98%, +8.32%
- REDUCE: 0 sig

### #171 FARTCOINUSDT
- BUY: 24 sig, 7W/16L, 30.4%, -19.45%, +40.60%
- SELL: 11 sig, 2W/9L, 18.2%, -24.19%, +24.01%
- REDUCE: 5 sig, 1W/4L, 20%, -62.60%, +28.57%

### #172 FETUSDT
- BUY: 99 sig, 25W/53L, 32.1%, -14.12%, +19.51%
- SELL: 61 sig, 12W/40L, 23.1%, -25.74%, +14.23%
- REDUCE: 22 sig, 4W/12L, 25%, -27.93%, +18.37%

### #173 FFUSDT
- BUY: 5 sig, 1W/1L, 50%, -7.08%, +13.31%
- SELL: 1 sig, 1W/0L, 100%, -7.76%, +37.70%
- REDUCE: 1 sig, 0W/0L, 0%, -9.49%, +12.91%

### #174 FHEUSDT.P
- BUY: 5 sig, 1W/1L, 50%, -13.37%, +19.74%
- SELL: 3 sig, 1W/2L, 33.3%, -41.97%, +43.87%
- REDUCE: 3 sig, 0W/3L, 0%, -25.17%, +22.94%

### #175 FIDAUSDT.P
- BUY: 21 sig, 5W/12L, 29.4%, -14.10%, +17.00%
- SELL: 10 sig, 1W/6L, 14.3%, -16.74%, +12.20%
- REDUCE: 4 sig, 0W/2L, 0%, -20.73%, +8.68%

### #176 FILUSDT
- BUY: 91 sig, 14W/41L, 25.5%, -14.51%, +11.29%
- SELL: 39 sig, 6W/17L, 26.1%, -14.09%, +13.11%
- REDUCE: 22 sig, 5W/6L, 45.5%, -9.19%, +16.98%

### #177 FIOUSDT
- BUY: 69 sig, 18W/28L, 39.1%, -11.51%, +21.73%
- SELL: 21 sig, 1W/15L, 6.3%, -17.10%, +11.47%
- REDUCE: 13 sig, 3W/4L, 42.9%, -8.52%, +15.71%

### #178 FLOCKUSDC
- BUY: 10 sig, 6W/3L, 66.7%, -13.01%, +25.81%
- SELL: 1 sig, 0W/1L, 0%, -18.18%, +23.57%
- REDUCE: 1 sig, 0W/1L, 0%, -39.24%, +13.82%

### #179 FLOKIUSDT
- BUY: 44 sig, 10W/26L, 27.8%, -15.62%, +16.70%
- SELL: 22 sig, 9W/12L, 42.9%, -26.55%, +19.85%
- REDUCE: 12 sig, 3W/6L, 33.3%, -12.98%, +19.61%

### #180 FLOWUSDT
- BUY: 75 sig, 7W/38L, 15.6%, -12.82%, +10.48%
- SELL: 31 sig, 5W/16L, 23.8%, -13.27%, +11.22%
- REDUCE: 16 sig, 3W/5L, 37.5%, -7.48%, +14.46%

### #181 FLRUSD
- BUY: 47 sig, 6W/24L, 20%, -10.91%, +10.04%
- SELL: 13 sig, 1W/10L, 9.1%, -25.39%, +9.16%
- REDUCE: 6 sig, 1W/1L, 50%, -8.54%, +11.67%

### #182 FLUIDUSDT
- BUY: 15 sig, 7W/5L, 58.3%, -8.95%, +30.17%
- SELL: 6 sig, 1W/3L, 25%, -14.09%, +10.02%
- REDUCE: 2 sig, 2W/0L, 100%, -3.24%, +25.40%

### #183 FOGOUSDT
- BUY: 1 sig, 0W/1L, 0%, -21.39%, +12.25%
- SELL: 0 sig
- REDUCE: 0 sig

### #184 FOLKSUSDT.P
- BUY: 1 sig, 0W/1L, 0%, -21.84%, +8.99%
- SELL: 0 sig
- REDUCE: 0 sig

### #185 FORMUSDT
- BUY: 9 sig, 2W/7L, 22.2%, -16.38%, +16.72%
- SELL: 2 sig, 0W/2L, 0%, -21.69%, +48.52%
- REDUCE: 1 sig, 1W/0L, 100%, -6.91%, +46.80%

### #186 FORTHUSD
- BUY: 47 sig, 9W/24L, 27.3%, -11.89%, +11.26%
- SELL: 45 sig, 5W/25L, 16.7%, -14.70%, +13.17%
- REDUCE: 17 sig, 4W/4L, 50%, -10.93%, +12.92%

### #187 FUNUSDT
- BUY: 93 sig, 15W/39L, 27.8%, -12.37%, +20.51%
- SELL: 40 sig, 1W/25L, 3.8%, -42.34%, +8.38%
- REDUCE: 23 sig, 4W/10L, 28.6%, -21.08%, +11.89%

### #188 FUSDT.P
- BUY: 9 sig, 3W/2L, 60%, -9.35%, +20.27%
- SELL: 2 sig, 0W/1L, 0%, -12.37%, +8.13%
- REDUCE: 2 sig, 0W/1L, 0%, -11.79%, +8.15%

### #189 GALAUSDT
- BUY: 83 sig, 19W/41L, 31.7%, -14.78%, +19.77%
- SELL: 26 sig, 5W/16L, 23.8%, -23.54%, +11.85%
- REDUCE: 16 sig, 4W/9L, 30.8%, -41.24%, +19.57%

### #190 GASUSDT
- BUY: 45 sig, 9W/17L, 34.6%, -9.37%, +11.24%
- SELL: 14 sig, 3W/6L, 33.3%, -24.65%, +16.63%
- REDUCE: 6 sig, 1W/1L, 50%, -6.79%, +14.33%

### #191 GHSTUSD
- BUY: 29 sig, 5W/15L, 25%, -11.12%, +19.78%
- SELL: 16 sig, 2W/7L, 22.2%, -28.90%, +12.00%
- REDUCE: 8 sig, 2W/3L, 40%, -11.59%, +8.21%

### #192 GIGGLEUSDT
- BUY: 6 sig, 2W/3L, 40%, -12.38%, +23.55%
- SELL: 2 sig, 2W/0L, 100%, -7.55%, +25.68%
- REDUCE: 2 sig, 1W/1L, 50%, -9.38%, +21.01%

### #193 GLMUSDT
- BUY: 61 sig, 14W/33L, 29.8%, -13.46%, +17.14%
- SELL: 18 sig, 2W/9L, 18.2%, -18.11%, +8.58%
- REDUCE: 8 sig, 3W/1L, 75%, -8.09%, +15.45%

### #194 GMTUSDT
- BUY: 60 sig, 9W/28L, 24.3%, -13.53%, +13.48%
- SELL: 17 sig, 4W/9L, 30.8%, -14.04%, +12.77%
- REDUCE: 10 sig, 5W/5L, 50%, -14.23%, +22.14%

### #195 GMXUSDT
- BUY: 56 sig, 8W/18L, 30.8%, -10.31%, +14.15%
- SELL: 27 sig, 5W/10L, 33.3%, -10.28%, +13.05%
- REDUCE: 18 sig, 3W/10L, 23.1%, -13.05%, +10.10%

### #196 GOATUSDT.P
- BUY: 17 sig, 4W/11L, 26.7%, -20.87%, +12.61%
- SELL: 7 sig, 2W/4L, 33.3%, -13.63%, +19.61%
- REDUCE: 4 sig, 3W/1L, 75%, -6.81%, +35.46%

### #197 GPSUSDT
- BUY: 20 sig, 7W/10L, 41.2%, -14.31%, +21.43%
- SELL: 10 sig, 3W/7L, 30%, -21.13%, +14.61%
- REDUCE: 4 sig, 0W/3L, 0%, -39.40%, +23.03%

### #198 GRASSUSDT.P
- BUY: 11 sig, 1W/8L, 11.1%, -16.75%, +11.30%
- SELL: 3 sig, 0W/2L, 0%, -19.89%, +7.26%
- REDUCE: 2 sig, 1W/1L, 50%, -9.01%, +16.16%

### #199 GRIFFAINUSDT.P
- BUY: 19 sig, 4W/15L, 21.1%, -23.86%, +23.36%
- SELL: 7 sig, 2W/4L, 33.3%, -24.83%, +12.45%
- REDUCE: 4 sig, 2W/2L, 50%, -13.94%, +31.16%

### #200 GRTUSDT
- BUY: 82 sig, 24W/32L, 42.9%, -13.91%, +18.53%
- SELL: 34 sig, 9W/14L, 39.1%, -13.38%, +13.27%
- REDUCE: 18 sig, 4W/4L, 50%, -8.08%, +15.98%

### #201 GTCUSDT.P
- BUY: 65 sig, 8W/42L, 16%, -15.07%, +14.14%
- SELL: 35 sig, 5W/22L, 18.5%, -26.87%, +11.73%
- REDUCE: 21 sig, 8W/10L, 44.4%, -15.52%, +17.76%

### #202 GTUSDT.P
- BUY: 50 sig, 3W/11L, 21.4%, -7.46%, +7.07%
- SELL: 29 sig, 0W/7L, 0%, -9.11%, +4.32%
- REDUCE: 9 sig, 1W/1L, 50%, -4.74%, +5.42%

### #203 GUAUSDT
- BUY: 0 sig
- SELL: 4 sig, 0W/4L, 0%, -57.17%, +10.93%
- REDUCE: 0 sig

### #204 GUNUSDT
- BUY: 12 sig, 4W/7L, 36.4%, -12.13%, +16.55%
- SELL: 5 sig, 1W/4L, 20%, -52.48%, +15.51%
- REDUCE: 1 sig, 0W/1L, 0%, -75.43%, +3.53%

### #205 GUSDT.P
- BUY: 24 sig, 5W/10L, 33.3%, -10.59%, +12.02%
- SELL: 4 sig, 0W/2L, 0%, -10.47%, +12.05%
- REDUCE: 3 sig, 2W/0L, 100%, -3.70%, +18.81%

### #206 GWEIUSDT.P
- 0 signals both sides — skipped

---
## SETTINGS CHANGE: Tickers #207+ use new SL/TP (was 10% SL / 18% TP for both)
## BUY: 15% SL / 16% TP | SELL: 15% SL / 13% TP
---

### #207 HAEDALUSDC
- BUY: 9 sig, 2W/3L, 40%, -12.01%, +11.03%
- SELL: 6 sig, 0W/3L, 0%, -19.75%, +13.02%
- REDUCE: 1 sig, 1W/0L, 100%, -0.77%, +28.23%

### #208 HANAUSDT.P
- BUY: 6 sig, 1W/4L, 20%, -26.99%, +11.44%
- SELL: 0 sig
- REDUCE: 0 sig

### #209 HBARUSDT
- BUY: 87 sig, 17W/25L, 40.5%, -12.24%, +13.45%
- SELL: 46 sig, 18W/12L, 60%, -14.84%, +15.61%
- REDUCE: 26 sig, 9W/7L, 56.3%, -11.83%, +13.73%

### #210 HEIUSDT
- BUY: 8 sig, 1W/3L, 25%, -14.24%, +13.08%
- SELL: 1 sig, 1W/0L, 100%, -2.30%, +26.39%
- REDUCE: 0 sig

### #211 HEMIUSDT.P
- BUY: 12 sig, 4W/8L, 33.3%, -20.18%, +15.54%
- SELL: 1 sig, 1W/0L, 100%, -9.83%, +15.66%
- REDUCE: 1 sig, 1W/0L, 100%, -5.35%, +23.38%

### #212 HFTUSDT.P
- BUY: 41 sig, 12W/14L, 46.2%, -14.23%, +12.62%
- SELL: 15 sig, 8W/5L, 61.5%, -12.26%, +15.41%
- REDUCE: 7 sig, 3W/2L, 60%, -10.44%, +12.53%

### #213 HIGHUSDT
- BUY: 56 sig, 17W/20L, 45.9%, -14.24%, +16.31%
- SELL: 27 sig, 9W/14L, 39.1%, -15.76%, +13.34%
- REDUCE: 12 sig, 2W/6L, 25%, -21.94%, +8.67%

### #214 HIPPOUSDT.P
- BUY: 16 sig, 7W/7L, 50%, -20.79%, +25.42%
- SELL: 7 sig, 5W/2L, 71.4%, -36.63%, +20.80%
- REDUCE: 5 sig, 3W/1L, 75%, -24.54%, +19.12%

### #215 HIVEUSDT
- BUY: 76 sig, 25W/18L, 58.1%, -11.42%, +14.97%
- SELL: 31 sig, 7W/15L, 31.8%, -25.74%, +10.50%
- REDUCE: 10 sig, 3W/6L, 33.3%, -27.19%, +11.32%

### #216 HMSTRUSDC.P
- BUY: 14 sig, 3W/9L, 25%, -20.22%, +12.24%
- SELL: 3 sig, 1W/1L, 50%, -13.57%, +15.49%
- REDUCE: 3 sig, 0W/0L, 0%, -6.73%, +8.38%

### #217 HOLOUSDT
- BUY: 8 sig, 3W/3L, 50%, -12.06%, +19.51%
- SELL: 1 sig, 1W/0L, 100%, -3.67%, +38.98%
- REDUCE: 1 sig, 1W/0L, 100%, -41.29%, +14.88%

### #218 HOMEUSD
- BUY: 7 sig, 1W/1L, 50%, -11.55%, +7.07%
- SELL: 7 sig, 1W/4L, 20%, -14.62%, +7.52%
- REDUCE: 4 sig, 2W/0L, 100%, -8.94%, +20.07%

### #219 HOOKUSDT.P
- BUY: 47 sig, 11W/14L, 44%, -13.32%, +13.29%
- SELL: 17 sig, 9W/4L, 69.2%, -12.66%, +14.95%
- REDUCE: 11 sig, 4W/4L, 50%, -19.24%, +18.54%

### #220 HOTUSDT
- BUY: 118 sig, 23W/38L, 37.7%, -13.65%, +10.97%
- SELL: 37 sig, 11W/14L, 44%, -18.13%, +10.80%
- REDUCE: 19 sig, 5W/7L, 41.7%, -15.21%, +11.04%

### #221 HUMAUSDT
- BUY: 8 sig, 2W/5L, 28.6%, -15.60%, +15.23%
- SELL: 6 sig, 2W/3L, 40%, -16.46%, +12.37%
- REDUCE: 4 sig, 2W/1L, 66.7%, -11.11%, +11.77%

### #222 HUSD
- BUY: 4 sig, 2W/2L, 50%, -26.66%, +25.40%
- SELL: 2 sig, 0W/2L, 0%, -121.44%, +9.35%
- REDUCE: 1 sig, 0W/1L, 0%, -104.31%, +1.19%

### #223 HYPERUSDC
- BUY: 4 sig, 0W/2L, 0%, -15.22%, +8.38%
- SELL: 1 sig, 1W/0L, 100%, -5.23%, +22.45%
- REDUCE: 0 sig

### #224 HYPEUSDT.P
- BUY: 9 sig, 4W/2L, 66.7%, -10.14%, +17.21%
- SELL: 5 sig, 3W/0L, 100%, -9.17%, +13.63%
- REDUCE: 2 sig, 2W/0L, 100%, -1.64%, +22.24%

### #225 ICNTUSDT.P
- BUY: 10 sig, 8W/1L, 88.9%, -11.52%, +40.42%
- SELL: 1 sig, 1W/0L, 100%, -12.96%, +28.56%
- REDUCE: 0 sig

### #226 ICPUSDT
- BUY: 67 sig, 9W/25L, 26.5%, -13.38%, +14.62%
- SELL: 32 sig, 13W/12L, 52%, -19.15%, +13.49%
- REDUCE: 19 sig, 6W/2L, 75%, -6.97%, +12.36%

### #227 ICXUSDT
- BUY: 28 sig, 4W/5L, 44.4%, -10.81%, +10.33%
- SELL: 15 sig, 4W/5L, 44.4%, -15.87%, +9.38%
- REDUCE: 6 sig, 1W/0L, 100%, -6.34%, +12.22%

### #228 IDOLUSDT.P
- BUY: 9 sig, 3W/4L, 42.9%, -15.44%, +15.84%
- SELL: 2 sig, 1W/0L, 100%, -4.92%, +8.82%
- REDUCE: 0 sig

### #229 IDUSDT
- BUY: 36 sig, 9W/14L, 39.1%, -14.07%, +11.69%
- SELL: 16 sig, 7W/5L, 58.3%, -14.74%, +13.41%
- REDUCE: 8 sig, 3W/1L, 75%, -5.20%, +12.05%

### #230 ILVUSDT.P
- BUY: 38 sig, 10W/14L, 41.7%, -15.00%, +13.51%
- SELL: 14 sig, 8W/3L, 72.7%, -10.15%, +14.02%
- REDUCE: 9 sig, 5W/3L, 62.5%, -10.31%, +14.06%

### #231 INITUSD
- BUY: 11 sig, 3W/4L, 42.9%, -12.42%, +20.02%
- SELL: 5 sig, 3W/1L, 75%, -15.70%, +12.66%
- REDUCE: 1 sig, 1W/0L, 100%, -3.67%, +80.60%

### #232 INITUSDT
- BUY: 11 sig, 3W/2L, 60%, -11.57%, +20.77%
- SELL: 3 sig, 1W/1L, 50%, -20.76%, +11.32%
- REDUCE: 1 sig, 1W/0L, 100%, -4.47%, +89.37%

### #233 INJUSDT
- BUY: 67 sig, 24W/20L, 54.5%, -13.75%, +16.29%
- SELL: 45 sig, 13W/20L, 39.4%, -21.10%, +11.57%
- REDUCE: 18 sig, 7W/2L, 77.8%, -9.31%, +20.52%

### #234 INUSDT.P
- BUY: 7 sig, 3W/3L, 50%, -11.97%, +20.08%
- SELL: 1 sig, 0W/0L, 0%, -14.87%, +6.43%
- REDUCE: 1 sig, 0W/0L, 0%, -12.55%, +0.37%

### #235 INXUSDC.P
- 0 signals both sides — skipped

### #236 IOSTUSDT
- BUY: 98 sig, 20W/27L, 42.6%, -13.42%, +12.91%
- SELL: 50 sig, 17W/22L, 43.6%, -18.89%, +12.86%
- REDUCE: 25 sig, 11W/6L, 64.7%, -11.58%, +17.57%

### #237 IOTAUSDT
- BUY: 122 sig, 20W/35L, 36.4%, -11.99%, +12.32%
- SELL: 64 sig, 21W/24L, 46.7%, -16.09%, +11.37%
- REDUCE: 28 sig, 10W/5L, 66.7%, -11.09%, +13.59%

### #238 IOTXUSDT.P
- BUY: 63 sig, 16W/16L, 50%, -10.57%, +10.62%
- SELL: 26 sig, 10W/8L, 55.6%, -14.12%, +13.67%
- REDUCE: 16 sig, 5W/6L, 45.5%, -14.28%, +9.30%

### #239 IOUSDT.P
- BUY: 28 sig, 9W/12L, 42.9%, -14.29%, +18.25%
- SELL: 12 sig, 7W/5L, 58.3%, -14.81%, +14.34%
- REDUCE: 7 sig, 5W/2L, 71.4%, -13.53%, +27.63%

### #240 IPUSD
- BUY: 17 sig, 5W/8L, 38.5%, -13.78%, +17.54%
- SELL: 4 sig, 3W/1L, 75%, -27.59%, +29.10%
- REDUCE: 2 sig, 1W/0L, 100%, -10.97%, +49.34%

### #241 IRUSDT.P
- BUY: 1 sig, 0W/0L, 0%, -12.71%, +15.56% (1 no hit)
- SELL: 0 sig
- REDUCE: 0 sig

### #242 IRYSUSDC
- BUY: 1 sig, 1W/0L, 100%, -13.60%, +19.80% (1 pending)
- SELL: 1 sig, 0W/1L, 0%, -31.55%, +1.53%
- REDUCE: 0 sig

## SETTINGS CHANGE: Tickers #243+ use BUY 15% SL / 15% TP | SELL 15% SL / 13% TP
## (was BUY 15% SL / 16% TP for tickers #207-242)

### #243 JASMYUSDT
- BUY: 66 sig, 16W/19L, 45.7%, -14.18%, +12.35%
- SELL: 24 sig, 10W/9L, 52.6%, -15.90%, +16.48%
- REDUCE: 16 sig, 6W/4L, 60%, -10.45%, +12.15%

### #244 JCTUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -28.65%, +9.48%
- SELL: 0 sig
- REDUCE: 0 sig

### #245 JELLYJELLYUSDT.P
- BUY: 9 sig, 3W/3L, 50%, -13.20%, +35.10%
- SELL: 1 sig, 0W/1L, 0%, -121.26%, +10.48% ⚠️ NEVER SHORT
- REDUCE: 1 sig, 0W/0L, 0%, -6.42%, +4.58%

### #246 JOEUSDT
- BUY: 65 sig, 22W/18L, 55%, -12.82%, +15.39%
- SELL: 21 sig, 8W/10L, 44.4%, -16.10%, +11.41%
- REDUCE: 13 sig, 5W/5L, 50%, -20.63%, +11.80%

### #247 JSTUSDT
- BUY: 66 sig, 13W/18L, 41.9%, -11.17%, +10.53%
- SELL: 38 sig, 9W/12L, 42.9%, -16.60%, +10.81%
- REDUCE: 16 sig, 2W/3L, 40%, -9.62%, +9.03%

### #248 JTOUSDT
- BUY: 34 sig, 14W/11L, 56%, -13.15%, +20.13%
- SELL: 17 sig, 9W/6L, 60%, -13.45%, +16.75%
- REDUCE: 7 sig, 2W/3L, 40%, -16.19%, +22.50%

### #249 JUPUSDT
- BUY: 36 sig, 10W/15L, 40%, -14.09%, +14.21%
- SELL: 17 sig, 7W/5L, 58.3%, -13.86%, +13.92%
- REDUCE: 9 sig, 5W/4L, 55.6%, -11.16%, +18.19%

## SETTINGS CHANGE: Tickers #250+ use BUY 15% SL / 15% TP | SELL 20% SL / 13% TP
## (sell SL bumped from 15% → 20%)

### #250 KAIAUSDT
- BUY: 21 sig, 5W/6L, 45.5%, -14.10%, +12.74%
- SELL: 6 sig, 2W/3L, 40%, -49.56%, +9.67% ⚠️ NEVER SHORT
- REDUCE: 2 sig, 1W/0L, 100%, -7.26%, +16.64%

### #251 KAITOUSDT.P
- BUY: 15 sig, 4W/5L, 44.4%, -11.65%, +16.53%
- SELL: 2 sig, 1W/1L, 50%, -20.07%, +20.16%
- REDUCE: 0 sig

### #252 KASUSDT
- BUY: 64 sig, 23W/16L, 59%, -13.08%, +15.96%
- SELL: 40 sig, 14W/8L, 63.6%, -18.73%, +11.34%
- REDUCE: 14 sig, 5W/1L, 83.3%, -10.15%, +12.95%

### #253 KAVAUSDT
- BUY: 89 sig, 24W/29L, 45.3%, -13.99%, +14.66%
- SELL: 41 sig, 13W/12L, 52%, -17.80%, +11.75%
- REDUCE: 22 sig, 6W/5L, 54.5%, -17.41%, +12.24%

### #254 KERNELUSDT.P
- BUY: 10 sig, 3W/5L, 37.5%, -15.47%, +15.48%
- SELL: 6 sig, 5W/0L, 100%, -10.99%, +23.81%
- REDUCE: 4 sig, 3W/1L, 75%, -16.57%, +18.53%

### #255 KGENUSDT.P
- BUY: 6 sig, 0W/4L, 0%, -21.17%, +9.06%
- SELL: 1 sig, 0W/1L, 0%, -25.57%, +12.73%
- REDUCE: 0 sig

### #256 KITEUSDT
- BUY: 2 sig, 0W/0L, 0%, -10.62%, +5.76% (2 no hit)
- SELL: 0 sig
- REDUCE: 0 sig

### #257 KITEUSDT.P
- BUY: 3 sig, 0W/1L, 0%, -9.63%, +6.75% (2 no hit)
- SELL: 0 sig
- REDUCE: 0 sig

### #258 KMNOUSDC
- BUY: 13 sig, 4W/2L, 66.7%, -9.31%, +12.20%
- SELL: 3 sig, 2W/1L, 66.7%, -13.28%, +20.76%
- REDUCE: 3 sig, 0W/3L, 0%, -40.16%, +3.00%

### #259 KNCUSD
- BUY: 73 sig, 20W/20L, 50%, -13.22%, +11.89%
- SELL: 43 sig, 18W/7L, 72%, -15.21%, +12.38%
- REDUCE: 20 sig, 3W/6L, 33.3%, -16.17%, +9.00%

### #260 KOMAUSDT
- BUY: 13 sig, 4W/8L, 33.3%, -18.96%, +11.02%
- SELL: 5 sig, 1W/1L, 50%, -28.26%, +13.36%
- REDUCE: 4 sig, 1W/1L, 50%, -33.02%, +15.43%

### #261 KSMUSDT
- BUY: 77 sig, 23W/23L, 50%, -13.57%, +12.72%
- SELL: 34 sig, 11W/11L, 50%, -16.58%, +11.10%
- REDUCE: 20 sig, 6W/4L, 60%, -9.69%, +11.50%

## SETTINGS CHANGE: Tickers #262+ use BUY 14.5% SL / 15% TP | SELL 20% SL / 13% TP
## (buy SL tightened from 15% → 14.5%)

### #262 LABUSDT.P
- BUY: 3 sig, 1W/2L, 33.3%, -24.77%, +91.36%
- SELL: 1 sig, 0W/0L, 0%, -18.65%, +9.48%
- REDUCE: 0 sig

### #263 LAUSD
- BUY: 6 sig, 2W/4L, 33.3%, -16.66%, +21.82%
- SELL: 2 sig, 1W/1L, 50%, -49.31%, +9.10%
- REDUCE: 1 sig, 0W/1L, 0%, -30.84%, +8.33%

### #264 LAYERUSD
- BUY: 6 sig, 2W/4L, 33.3%, -21.95%, +9.64%
- SELL: 0 sig
- REDUCE: 0 sig

### #265 LDOUSD
- BUY: 46 sig, 19W/11L, 63.3%, -11.58%, +18.09%
- SELL: 18 sig, 7W/5L, 58.3%, -15.07%, +14.93%
- REDUCE: 10 sig, 6W/0L, 100%, -7.62%, +21.69%

### #266 LIGHTUSDT.P
- BUY: 4 sig, 4W/0L, 100%, -21.17%, +55.82%
- SELL: 0 sig
- REDUCE: 0 sig

### #267 LINEAUSDT
- BUY: 7 sig, 4W/3L, 57.1%, -18.12%, +16.67%
- SELL: 2 sig, 0W/1L, 0%, -12.04%, +14.97%
- REDUCE: 2 sig, 2W/0L, 100%, -7.13%, +56.06%

### #268 LINKUSDT
- BUY: 98 sig, 40W/23L, 63.5%, -11.06%, +14.22%
- SELL: 80 sig, 27W/21L, 56.3%, -18.57%, +11.67%
- REDUCE: 25 sig, 11W/1L, 91.7%, -10.87%, +14.23%

### #269 LISTAUSDT
- BUY: 16 sig, 5W/7L, 41.7%, -16.45%, +14.62%
- SELL: 9 sig, 6W/2L, 75%, -14.34%, +18.09%
- REDUCE: 4 sig, 3W/0L, 100%, -7.53%, +19.09%

### #270 LITUSDT
- BUY: 2 sig, 1W/1L, 50%, -18.31%, +14.09%
- SELL: 0 sig
- REDUCE: 0 sig

### #271 LPTUSDT
- BUY: 59 sig, 18W/23L, 43.9%, -13.22%, +16.52%
- SELL: 24 sig, 10W/7L, 58.8%, -27.07%, +12.52%
- REDUCE: 11 sig, 4W/2L, 66.7%, -15.62%, +11.94%

### #272 LQTYUSDT
- BUY: 33 sig, 13W/7L, 65%, -11.35%, +20.95%
- SELL: 19 sig, 7W/6L, 53.8%, -19.59%, +12.28%
- REDUCE: 9 sig, 5W/0L, 100%, -5.05%, +20.53%

### #273 LRCUSDC
- BUY: 110 sig, 27W/42L, 39.1%, -14.53%, +13.10%
- SELL: 72 sig, 26W/22L, 54.2%, -29.12%, +13.32%
- REDUCE: 32 sig, 8W/8L, 50%, -25.38%, +9.11%

### #274 LSKUSDT.P
- BUY: 31 sig, 9W/14L, 39.1%, -14.42%, +15.11%
- SELL: 9 sig, 2W/1L, 66.7%, -20.39%, +10.87%
- REDUCE: 4 sig, 3W/0L, 100%, -3.55%, +17.56%

### #275 LTCUSDT.P
- BUY: 63 sig, 17W/10L, 63%, -9.23%, +12.19%
- SELL: 51 sig, 10W/13L, 43.5%, -14.37%, +9.29%
- REDUCE: 21 sig, 2W/4L, 33.3%, -12.32%, +8.84%

### #276 LUMIAUSDT
- BUY: 21 sig, 6W/9L, 40%, -17.48%, +16.06%
- SELL: 2 sig, 2W/0L, 100%, -9.51%, +15.63%
- REDUCE: 2 sig, 1W/0L, 100%, -9.57%, +11.57%

### #277 LUNA2USD
- BUY: 41 sig, 14W/18L, 43.8%, -15.60%, +21.70%
- SELL: 19 sig, 4W/8L, 33.3%, -27.81%, +10.77%
- REDUCE: 8 sig, 3W/1L, 75%, -12.42%, +11.32%

### #278 LUNAUSDT
- BUY: 62 sig, 17W/21L, 44.7%, -13.86%, +13.31%
- SELL: 24 sig, 7W/9L, 43.8%, -37.50%, +11.56%
- REDUCE: 8 sig, 2W/0L, 100%, -9.50%, +11.45%

### #279 LUNCUSDT
- BUY: 50 sig, 10W/11L, 47.6%, -12.89%, +10.89%
- SELL: 21 sig, 4W/4L, 50%, -23.30%, +8.37%
- REDUCE: 7 sig, 2W/0L, 100%, -8.81%, +11.07%

### #280 LYNUSDT
- BUY: 3 sig, 3W/0L, 100%, -9.54%, +29.14%
- SELL: 2 sig, 1W/1L, 50%, -56.40%, +14.82%
- REDUCE: 1 sig, 0W/1L, 0%, -34.41%, +8.04%

### #281 MAGICUSDT
- BUY: 50 sig, 16W/17L, 48.5%, -15.00%, +14.15%
- SELL: 14 sig, 5W/5L, 50%, -16.91%, +12.38%
- REDUCE: 8 sig, 3W/1L, 75%, -17.32%, +17.94%

### #282 MAGMAUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -26.63%, +2.84%
- SELL: 0 sig
- REDUCE: 0 sig

### #283 MANAUSDT
- BUY: 85 sig, 23W/36L, 39%, -14.61%, +13.01%
- SELL: 42 sig, 17W/8L, 68%, -16.84%, +13.29%
- REDUCE: 20 sig, 5W/2L, 71.4%, -10.98%, +9.47%

### #284 MANTAUSDT
- BUY: 36 sig, 7W/20L, 25.9%, -18.10%, +11.41%
- SELL: 10 sig, 6W/2L, 75%, -11.48%, +18.48%
- REDUCE: 8 sig, 5W/0L, 100%, -9.27%, +15.34%

### #285 MASKUSDT
- BUY: 59 sig, 24W/21L, 53.3%, -13.42%, +17.45%
- SELL: 31 sig, 10W/8L, 55.6%, -30.49%, +13.17%
- REDUCE: 15 sig, 3W/6L, 33.3%, -17.24%, +9.85%

### #286 MAVIAUSDT.P
- BUY: 23 sig, 8W/11L, 42.1%, -18.10%, +14.19%
- SELL: 7 sig, 2W/5L, 28.6%, -33.64%, +17.92%
- REDUCE: 4 sig, 2W/1L, 66.7%, -10.20%, +12.55%

### #287 MAVUSDT
- BUY: 35 sig, 16W/11L, 59.3%, -13.48%, +17.77%
- SELL: 16 sig, 6W/6L, 50%, -16.92%, +14.03%
- REDUCE: 7 sig, 2W/3L, 40%, -18.18%, +13.22%

### #288 MEGAUSDT.P
- 0 signals both sides — skipped

### #289 MELANIAUSDT.P
- BUY: 14 sig, 5W/2L, 71.4%, -7.80%, +21.32%
- SELL: 5 sig, 2W/3L, 40%, -21.60%, +12.19%
- REDUCE: 2 sig, 1W/0L, 100%, -7.94%, +9.49%

### #290 MEMEUSDT
- BUY: 34 sig, 13W/11L, 54.2%, -14.57%, +13.59%
- SELL: 15 sig, 4W/7L, 36.4%, -32.65%, +10.78%
- REDUCE: 5 sig, 4W/0L, 100%, -5.85%, +20.39%

### #291 MERLUSDT.P
- BUY: 7 sig, 3W/3L, 50%, -16.79%, +17.63%
- SELL: 2 sig, 2W/0L, 100%, -11.00%, +22.71%
- REDUCE: 1 sig, 1W/0L, 100%, -11.80%, +31.91%

### #292 METISUSDC
- BUY: 46 sig, 14W/16L, 46.7%, -11.66%, +15.31%
- SELL: 25 sig, 14W/4L, 77.8%, -13.45%, +14.94%
- REDUCE: 15 sig, 9W/1L, 90%, -8.47%, +16.79%

### #293 METUSD
- BUY: 8 sig, 5W/0L, 100%, -7.84%, +27.13%
- SELL: 1 sig, 1W/0L, 100%, -4.61%, +16.41%
- REDUCE: 1 sig, 0W/0L, 0%, -11.49%, +2.97%

### #294 MEUSDT
- BUY: 16 sig, 2W/7L, 22.2%, -13.10%, +10.87%
- SELL: 2 sig, 1W/0L, 100%, -6.72%, +13.91%
- REDUCE: 1 sig, 1W/0L, 100%, -2.67%, +22.35%

### #295 MEWUSDT
- BUY: 33 sig, 12W/10L, 54.5%, -14.15%, +15.25%
- SELL: 10 sig, 6W/2L, 75%, -15.25%, +16.40%
- REDUCE: 4 sig, 2W/2L, 50%, -25.18%, +29.83%

### #296 MINAUSD
- BUY: 56 sig, 22W/17L, 56.4%, -12.26%, +19.96%
- SELL: 28 sig, 11W/9L, 55%, -22.05%, +11.76%
- REDUCE: 16 sig, 6W/4L, 60%, -19.58%, +10.63%

### #297 MIRAUSDT
- BUY: 7 sig, 2W/3L, 40%, -16.10%, +19.95%
- SELL: 1 sig, 0W/0L, 0%, -11.19%, +3.47%
- REDUCE: 0 sig

### #298 MITOUSDT
- BUY: 12 sig, 2W/7L, 22.2%, -17.58%, +20.09%
- SELL: 1 sig, 1W/0L, 100%, -6.01%, +32.19%
- REDUCE: 1 sig, 1W/0L, 100%, -5.76%, +82.35%

### #299 MLNUSDT.P
- BUY: 12 sig, 2W/3L, 40%, -10.37%, +10.16%
- SELL: 3 sig, 3W/0L, 100%, -9.69%, +13.45%
- REDUCE: 2 sig, 0W/1L, 0%, -34.42%, +4.66%

### #300 MMTUSDT.P
- BUY: 3 sig, 2W/1L, 66.7%, -15.64%, +15.83%
- SELL: 1 sig, 0W/0L, 0%, -10.27%, +4.47%
- REDUCE: 0 sig

### #301 MOCAUSDT
- BUY: 23 sig, 3W/14L, 17.6%, -17.84%, +8.69%
- SELL: 17 sig, 9W/2L, 81.8%, -27.33%, +15.92%
- REDUCE: 7 sig, 2W/2L, 50%, -14.56%, +13.61%

### #302 MOGUSDT
- BUY: 25 sig, 13W/9L, 59.1%, -18.78%, +22.09%
- SELL: 14 sig, 8W/6L, 57.1%, -27.00%, +19.60%
- REDUCE: 4 sig, 1W/3L, 25%, -18.98%, +19.85%

### #303 MONUSD
- BUY: 2 sig, 1W/1L, 50%, -14.69%, +13.86%
- SELL: 0 sig
- REDUCE: 0 sig

### #304 MOODENGUSDT.P
- BUY: 21 sig, 9W/6L, 60%, -13.21%, +32.12%
- SELL: 9 sig, 4W/5L, 44.4%, -58.60%, +21.64%
- REDUCE: 3 sig, 1W/1L, 50%, -14.29%, +12.48%

### #305 MORPHOUSDT
- BUY: 20 sig, 11W/4L, 73.3%, -11.64%, +20.22%
- SELL: 14 sig, 10W/0L, 100%, -8.40%, +22.49%
- REDUCE: 7 sig, 3W/2L, 60%, -13.53%, +11.70%

### #306 MOVEUSD
- BUY: 15 sig, 7W/3L, 70%, -12.53%, +20.54%
- SELL: 5 sig, 4W/0L, 100%, -10.60%, +21.22%
- REDUCE: 3 sig, 1W/1L, 50%, -20.28%, +16.40%

### #307 MOVRUSDT
- BUY: 65 sig, 17W/28L, 37.8%, -15.85%, +13.19%
- SELL: 16 sig, 7W/3L, 70%, -14.43%, +11.22%
- REDUCE: 8 sig, 6W/1L, 85.7%, -10.60%, +18.78%

### #308 MTLUSDT.P
- BUY: 40 sig, 13W/9L, 59.1%, -10.93%, +15.90%
- SELL: 30 sig, 12W/4L, 75%, -15.15%, +12.48%
- REDUCE: 15 sig, 4W/2L, 66.7%, -13.86%, +14.40%

### #309 MUBARAKUSDT
- BUY: 13 sig, 7W/3L, 70%, -9.20%, +38.18%
- SELL: 2 sig, 0W/1L, 0%, -31.00%, +5.13%
- REDUCE: 1 sig, 0W/0L, 0%, -9.86%, +12.14%

### #310 MUSDT
- BUY: 6 sig, 2W/2L, 50%, -16.94%, +15.60%
- SELL: 3 sig, 1W/2L, 33.3%, -102.92%, +11.79% ⚠️ NEVER SHORT
- REDUCE: 1 sig, 0W/0L, 0%, -17.98%, +5.12%

### #311 MYXUSDT.P
- BUY: 1 sig, 1W/0L, 100%, -7.14%, +163.02%
- SELL: 1 sig, 0W/1L, 0%, -98.00%, +2.40% ⚠️ NEVER SHORT
- REDUCE: 0 sig

### #312 NAORISUSDT.P
- BUY: 2 sig, 0W/2L, 0%, -23.56%, +66.83%
- SELL: 2 sig, 0W/2L, 0%, -85.96%, +10.61% ⚠️ NEVER SHORT
- REDUCE: 1 sig, 1W/0L, 100%, -10.20%, +17.03%

### #313 NEARUSDT
- BUY: 65 sig, 20W/28L, 41.7%, -14.78%, +16.16%
- SELL: 50 sig, 25W/14L, 64.1%, -17.15%, +14.52%
- REDUCE: 26 sig, 11W/6L, 64.7%, -14.54%, +14.28%

### #314 NEOUSD
- BUY: 108 sig, 28W/34L, 45.2%, -14.92%, +13.78%
- SELL: 73 sig, 28W/22L, 56%, -26.32%, +11.74%
- REDUCE: 26 sig, 12W/3L, 80%, -10.51%, +11.77%

### #315 NEWTUSD
- BUY: 12 sig, 3W/6L, 33.3%, -16.21%, +11.69%
- SELL: 3 sig, 3W/0L, 100%, -8.24%, +23.17%
- REDUCE: 3 sig, 2W/0L, 100%, -7.51%, +12.32%

### #316 NEXOUSDT
- BUY: 49 sig, 6W/9L, 40%, -9.42%, +8.05%
- SELL: 12 sig, 2W/2L, 50%, -8.86%, +7.23%
- REDUCE: 8 sig, 2W/1L, 66.7%, -9.24%, +10.86%

### #317 NFPUSDT
- BUY: 36 sig, 9W/18L, 33.3%, -16.29%, +13.75%
- SELL: 13 sig, 7W/3L, 70%, -15.11%, +16.43%
- REDUCE: 9 sig, 4W/0L, 100%, -8.21%, +12.53%

### #318 NIGHTUSD
- BUY: 2 sig, 0W/1L, 0%, -18.33%, +4.42%
- SELL: 0 sig
- REDUCE: 0 sig

### #319 NILUSDC.P
- BUY: 7 sig, 4W/1L, 80%, -8.44%, +18.24%
- SELL: 6 sig, 4W/1L, 80%, -14.56%, +27.93%
- REDUCE: 2 sig, 1W/0L, 100%, -3.31%, +15.85%

### #320 NMRUSDC
- BUY: 6 sig, 3W/0L, 100%, -7.47%, +14.33%
- SELL: 1 sig, 1W/0L, 100%, -17.30%, +15.53%
- REDUCE: 0 sig

### #321 NOMUSDT
- BUY: 3 sig, 2W/1L, 66.7%, -15.46%, +73.91%
- SELL: 0 sig
- REDUCE: 0 sig

### #322 NOTUSDT
- BUY: 27 sig, 10W/9L, 52.6%, -11.70%, +19.53%
- SELL: 7 sig, 4W/1L, 80%, -8.65%, +18.29%
- REDUCE: 7 sig, 4W/0L, 100%, -4.31%, +24.04%

### #323 NTRNUSD
- BUY: 27 sig, 6W/9L, 40%, -14.18%, +9.66%
- SELL: 5 sig, 3W/0L, 100%, -9.23%, +12.08%
- REDUCE: 3 sig, 2W/0L, 100%, -6.40%, +17.48%

### #324 NXPCUSDC
- BUY: 12 sig, 2W/7L, 22.2%, -14.05%, +11.07%
- SELL: 2 sig, 1W/0L, 100%, -5.52%, +15.27%
- REDUCE: 2 sig, 1W/1L, 50%, -20.18%, +7.87%

--- SETTINGS CHANGE: O tickers (#325+) use BUY 14% SL / 15% TP, SELL 20% SL / 13% TP ---

### #325 OGNUSD
- BUY: 48 sig, 19W/11L, 63.3%, -11.54%, +20.37%
- SELL: 23 sig, 10W/6L, 62.5%, -17.98%, +16.60%
- REDUCE: 9 sig, 3W/0L, 100%, -9.56%, +9.35%

### #326 OGUSDT.P
- BUY: 8 sig, 1W/1L, 50%, -8.97%, +10.17%
- SELL: 5 sig, 4W/0L, 100%, -6.22%, +21.32%
- REDUCE: 5 sig, 2W/2L, 50%, -17.53%, +9.65%

### #327 OKBUSDT
- BUY: 101 sig, 24W/23L, 51.1%, -10.65%, +10.75%
- SELL: 69 sig, 12W/22L, 35.3%, -14.96%, +7.81%
- REDUCE: 25 sig, 5W/4L, 55.6%, -9.69%, +9.89%

### #328 OLUSDT.P
- BUY: 7 sig, 3W/2L, 60%, -12.09%, +21.70%
- SELL: 2 sig, 1W/0L, 100%, -11.91%, +49.49%
- REDUCE: 1 sig, 1W/0L, 100%, -46.49%, +34.28%

### #329 OMUSDT
- BUY: 60 sig, 17W/23L, 42.5%, -13.02%, +16.12%
- SELL: 21 sig, 7W/3L, 70%, -15.55%, +12.38%
- REDUCE: 13 sig, 4W/3L, 57.1%, -15.20%, +11.26%

### #330 ONDOUSDT
- BUY: 35 sig, 9W/16L, 36%, -14.16%, +15.33%
- SELL: 15 sig, 10W/3L, 76.9%, -15.99%, +14.83%
- REDUCE: 9 sig, 6W/0L, 100%, -5.62%, +22.83%

### #331 ONEUSDT
- BUY: 100 sig, 25W/40L, 38.5%, -14.26%, +13.72%
- SELL: 50 sig, 20W/17L, 54.1%, -20.09%, +12.96%
- REDUCE: 24 sig, 10W/3L, 76.9%, -11.88%, +14.86%

### #332 ONGUSDT.P
- BUY: 36 sig, 9W/10L, 47.4%, -11.03%, +10.22%
- SELL: 13 sig, 2W/1L, 66.7%, -12.27%, +9.62%
- REDUCE: 7 sig, 0W/3L, 0%, -14.72%, +8.52%

### #333 ONTUSDT
- BUY: 106 sig, 27W/31L, 46.6%, -11.88%, +13.21%
- SELL: 62 sig, 18W/19L, 48.6%, -17.29%, +12.04%
- REDUCE: 28 sig, 7W/6L, 53.8%, -16.54%, +9.82%

### #334 ONUSDT.P
- BUY: 4 sig, 1W/2L, 33.3%, -16.72%, +19.79%
- SELL: 0 sig
- REDUCE: 0 sig

### #335 OPENUSD
- BUY: 8 sig, 4W/2L, 66.7%, -10.59%, +18.40%
- SELL: 2 sig, 1W/1L, 50%, -13.23%, +47.99%
- REDUCE: 2 sig, 2W/0L, 100%, -6.34%, +15.13%

### #336 OPUSDT
- BUY: 53 sig, 12W/18L, 40%, -13.08%, +13.68%
- SELL: 22 sig, 8W/5L, 61.5%, -15.63%, +10.02%
- REDUCE: 9 sig, 4W/1L, 80%, -9.61%, +19.92%

### #337 ORCAUSDT
- BUY: 21 sig, 5W/9L, 35.7%, -14.33%, +19.86%
- SELL: 5 sig, 3W/1L, 75%, -7.65%, +28.98%
- REDUCE: 3 sig, 3W/0L, 100%, -3.93%, +39.32%

### #338 ORDERUSD
- BUY: 3 sig, 2W/1L, 66.7%, -12.30%, +14.43%
- SELL: 2 sig, 1W/1L, 50%, -18.91%, +17.82%
- REDUCE: 1 sig, 1W/0L, 100%, -6.02%, +33.94%

### #339 ORDIUSDT
- BUY: 25 sig, 11W/11L, 50%, -12.92%, +19.83%
- SELL: 17 sig, 6W/5L, 54.5%, -16.45%, +15.14%
- REDUCE: 8 sig, 6W/1L, 85.7%, -7.74%, +19.81%

### #340 OREUSDT
- BUY: 2 sig, 0W/2L, 0%, -33.30%, +5.72%
- SELL: 0 sig
- REDUCE: 0 sig

### #341 OXTUSDT.P
- BUY: 30 sig, 9W/8L, 52.9%, -9.63%, +11.98%
- SELL: 19 sig, 12W/2L, 85.7%, -9.89%, +15.54%
- REDUCE: 11 sig, 3W/0L, 100%, -8.56%, +13.79%

--- SETTINGS CHANGE: P tickers (#342+) use BUY 14.5% SL / 15% TP, SELL 20% SL / 13% TP ---

### #342 PARTIUSD
- BUY: 3 sig, 2W/1L, 66.7%, -12.30%, +25.27%
- SELL: 3 sig, 2W/1L, 66.7%, -50.03%, +21.47%
- REDUCE: 2 sig, 1W/1L, 50%, -61.68%, +12.73%

### #343 PENDLEUSDT
- BUY: 45 sig, 18W/17L, 51.4%, -12.82%, +18.05%
- SELL: 17 sig, 4W/8L, 33.3%, -21.57%, +8.81%
- REDUCE: 5 sig, 2W/0L, 100%, -11.80%, +9.69%

### #344 PENGUINUSDT
- BUY: 1 sig, 0W/1L, 0%, -22.73%, +71.86%
- SELL: 0 sig
- REDUCE: 0 sig

### #345 PENGUUSDT
- BUY: 11 sig, 1W/4L, 20%, -16.67%, +8.68%
- SELL: 9 sig, 4W/2L, 66.7%, -22.07%, +12.71%
- REDUCE: 3 sig, 2W/1L, 66.7%, -25.99%, +46.20%

### #346 PEOPLEUSDT
- BUY: 62 sig, 21W/25L, 45.7%, -17.77%, +28.88%
- SELL: 29 sig, 12W/13L, 48%, -32.24%, +13.15%
- REDUCE: 18 sig, 6W/4L, 60%, -14.89%, +13.62%

### #347 PEPEUSDT
- BUY: 34 sig, 11W/14L, 44%, -13.61%, +18.91%
- SELL: 21 sig, 12W/6L, 66.7%, -19.28%, +15.08%
- REDUCE: 14 sig, 8W/3L, 72.7%, -9.84%, +19.57%

### #348 PHBUSDT
- BUY: 43 sig, 14W/19L, 42.4%, -15.65%, +14.33%
- SELL: 13 sig, 3W/4L, 42.9%, -19.85%, +12.52%
- REDUCE: 7 sig, 1W/2L, 33.3%, -14.07%, +21.18%

### #349 PIEVERSEUSDT.P
- BUY: 2 sig, 1W/0L, 100%, -11.96%, +14.95%
- SELL: 3 sig, 2W/1L, 66.7%, -34.00%, +22.00%
- REDUCE: 1 sig, 0W/1L, 0%, -39.36%, +12.89%

### #350 PIPPINUSDT.P
- BUY: 8 sig, 4W/4L, 50%, -17.15%, +127.66%
- SELL: 3 sig, 3W/0L, 100%, -14.75%, +24.00%
- REDUCE: 2 sig, 2W/0L, 100%, -8.99%, +25.57%

### #351 PIUSDT
- BUY: 21 sig, 5W/3L, 62.5%, -10.98%, +10.43%
- SELL: 5 sig, 4W/0L, 100%, -6.76%, +14.45%
- REDUCE: 3 sig, 0W/1L, 0%, -59.33%, +4.23%

### #352 PIXELUSDT
- BUY: 33 sig, 10W/16L, 38.5%, -17.86%, +16.03%
- SELL: 9 sig, 7W/0L, 100%, -10.43%, +17.64%
- REDUCE: 5 sig, 2W/0L, 100%, -11.41%, +15.94%

### #353 PLUMEUSDT
- BUY: 15 sig, 4W/6L, 40%, -15.56%, +20.81%
- SELL: 5 sig, 3W/0L, 100%, -11.51%, +15.60%
- REDUCE: 4 sig, 2W/0L, 100%, -16.02%, +12.82%

### #354 PNUTUSDT
- BUY: 21 sig, 4W/9L, 30.8%, -16.77%, +9.78%
- SELL: 6 sig, 1W/3L, 25%, -15.44%, +15.12%
- REDUCE: 6 sig, 5W/0L, 100%, -4.80%, +30.42%

### #355 POLUSDT
- BUY: 25 sig, 4W/7L, 36.4%, -12.11%, +9.67%
- SELL: 9 sig, 5W/0L, 100%, -5.76%, +16.37%
- REDUCE: 4 sig, 3W/0L, 100%, -4.14%, +26.37%

### #356 POLYXUSDT
- BUY: 46 sig, 13W/18L, 41.9%, -14.42%, +22.70%
- SELL: 20 sig, 7W/2L, 77.8%, -17.47%, +10.65%
- REDUCE: 8 sig, 1W/3L, 25%, -15.18%, +6.24%

### #357 PORTALUSDT
- BUY: 38 sig, 9W/22L, 29%, -19.69%, +12.64%
- SELL: 8 sig, 5W/2L, 71.4%, -12.67%, +20.19%
- REDUCE: 5 sig, 3W/1L, 75%, -13.94%, +14.53%

### #358 POWERUSDT
- BUY: 2 sig, 1W/1L, 50%, -28.81%, +25.69%
- SELL: 1 sig, 1W/0L, 100%, -10.57%, +18.34%
- REDUCE: 1 sig, 0W/1L, 0%, -139.91%, +8.87%

### #359 POWRUSD
- BUY: 31 sig, 15W/7L, 68.2%, -11.05%, +17.61%
- SELL: 12 sig, 6W/4L, 60%, -33.93%, +16.58%
- REDUCE: 7 sig, 4W/1L, 80%, -19.33%, +18.77%

### #360 PROMPTUSDT.P
- BUY: 13 sig, 8W/3L, 72.7%, -13.23%, +20.07%
- SELL: 3 sig, 2W/0L, 100%, -9.55%, +16.34%
- REDUCE: 3 sig, 2W/1L, 66.7%, -16.96%, +34.61%

### #361 PROMUSDT
- BUY: 20 sig, 9W/4L, 69.2%, -9.46%, +21.35%
- SELL: 14 sig, 2W/6L, 25%, -31.03%, +6.25%
- REDUCE: 6 sig, 1W/2L, 33.3%, -20.16%, +8.23%

### #362 PROVEUSDT
- BUY: 9 sig, 2W/4L, 33.3%, -14.26%, +8.92%
- SELL: 1 sig, 0W/0L, 0%, -9.91%, +3.01%
- REDUCE: 1 sig, 0W/0L, 0%, -11.02%, +11.46%

### #363 PTBUSDT.P
- BUY: 8 sig, 5W/3L, 62.5%, -19.61%, +40.53%
- SELL: 1 sig, 1W/0L, 100%, -6.55%, +52.75%
- REDUCE: 1 sig, 1W/0L, 100%, -4.80%, +54.54%

### #364 PUFFERUSD
- BUY: 11 sig, 1W/7L, 12.5%, -17.48%, +8.26%
- SELL: 8 sig, 3W/3L, 50%, -21.05%, +16.13%
- REDUCE: 4 sig, 1W/2L, 33.3%, -43.76%, +13.29%

### #365 PUMPBTCUSDT.P
- BUY: 10 sig, 5W/4L, 55.6%, -16.60%, +22.40%
- SELL: 2 sig, 1W/1L, 50%, -16.73%, +15.17%
- REDUCE: 2 sig, 2W/0L, 100%, -5.84%, +27.92%

### #366 PUMPUSDT.P
- BUY: 9 sig, 4W/4L, 50%, -15.26%, +19.43%
- SELL: 6 sig, 3W/3L, 50%, -30.26%, +16.19%
- REDUCE: 3 sig, 2W/1L, 66.7%, -23.10%, +23.09%

### #367 PUNDIXUSDT
- BUY: 64 sig, 19W/15L, 55.9%, -11.74%, +15.87%
- SELL: 29 sig, 6W/12L, 33.3%, -19.14%, +10.24%
- REDUCE: 10 sig, 2W/1L, 66.7%, -13.71%, +10.27%

### #368 PYTHUSDT
- BUY: 33 sig, 11W/14L, 44%, -13.99%, +13.32%
- SELL: 12 sig, 3W/2L, 60%, -12.48%, +9.14%
- REDUCE: 7 sig, 4W/0L, 100%, -8.93%, +14.85%

### #369 QNTUSDT
- BUY: 62 sig, 16W/16L, 50%, -10.79%, +10.32%
- SELL: 27 sig, 6W/9L, 40%, -17.11%, +8.40%
- REDUCE: 13 sig, 2W/2L, 50%, -11.47%, +7.37%

### #370 QTUMUSDT
- BUY: 115 sig, 25W/39L, 39.1%, -12.76%, +12.12%
- SELL: 63 sig, 15W/20L, 42.9%, -16.12%, +9.57%
- REDUCE: 28 sig, 11W/6L, 64.7%, -12.92%, +12.61%

### #371 QUSD
- BUY: 4 sig, 2W/2L, 50%, -14.78%, +55.57%
- SELL: 1 sig, 0W/1L, 0%, -191.20%, +5.74% ⚠️ NEVER SHORT
- REDUCE: 0 sig

### #372 RATSUSDT
- BUY: 26 sig, 15W/8L, 65.2%, -17.68%, +28.16%
- SELL: 23 sig, 8W/14L, 36.4%, -36.75%, +17.23%
- REDUCE: 8 sig, 5W/2L, 71.4%, -21.95%, +19.72%

### #373 RAYUSDT
- BUY: 68 sig, 27W/22L, 55.1%, -14.59%, +16.08%
- SELL: 25 sig, 9W/13L, 40.9%, -20.74%, +11.96%
- REDUCE: 9 sig, 6W/2L, 75%, -14.58%, +22.31%

### #374 RDNTUSDT.P
- BUY: 48 sig, 16W/15L, 51.6%, -11.51%, +13.35%
- SELL: 20 sig, 12W/3L, 80%, -12.44%, +15.80%
- REDUCE: 9 sig, 3W/1L, 75%, -9.05%, +10.39%

### #375 RECALLUSDT.P
- BUY: 7 sig, 3W/4L, 42.9%, -23.25%, +18.57%
- SELL: 0 sig
- REDUCE: 0 sig

### #376 REDUSDT
- BUY: 17 sig, 9W/6L, 60%, -12.40%, +21.88%
- SELL: 5 sig, 3W/0L, 100%, -38.62%, +13.33%
- REDUCE: 3 sig, 2W/0L, 100%, -24.06%, +11.76%

### #377 RENDERUSDT
- BUY: 68 sig, 24W/26L, 48%, -15.84%, +18.76%
- SELL: 26 sig, 14W/6L, 70%, -18.08%, +14.74%
- REDUCE: 12 sig, 6W/2L, 75%, -13.77%, +21.27%

### #378 RESOLVUSDT.P
- BUY: 6 sig, 4W/1L, 80%, -11.55%, +98.72%
- SELL: 1 sig, 1W/0L, 100%, -43.16%, +19.54%
- REDUCE: 0 sig

### #379 REZUSDC
- BUY: 21 sig, 3W/10L, 23.1%, -19.60%, +14.82%
- SELL: 1 sig, 1W/0L, 100%, -66.67%, +20.32%
- REDUCE: 1 sig, 0W/1L, 0%, -27.58%, +5.60%

### #380 RIFUSDT
- BUY: 62 sig, 12W/15L, 44.4%, -11.13%, +20.81%
- SELL: 23 sig, 4W/5L, 44.4%, -14.32%, +12.34%
- REDUCE: 11 sig, 4W/4L, 50%, -31.46%, +13.50%

### #381 RIVERUSDT.P
- BUY: 3 sig, 0W/3L, 0%, -29.51%, +64.45%
- SELL: 5 sig, 2W/3L, 40%, -101.74%, +31.69% ⚠️ NEVER SHORT
- REDUCE: 1 sig, 1W/0L, 100%, -9.85%, +49.60%

### #382 RLCUSD
- BUY: 28 sig, 11W/8L, 57.9%, -10.77%, +14.03%
- SELL: 14 sig, 5W/4L, 55.6%, -15.19%, +11.79%
- REDUCE: 8 sig, 3W/0L, 100%, -8.74%, +11.41%

### #383 RLSUSD
- BUY: 2 sig, 0W/1L, 0%, -12.15%, +5.05%
- SELL: 1 sig, 1W/0L, 100%, -5.16%, +31.17%
- REDUCE: 0 sig

### #384 ROSEUSDT
- BUY: 62 sig, 10W/26L, 27.8%, -14.94%, +10.68%
- SELL: 42 sig, 11W/14L, 44%, -21.01%, +10.85%
- REDUCE: 14 sig, 5W/1L, 83.3%, -11.39%, +16.34%

### #385 RPLUSDT
- BUY: 54 sig, 11W/23L, 32.4%, -12.92%, +14.77%
- SELL: 14 sig, 6W/2L, 75%, -12.08%, +11.72%
- REDUCE: 10 sig, 4W/3L, 57.1%, -12.76%, +13.46%

### #386 RSCUSD
- BUY: 14 sig, 6W/6L, 50%, -12.71%, +17.78%
- SELL: 3 sig, 2W/1L, 66.7%, -12.62%, +20.75%
- REDUCE: 3 sig, 3W/0L, 100%, -2.49%, +34.57%

### #387 RSRUSDT
- BUY: 81 sig, 33W/23L, 58.9%, -13.56%, +16.80%
- SELL: 46 sig, 20W/15L, 57.1%, -17.28%, +16.39%
- REDUCE: 24 sig, 11W/4L, 73.3%, -13.52%, +12.89%

### #388 RUNEUSDT
- BUY: 82 sig, 26W/34L, 43.3%, -15.49%, +16.61%
- SELL: 52 sig, 26W/13L, 66.7%, -19.95%, +15.19%
- REDUCE: 22 sig, 13W/3L, 81.3%, -11.61%, +17.01%

### #389 RVNUSDT
- BUY: 93 sig, 20W/29L, 40.8%, -12.78%, +13.57%
- SELL: 39 sig, 10W/14L, 41.7%, -25.20%, +10.35%
- REDUCE: 16 sig, 6W/4L, 60%, -18.49%, +18.89%

### #390 RVVUSDT
- BUY: 6 sig, 4W/2L, 66.7%, -19.70%, +59.02%
- SELL: 1 sig, 1W/0L, 100%, -5.25%, +33.70%
- REDUCE: 1 sig, 0W/1L, 0%, -215.53%, +5.00%

### #391 SAFEUSD
- BUY: 24 sig, 8W/6L, 57.1%, -11.2%, +16.5%
- SELL: 10 sig, 4W/3L, 57.1%, -15%, +14.05%
- REDUCE: 7 sig, 1W/1L, 50%, -14.47%, +9.55%

### #392 SAGAUSDT.P
- BUY: 34 sig, 10W/18L, 35.7%, -17.97%, +17.49%
- SELL: 8 sig, 5W/1L, 83.3%, -12.02%, +18.81%
- REDUCE: 4 sig, 3W/0L, 100%, -9.53%, +20.16%

### #393 SAHARAUSDT
- BUY: 4 sig, 2W/2L, 50%, -15.69%, +17.79%
- SELL: 2 sig, 2W/0L, 100%, -5.98%, +23.4%
- REDUCE: 2 sig, 1W/0L, 100%, -2.16%, +13.01%

### #394 SANDUSDT
- BUY: 78 sig, 14W/24L, 36.8%, -12.56%, +15.18%
- SELL: 30 sig, 15W/5L, 75%, -18.13%, +13.62%
- REDUCE: 19 sig, 8W/4L, 66.7%, -13.35%, +14.09%

### #395 SAPIENUSDC
- BUY: 7 sig, 4W/2L, 66.7%, -18.59%, +22.91%
- SELL: 2 sig, 2W/0L, 100%, -27.78%, +18.81%
- REDUCE: 1 sig, 1W/0L, 100%, -2.96%, +26.57%

### #396 SCRUSDT
- BUY: 25 sig, 4W/15L, 21.1%, -18.27%, +14.6%
- SELL: 9 sig, 4W/2L, 66.7%, -15.34%, +17.73%
- REDUCE: 4 sig, 0W/2L, 0%, -18.42%, +9.27%

### #397 SEIUSDT
- BUY: 47 sig, 11W/19L, 36.7%, -14.72%, +14.2%
- SELL: 27 sig, 9W/6L, 60%, -19.58%, +10.32%
- REDUCE: 11 sig, 4W/2L, 66.7%, -12.81%, +17.83%

### #398 SENTUSD
- BUY: 0 sig (2 pending)
- SELL: 0 sig
- REDUCE: 0 sig

### #399 SFPUSDT
- BUY: 72 sig, 17W/24L, 41.5%, -13.6%, +13.84%
- SELL: 25 sig, 4W/7L, 36.4%, -14.85%, +9.36%
- REDUCE: 14 sig, 4W/1L, 80%, -7.89%, +11.48%

### #400 SHELLUSDT
- BUY: 12 sig, 5W/5L, 50%, -14.26%, +17.53%
- SELL: 6 sig, 1W/3L, 25%, -25.48%, +9.26%
- REDUCE: 2 sig, 2W/0L, 100%, -9.98%, +52.01%

### #401 SHIBUSD
- BUY: 63 sig, 17W/13L, 56.7%, -10.13%, +11.93%
- SELL: 40 sig, 13W/9L, 59.1%, -23.8%, +10.14%
- REDUCE: 22 sig, 9W/1L, 90%, -6.42%, +11.93%

### #402 SIGNBNB
- BUY: 4 sig, 2W/1L, 66.7%, -28.28%, +59.1%
- SELL: 2 sig, 0W/1L, 0%, -16.5%, +7.58%
- REDUCE: 2 sig, 0W/0L, 0%, -7.97%, +3%

### #403 SIRENUSDT.P
- BUY: 8 sig, 5W/1L, 83.3%, -7.32%, +18.82%
- SELL: 8 sig, 4W/0L, 100%, -11.27%, +13.68%
- REDUCE: 2 sig, 1W/1L, 50%, -182.64%, +22.14%

### #404 SKLUSDC
- BUY: 7 sig, 4W/1L, 80%, -13.63%, +19.63%
- SELL: 0 sig
- REDUCE: 0 sig

### #405 SKRUSD
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #406 SKYAIUSDT.P
- BUY: 9 sig, 5W/4L, 55.6%, -15.85%, +58.84%
- SELL: 2 sig, 2W/0L, 100%, -63.18%, +46.5%
- REDUCE: 2 sig, 2W/0L, 100%, -12.87%, +16.71%

### #407 SKYUSDT
- BUY: 4 sig, 2W/0L, 100%, -6.12%, +13.8%
- SELL: 3 sig, 1W/0L, 100%, -8.57%, +12.82%
- REDUCE: 2 sig, 0W/0L, 0%, -12.65%, +3.61%

### #408 SLPUSDT
- BUY: 79 sig, 19W/25L, 43.2%, -12.6%, +14.05%
- SELL: 21 sig, 10W/7L, 58.8%, -19.17%, +16.15%
- REDUCE: 14 sig, 7W/1L, 87.5%, -13.94%, +17.47%

### #409 SNXUSDT
- BUY: 88 sig, 27W/33L, 45%, -13.91%, +17.06%
- SELL: 33 sig, 10W/8L, 55.6%, -16.88%, +11.91%
- REDUCE: 16 sig, 2W/4L, 33.3%, -14.71%, +9.49%

### #410 SOLUSD
- BUY: 69 sig, 20W/16L, 55.6%, -11.32%, +12.91%
- SELL: 37 sig, 7W/11L, 38.9%, -16.84%, +8.73%
- REDUCE: 13 sig, 5W/2L, 71.4%, -12.44%, +13.45%

### #411 SOLVUSDC
- BUY: 3 sig, 0W/0L, 0%, -8.18%, +4.94%
- SELL: 1 sig, 1W/0L, 100%, -8.92%, +14.99%
- REDUCE: 1 sig, 1W/0L, 100%, -1.06%, +15.27%

### #412 SOMIUSDT
- BUY: 11 sig, 3W/6L, 33.3%, -16.62%, +29.04%
- SELL: 1 sig, 0W/1L, 0%, -30.22%, +27.97%
- REDUCE: 1 sig, 1W/0L, 100%, -16.45%, +20.69%

### #413 SONICUSDT.P
- BUY: 12 sig, 4W/3L, 57.1%, -12.26%, +11.84%
- SELL: 9 sig, 4W/2L, 66.7%, -11.92%, +12.24%
- REDUCE: 5 sig, 2W/1L, 66.7%, -6.85%, +25.15%

### #414 SOONUSD
- BUY: 4 sig, 1W/3L, 25%, -25.66%, +13.17%
- SELL: 1 sig, 0W/0L, 0%, -4.96%, +11.75%
- REDUCE: 0 sig

### #415 SOPHUSDT
- BUY: 11 sig, 5W/1L, 83.3%, -10.79%, +27.33%
- SELL: 3 sig, 1W/1L, 50%, -11.55%, +12.03%
- REDUCE: 3 sig, 1W/1L, 50%, -30.08%, +10.65%

### #416 SPACEUSDT.P
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #417 SPELLUSDC
- BUY: 62 sig, 17W/17L, 50%, -12.34%, +14.72%
- SELL: 23 sig, 8W/4L, 66.7%, -13.15%, +11.44%
- REDUCE: 13 sig, 4W/4L, 50%, -13.34%, +11.93%

### #418 SPKUSDT
- BUY: 9 sig, 3W/5L, 37.5%, -15.77%, +16.04%
- SELL: 3 sig, 1W/0L, 100%, -10.51%, +19.76%
- REDUCE: 3 sig, 3W/0L, 100%, -9.43%, +22.73%

### #419 SPORTFUNUSDT.P
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #420 SPXUSDT
- BUY: 24 sig, 16W/7L, 69.6%, -19.11%, +25.32%
- SELL: 11 sig, 4W/5L, 44.4%, -18.91%, +21.19%
- REDUCE: 4 sig, 3W/1L, 75%, -10.3%, +24.8%

### #421 SQDUSDT.P
- BUY: 9 sig, 1W/6L, 14.3%, -23.94%, +5.26%
- SELL: 2 sig, 1W/1L, 50%, -49.6%, +21.44%
- REDUCE: 1 sig, 1W/0L, 100%, -109.34%, +14.92%

### #422 SSVUSDT
- BUY: 37 sig, 15W/10L, 60%, -11.89%, +14.66%
- SELL: 18 sig, 7W/8L, 46.7%, -17.74%, +12.22%
- REDUCE: 9 sig, 3W/1L, 75%, -10.69%, +10.69%

### #423 STABLEUSDT
- BUY: 1 sig, 1W/0L, 100%, -1.62%, +77.84%
- SELL: 1 sig, 1W/0L, 100%, -21.31%, +34.26%
- REDUCE: 0 sig

### #424 STBLUSDT.P
- BUY: 8 sig, 6W/2L, 75%, -24.67%, +25.78%
- SELL: 1 sig, 0W/1L, 0%, -29.87%, +20.61%
- REDUCE: 1 sig, 1W/0L, 100%, -7.15%, +17.91%

### #425 STEEMUSDT
- BUY: 60 sig, 17W/14L, 54.8%, -11.14%, +13.42%
- SELL: 21 sig, 8W/1L, 88.9%, -11.58%, +11.97%
- REDUCE: 11 sig, 4W/1L, 80%, -10.01%, +10.53%

### #426 STGUSDT
- BUY: 63 sig, 13W/13L, 50%, -10.49%, +14.05%
- SELL: 32 sig, 11W/3L, 78.6%, -9.54%, +15.74%
- REDUCE: 17 sig, 6W/4L, 60%, -11.59%, +8.77%

### #427 STORJUSDT
- BUY: 75 sig, 17W/31L, 35.4%, -14.11%, +14.46%
- SELL: 26 sig, 6W/11L, 35.3%, -24.32%, +11.3%
- REDUCE: 13 sig, 7W/2L, 77.8%, -16.42%, +11.98%

### #428 STOUSDT
- BUY: 7 sig, 1W/4L, 20%, -16.2%, +5.92%
- SELL: 1 sig, 1W/0L, 100%, -10%, +26.53%
- REDUCE: 1 sig, 1W/0L, 100%, -2.89%, +16.67%

### #429 STRKUSDT
- BUY: 38 sig, 11W/16L, 40.7%, -16.59%, +14.97%
- SELL: 16 sig, 9W/0L, 100%, -10.67%, +15.21%
- REDUCE: 8 sig, 1W/0L, 100%, -9.42%, +7.5%

### #430 STXUSDT
- BUY: 81 sig, 24W/26L, 48%, -15.11%, +17.32%
- SELL: 42 sig, 19W/11L, 63.3%, -18.61%, +14.28%
- REDUCE: 24 sig, 13W/3L, 81.3%, -17.03%, +17.24%

### #431 SUIUSDT
- BUY: 36 sig, 9W/14L, 39.1%, -14.2%, +11.49%
- SELL: 14 sig, 3W/5L, 37.5%, -19.63%, +6.55%
- REDUCE: 4 sig, 2W/1L, 66.7%, -9.11%, +13%

### #432 SUNUSDT
- BUY: 74 sig, 13W/18L, 41.9%, -10.15%, +10.88%
- SELL: 37 sig, 9W/4L, 69.2%, -13.83%, +10.03%
- REDUCE: 16 sig, 5W/5L, 50%, -33.93%, +8.94%

### #433 SUPERUSD
- BUY: 55 sig, 23W/17L, 57.5%, -13.1%, +18.89%
- SELL: 23 sig, 6W/5L, 54.5%, -19.34%, +10.3%
- REDUCE: 11 sig, 9W/0L, 100%, -7.42%, +17.99%

### #434 SUSDT
- BUY: 14 sig, 5W/7L, 41.7%, -14.43%, +18%
- SELL: 6 sig, 3W/2L, 60%, -21.85%, +12.16%
- REDUCE: 5 sig, 1W/0L, 100%, -5.96%, +12.24%

### #435 SUSHIUSDT
- BUY: 77 sig, 24W/28L, 46.2%, -14.34%, +14.63%
- SELL: 42 sig, 16W/14L, 53.3%, -19.75%, +13.73%
- REDUCE: 18 sig, 5W/4L, 55.6%, -13.37%, +10.17%

### #436 SWARMSUSDT.P
- BUY: 18 sig, 5W/10L, 33.3%, -23.88%, +17.13%
- SELL: 4 sig, 4W/0L, 100%, -8.14%, +25.79%
- REDUCE: 4 sig, 2W/2L, 50%, -26.14%, +25.12%

### #437 SXTUSDT
- BUY: 12 sig, 3W/3L, 50%, -11.58%, +11.54%
- SELL: 2 sig, 1W/0L, 100%, -12.9%, +14.14%
- REDUCE: 1 sig, 1W/0L, 100%, -2.7%, +13.84%

### #438 SYNUSDT.P
- BUY: 24 sig, 17W/4L, 81%, -10.96%, +27.57%
- SELL: 2 sig, 0W/2L, 0%, -85.02%, +27.65%
- REDUCE: 0 sig

### #439 SYRUPUSDT
- BUY: 11 sig, 5W/2L, 71.4%, -10.26%, +18.31%
- SELL: 4 sig, 2W/0L, 100%, -11.31%, +17.22%
- REDUCE: 2 sig, 1W/0L, 100%, -13.78%, +10.23%

### #440 TACUSDT.P
- BUY: 6 sig, 5W/1L, 83.3%, -8.13%, +79.11%
- SELL: 0 sig
- REDUCE: 0 sig

### #441 TAGUSDT.P
- BUY: 5 sig, 1W/3L, 25%, -25%, +25.47%
- SELL: 1 sig, 1W/0L, 100%, -31.2%, +72.82%
- REDUCE: 1 sig, 1W/0L, 100%, -38.19%, +22.75%

### #442 TAIKOUSDT.P
- BUY: 13 sig, 3W/5L, 37.5%, -12.3%, +15.6%
- SELL: 4 sig, 1W/1L, 50%, -17.65%, +9.21%
- REDUCE: 1 sig, 0W/0L, 0%, -12.78%, +4.32%

### #443 TAKEUSDT
- BUY: 1 sig, 0W/1L, 0%, -36.74%, +4.78%
- SELL: 3 sig, 0W/1L, 0%, -26.89%, +12.97%
- REDUCE: 1 sig, 0W/0L, 0%, -4.55%, +8.93%

### #444 TAOUSDT
- BUY: 27 sig, 9W/11L, 45%, -13.64%, +15.65%
- SELL: 15 sig, 8W/2L, 80%, -11.77%, +12.84%
- REDUCE: 8 sig, 4W/2L, 66.7%, -12.56%, +13.76%

### #445 TAUSDT.P
- BUY: 9 sig, 3W/5L, 37.5%, -17.87%, +27.24%
- SELL: 1 sig, 0W/1L, 0%, -85.35%, +3.35%
- REDUCE: 0 sig

### #446 THETAUSDT
- BUY: 89 sig, 20W/31L, 39.2%, -13.48%, +12.98%
- SELL: 56 sig, 17W/21L, 44.7%, -24.21%, +11.57%
- REDUCE: 22 sig, 8W/2L, 80%, -10.76%, +17.89%

### #447 THEUSDT
- BUY: 15 sig, 8W/4L, 66.7%, -12.05%, +38.43%
- SELL: 6 sig, 4W/2L, 66.7%, -14.72%, +31.33%
- REDUCE: 5 sig, 5W/0L, 100%, -24.35%, +31.4%

### #448 TIAUSD
- BUY: 36 sig, 14W/16L, 46.7%, -15.38%, +15.74%
- SELL: 18 sig, 5W/5L, 50%, -20.51%, +11.24%
- REDUCE: 10 sig, 7W/0L, 100%, -11.24%, +24.85%

### #449 TLMUSDT.P
- BUY: 61 sig, 12W/19L, 38.7%, -13.66%, +12.88%
- SELL: 26 sig, 7W/9L, 43.8%, -17.28%, +13.36%
- REDUCE: 11 sig, 6W/2L, 75%, -9.55%, +18.4%

### #450 TNSRUSDT
- BUY: 33 sig, 8W/15L, 34.8%, -15.32%, +38.46%
- SELL: 9 sig, 2W/4L, 33.3%, -19.2%, +15.94%
- REDUCE: 5 sig, 3W/1L, 75%, -8.15%, +26.1%

### #451 TONUSDT
- BUY: 24 sig, 4W/4L, 50%, -8.69%, +8.42%
- SELL: 9 sig, 1W/1L, 50%, -10.11%, +7.35%
- REDUCE: 2 sig, 1W/0L, 100%, -2.89%, +43.74%

### #452 TOSHIUSD
- BUY: 18 sig, 8W/8L, 50%, -14.9%, +28.69%
- SELL: 6 sig, 3W/2L, 60%, -23.63%, +14.8%
- REDUCE: 4 sig, 3W/1L, 75%, -16.35%, +15.35%

### #453 TOWNSUSDC
- BUY: 6 sig, 2W/3L, 40%, -17.47%, +19.08%
- SELL: 1 sig, 0W/1L, 0%, -35.17%, +8.43%
- REDUCE: 1 sig, 1W/0L, 100%, -4.29%, +19.68%

### #454 TRADOORUSDT.P
- BUY: 3 sig, 1W/1L, 50%, -11.52%, +164.85%
- SELL: 1 sig, 0W/1L, 0%, -66.77%, +1.4%
- REDUCE: 1 sig, 0W/1L, 0%, -50.27%, +9.56%

### #455 TRBUSDT
- BUY: 75 sig, 25W/26L, 49%, -14.21%, +17.51%
- SELL: 34 sig, 14W/12L, 53.8%, -23.52%, +15.96%
- REDUCE: 16 sig, 9W/4L, 69.2%, -20.77%, +14.62%

### #456 TREEUSDC
- BUY: 7 sig, 4W/1L, 80%, -10.98%, +21.22%
- SELL: 2 sig, 1W/0L, 100%, -10.97%, +15.23%
- REDUCE: 2 sig, 1W/0L, 100%, -8.87%, +13.41%

### #457 TRIAUSD
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #458 TRUMPUSDT
- BUY: 17 sig, 4W/5L, 44.4%, -11.44%, +12.08%
- SELL: 8 sig, 3W/1L, 75%, -9.84%, +12.52%
- REDUCE: 5 sig, 2W/0L, 100%, -7.64%, +21.52%

### #459 TRUSTUSD
- BUY: 5 sig, 1W/4L, 20%, -22.58%, +10.11%
- SELL: 0 sig
- REDUCE: 0 sig

### #460 TRUTHUSDT.P
- BUY: 0 sig
- SELL: 1 sig, 1W/0L, 100%, -16.81%, +19.15%
- REDUCE: 0 sig

### #461 TRUUSDT.P
- BUY: 46 sig, 22W/10L, 68.8%, -11.12%, +24.66%
- SELL: 21 sig, 8W/6L, 57.1%, -16.32%, +11.53%
- REDUCE: 11 sig, 5W/1L, 83.3%, -8.33%, +14.41%

### #462 TRXUSDT
- BUY: 94 sig, 13W/17L, 43.3%, -9.23%, +8.16%
- SELL: 89 sig, 30W/7L, 81.1%, -8.78%, +10.28%
- REDUCE: 44 sig, 7W/6L, 53.8%, -13.43%, +6.8%

### #463 TSTUSDT
- BUY: 8 sig, 5W/3L, 62.5%, -11.76%, +23.73%
- SELL: 3 sig, 0W/3L, 0%, -77.1%, +17.72%
- REDUCE: 2 sig, 0W/1L, 0%, -17.15%, +53.44%

### #464 TURBOUSDC
- BUY: 18 sig, 8W/7L, 53.3%, -16.51%, +12.25%
- SELL: 8 sig, 2W/2L, 50%, -37.68%, +12.51%
- REDUCE: 4 sig, 4W/0L, 100%, -6.89%, +28.82%

### #465 TURTLEUSDT.P
- BUY: 5 sig, 0W/3L, 0%, -15.48%, +7.49%
- SELL: 0 sig
- REDUCE: 0 sig

### #466 TUSDT
- BUY: 51 sig, 10W/13L, 43.5%, -12.43%, +11.14%
- SELL: 17 sig, 8W/3L, 72.7%, -19.81%, +12.37%
- REDUCE: 9 sig, 4W/1L, 80%, -9.86%, +11.41%

### #467 TUTUSDC
- BUY: 7 sig, 2W/3L, 40%, -16.42%, +13.82%
- SELL: 3 sig, 0W/2L, 0%, -33.99%, +5.8%
- REDUCE: 0 sig

### #468 TWTUSDT
- BUY: 66 sig, 13W/18L, 41.9%, -11.79%, +10.45%
- SELL: 31 sig, 10W/5L, 66.7%, -11.31%, +9.97%
- REDUCE: 14 sig, 7W/0L, 100%, -6.75%, +14.55%

### #469 UAIUSDT.P
- BUY: 2 sig, 1W/1L, 50%, -11.86%, +30.33%
- SELL: 0 sig
- REDUCE: 0 sig

### #470 UBUSDT.P
- BUY: 3 sig, 2W/1L, 66.7%, -10.76%, +25.22%
- SELL: 0 sig
- REDUCE: 0 sig

### #471 UMAUSD
- BUY: 78 sig, 26W/25L, 51%, -13.66%, +19.89%
- SELL: 40 sig, 17W/9L, 65.4%, -17.82%, +12.99%
- REDUCE: 21 sig, 6W/7L, 46.2%, -14.78%, +11.93%

### #472 UNIUSDT
- BUY: 76 sig, 21W/21L, 50%, -11.79%, +14.33%
- SELL: 45 sig, 14W/11L, 56%, -16.62%, +10.31%
- REDUCE: 20 sig, 6W/2L, 75%, -8.85%, +13.07%

### #473 USELESSUSDT
- BUY: 15 sig, 6W/9L, 40%, -24.27%, +87.2%
- SELL: 1 sig, 1W/0L, 100%, -17.68%, +13.14%
- REDUCE: 0 sig

### #474 USTCUSDT.P
- BUY: 23 sig, 11W/7L, 61.1%, -13.05%, +18.31%
- SELL: 12 sig, 7W/0L, 100%, -10.35%, +16.22%
- REDUCE: 9 sig, 3W/0L, 100%, -8.59%, +10.39%

### #475 USUALUSDT
- BUY: 23 sig, 10W/9L, 52.6%, -15.16%, +20.78%
- SELL: 7 sig, 5W/1L, 83.3%, -41.66%, +17.68%
- REDUCE: 5 sig, 5W/0L, 100%, -7.12%, +29.77%

### #476 USUSD
- BUY: 0 sig
- SELL: 1 sig, 1W/0L, 100%, -5.07%, +28.8%
- REDUCE: 1 sig, 1W/0L, 100%, -3.23%, +26.58%

### #477 VANAUSDC
- BUY: 9 sig, 1W/4L, 20%, -13.76%, +13.08%
- SELL: 4 sig, 0W/1L, 0%, -16.22%, +8.79%
- REDUCE: 2 sig, 0W/1L, 0%, -13.8%, +6.34%

### #478 VANRYUSDT
- BUY: 36 sig, 15W/15L, 50%, -16.96%, +16.9%
- SELL: 11 sig, 7W/3L, 70%, -22.95%, +17.18%
- REDUCE: 4 sig, 2W/0L, 100%, -5.71%, +18.42%

### #479 VELOUSDC
- BUY: 30 sig, 11W/11L, 50%, -12.34%, +32.2%
- SELL: 6 sig, 3W/2L, 60%, -18.83%, +14.24%
- REDUCE: 3 sig, 1W/0L, 100%, -7.61%, +8.01%

### #480 VELVETUSDT.P
- BUY: 6 sig, 2W/4L, 33.3%, -16.9%, +32.59%
- SELL: 2 sig, 1W/1L, 50%, -111.9%, +9.93%
- REDUCE: 1 sig, 0W/0L, 0%, -1.76%, +11.8%

### #481 VETUSDT
- BUY: 115 sig, 22W/44L, 33.3%, -15.11%, +10.2%
- SELL: 60 sig, 21W/16L, 56.8%, -17.26%, +11.49%
- REDUCE: 27 sig, 12W/5L, 70.6%, -10.29%, +15.06%

### #482 VFYUSDT.P
- BUY: 6 sig, 2W/3L, 40%, -19.22%, +13.55%
- SELL: 3 sig, 2W/0L, 100%, -7.96%, +17.49%
- REDUCE: 1 sig, 1W/0L, 100%, -1.51%, +34.81%

### #483 VICUSDT.P
- BUY: 14 sig, 5W/3L, 62.5%, -13.06%, +13.72%
- SELL: 2 sig, 1W/0L, 100%, -7.63%, +15.01%
- REDUCE: 2 sig, 2W/0L, 100%, -2.7%, +44.82%

### #484 VINEUSD
- BUY: 18 sig, 8W/7L, 53.3%, -13.43%, +18.83%
- SELL: 5 sig, 2W/2L, 50%, -109.09%, +21.54%
- REDUCE: 2 sig, 1W/0L, 100%, -17.36%, +10.95%

### #485 VIRTUALUSDT
- BUY: 14 sig, 4W/5L, 44.4%, -12.18%, +13.97%
- SELL: 6 sig, 3W/0L, 100%, -8.38%, +14.27%
- REDUCE: 3 sig, 3W/0L, 100%, -5.11%, +38.83%

### #486 VTHOUSDT
- BUY: 80 sig, 26W/33L, 44.1%, -15.03%, +15.42%
- SELL: 22 sig, 5W/10L, 33.3%, -42.38%, +9.62%
- REDUCE: 10 sig, 3W/2L, 60%, -9.6%, +8.92%

### #487 VVVUSD
- BUY: 13 sig, 4W/7L, 36.4%, -20.69%, +10.96%
- SELL: 8 sig, 4W/3L, 57.1%, -25.71%, +17%
- REDUCE: 3 sig, 2W/1L, 66.7%, -24.75%, +13.67%

### #488 WALUSDT
- BUY: 8 sig, 0W/6L, 0%, -17.75%, +5.48%
- SELL: 1 sig, 0W/1L, 0%, -41.15%, +6.59%
- REDUCE: 0 sig

### #489 WAXPUSDT.P
- BUY: 41 sig, 5W/14L, 26.3%, -13.19%, +9.58%
- SELL: 9 sig, 6W/0L, 100%, -7.44%, +13.99%
- REDUCE: 6 sig, 2W/3L, 40%, -12.3%, +14.56%

### #490 WCTUSDC
- BUY: 7 sig, 2W/2L, 50%, -15.48%, +11.51%
- SELL: 5 sig, 3W/2L, 60%, -22.89%, +28.63%
- REDUCE: 3 sig, 0W/1L, 0%, -14.39%, +7.57%

### #491 WETUSDT.P
- BUY: 6 sig, 0W/4L, 0%, -23.24%, +7.38%
- SELL: 1 sig, 1W/0L, 100%, -5.57%, +30.52%
- REDUCE: 0 sig

### #492 WIFUSDT
- BUY: 25 sig, 11W/9L, 55%, -16.12%, +19.85%
- SELL: 15 sig, 8W/4L, 66.7%, -19.86%, +14.2%
- REDUCE: 10 sig, 8W/2L, 80%, -20.36%, +25.21%

### #493 WLDUSDT
- BUY: 41 sig, 14W/18L, 43.8%, -14.5%, +19.42%
- SELL: 18 sig, 6W/9L, 40%, -32.55%, +10.45%
- REDUCE: 7 sig, 1W/3L, 25%, -26.05%, +8.57%

### #494 WLFIUSDT
- BUY: 7 sig, 3W/1L, 75%, -16.19%, +17.96%
- SELL: 2 sig, 0W/1L, 0%, -15.86%, +6.42%
- REDUCE: 1 sig, 0W/1L, 0%, -25.95%, +2.7%

### #495 WOOUSDT
- BUY: 59 sig, 17W/19L, 47.2%, -13.16%, +15.23%
- SELL: 29 sig, 11W/8L, 57.9%, -15.76%, +15.31%
- REDUCE: 15 sig, 2W/3L, 40%, -15.37%, +8.26%

### #496 WUSDT
- BUY: 36 sig, 10W/19L, 34.5%, -17.38%, +12.8%
- SELL: 12 sig, 3W/7L, 30%, -22.52%, +8.53%
- REDUCE: 5 sig, 3W/0L, 100%, -4.74%, +15.12%

### #497 XAIUSDT
- BUY: 34 sig, 11W/15L, 42.3%, -17.47%, +16.17%
- SELL: 16 sig, 8W/6L, 57.1%, -16.41%, +17.36%
- REDUCE: 7 sig, 4W/1L, 80%, -13.35%, +23.71%

### #498 XANUSD
- BUY: 5 sig, 1W/4L, 20%, -20.32%, +14.87%
- SELL: 1 sig, 1W/0L, 100%, -67.12%, +28.86%
- REDUCE: 1 sig, 0W/0L, 0%, -11.34%, +7.14%

### #499 XAUTUST
- BUY: 36 sig, 0W/0L, 0%, -1.84%, +2.42%
- SELL: 39 sig, 1W/0L, 100%, -2.32%, +2.48%
- REDUCE: 19 sig, 0W/0L, 0%, -2.08%, +1.34%

### #500 XDCUSD
- BUY: 25 sig, 2W/6L, 25%, -10.22%, +6.76%
- SELL: 9 sig, 2W/3L, 40%, -13.91%, +7.28%
- REDUCE: 5 sig, 0W/1L, 0%, -9.02%, +5.04%

### #501 XLMUSDT
- BUY: 115 sig, 23W/25L, 47.9%, -10.12%, +11.27%
- SELL: 59 sig, 15W/13L, 53.6%, -13.97%, +11.05%
- REDUCE: 24 sig, 1W/5L, 16.7%, -18.2%, +7.95%

### #502 XNOUSDT
- BUY: 86 sig, 26W/19L, 57.8%, -11.79%, +15.5%
- SELL: 58 sig, 20W/16L, 55.6%, -15.26%, +11.23%
- REDUCE: 29 sig, 6W/6L, 50%, -12.2%, +11.82%

### #503 XNYUSDT.P
- BUY: 11 sig, 6W/1L, 85.7%, -8.82%, +25.53%
- SELL: 3 sig, 1W/1L, 50%, -32.53%, +18.71%
- REDUCE: 2 sig, 1W/0L, 100%, -38.7%, +25.98%

### #504 XPINUSDT.P
- BUY: 3 sig, 0W/2L, 0%, -30.08%, +6.14%
- SELL: 1 sig, 1W/0L, 100%, -6.34%, +20.39%
- REDUCE: 0 sig

### #505 XPLUSDT
- BUY: 7 sig, 4W/3L, 57.1%, -17.89%, +13.08%
- SELL: 1 sig, 0W/1L, 0%, -40.34%, +2.75%
- REDUCE: 1 sig, 1W/0L, 100%, -3.33%, +48.15%

### #506 XPTUSDT.P
- BUY: 0 sig
- SELL: 1 sig, 1W/0L, 100%, -8.28%, +29.06%
- REDUCE: 0 sig

### #507 XRPUSDT.P
- BUY: 81 sig, 13W/18L, 41.9%, -10.63%, +10.27%
- SELL: 56 sig, 17W/9L, 65.4%, -17.26%, +11.2%
- REDUCE: 24 sig, 8W/4L, 66.7%, -11.78%, +12.42%

### #508 XTZUSD
- BUY: 85 sig, 18W/18L, 50%, -9.8%, +10.99%
- SELL: 47 sig, 20W/12L, 62.5%, -18%, +13.44%
- REDUCE: 22 sig, 8W/3L, 72.7%, -10.43%, +10.86%

### #509 XVSUSDT
- BUY: 54 sig, 14W/13L, 51.9%, -13.29%, +14.44%
- SELL: 40 sig, 17W/12L, 58.6%, -19.38%, +13.77%
- REDUCE: 19 sig, 8W/4L, 66.7%, -19.26%, +11.49%

### #510 YALAUSDT
- BUY: 9 sig, 2W/7L, 22.2%, -18.96%, +12.31%
- SELL: 1 sig, 0W/1L, 0%, -51.81%, +3.97%
- REDUCE: 1 sig, 0W/1L, 0%, -36.4%, +61.65%

### #511 YBUSDT
- BUY: 5 sig, 2W/3L, 40%, -13.91%, +18.01%
- SELL: 1 sig, 0W/1L, 0%, -29.21%, +9.87%
- REDUCE: 1 sig, 0W/0L, 0%, -12.17%, +10.07%

### #512 YFIUSDT
- BUY: 76 sig, 14W/19L, 42.4%, -10.5%, +12.09%
- SELL: 34 sig, 8W/8L, 50%, -12.3%, +12.45%
- REDUCE: 18 sig, 3W/3L, 50%, -9.78%, +12.32%

### #513 YGGUSDT.P
- BUY: 67 sig, 23W/29L, 44.2%, -16.56%, +17.25%
- SELL: 33 sig, 15W/12L, 55.6%, -25.26%, +15.28%
- REDUCE: 14 sig, 9W/5L, 64.3%, -12.88%, +21.77%

### #514 ZAMAUSDT.P
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #515 ZBCNUSDT
- BUY: 30 sig, 16W/7L, 69.6%, -13.18%, +25.47%
- SELL: 18 sig, 14W/3L, 82.4%, -22.77%, +20.22%
- REDUCE: 13 sig, 3W/8L, 27.3%, -32.88%, +11.35%

### #516 ZBTUSDT.P
- BUY: 5 sig, 4W/0L, 100%, -13.81%, +38.65%
- SELL: 0 sig
- REDUCE: 0 sig

### #517 ZENUSDT
- BUY: 82 sig, 26W/27L, 49.1%, -13.37%, +15.94%
- SELL: 44 sig, 17W/9L, 65.4%, -19.65%, +12.62%
- REDUCE: 21 sig, 10W/2L, 83.3%, -9.36%, +15.75%

### #518 ZEREBROUSDT.P
- BUY: 11 sig, 6W/4L, 60%, -17.65%, +46.21%
- SELL: 4 sig, 2W/2L, 50%, -19.78%, +26.79%
- REDUCE: 2 sig, 1W/0L, 100%, -8.64%, +13.21%

### #519 ZETAUSDT.P
- BUY: 32 sig, 6W/14L, 30%, -15.4%, +11.58%
- SELL: 16 sig, 9W/3L, 75%, -14.28%, +16.6%
- REDUCE: 9 sig, 3W/3L, 50%, -18.83%, +12.76%

### #520 ZILUSDT
- BUY: 113 sig, 25W/44L, 36.2%, -13.59%, +11.81%
- SELL: 52 sig, 20W/14L, 58.8%, -30.12%, +12.43%
- REDUCE: 23 sig, 8W/4L, 66.7%, -11.76%, +13.95%

### #521 ZKCUSDT.P
- BUY: 8 sig, 3W/4L, 42.9%, -14.39%, +27.49%
- SELL: 2 sig, 0W/1L, 0%, -22.62%, +21.45%
- REDUCE: 0 sig

### #522 ZKJUSDT.P
- BUY: 8 sig, 1W/3L, 25%, -14.88%, +11.28%
- SELL: 2 sig, 0W/0L, 0%, -7.74%, +9.03%
- REDUCE: 0 sig

### #523 ZKPUSDT.P
- BUY: 2 sig, 0W/1L, 0%, -20.66%, +12.04%
- SELL: 0 sig
- REDUCE: 0 sig

### #524 ZKUSD
- BUY: 21 sig, 8W/7L, 53.3%, -14.3%, +19.61%
- SELL: 10 sig, 4W/2L, 66.7%, -15.67%, +13.14%
- REDUCE: 6 sig, 3W/1L, 75%, -9.91%, +21.77%

### #525 ZORAUSD
- BUY: 8 sig, 3W/3L, 50%, -13.66%, +16.47%
- SELL: 2 sig, 2W/0L, 100%, -10.13%, +26.06%
- REDUCE: 2 sig, 2W/0L, 100%, -34.12%, +26.27%

### #526 ZROUSDT
- BUY: 24 sig, 10W/7L, 58.8%, -10.13%, +17.86%
- SELL: 12 sig, 3W/6L, 33.3%, -29.88%, +8.54%
- REDUCE: 5 sig, 2W/1L, 66.7%, -14.98%, +10.6%

### #527 ZRXUSD
- BUY: 55 sig, 17W/14L, 54.8%, -10.75%, +12.94%
- SELL: 30 sig, 17W/5L, 77.3%, -21.69%, +15.22%
- REDUCE: 17 sig, 5W/2L, 71.4%, -10.01%, +12%

### #528 ZTCUSDT.P
- BUY: 0 sig
- SELL: 0 sig
- REDUCE: 0 sig

### #529 DFUSDT
- BUY: 57 sig, 19W/16L, 54.3%, -12.34%, +22.49%
- SELL: 25 sig, 10W/8L, 55.6%, -19.82%, +14.29%
- REDUCE: 9 sig, 3W/0L, 100%, -6.18%, +10.66%
