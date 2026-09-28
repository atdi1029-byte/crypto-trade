#!/usr/bin/python3
"""DSS-era trade review: is the Aug 15 2026 DSS forecast edge holding up?

Run:  /usr/bin/python3 dss_review.py
Pulls live completed trades + open trades from the dashboard API and BTC
daily closes from Yahoo, compares before-DSS vs DSS-era trades (split by
ENTRY date), prints a report and saves it to reviews/YYYY-MM-DD.txt.

Dollar P&L grows with Pokemon sizing, so the checks lean on ratios
(loss size in wins, profit factor, win rate) that don't depend on size.
"""
import datetime
import json
import os
import urllib.request

API = ('https://script.google.com/macros/s/AKfycbywWcasm7wwI14tUc64Xp'
       'TscePJlgiU3Q7sZ4uY-TmqjqVZzuxJOhf6T8fO2ZpSaKwV/exec')
BTC_URL = ('https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD'
           '?range=1y&interval=1d')

BASELINE_START = '2026-06-04'   # stats window before DSS
DSS_START = '2026-08-15'        # Alex started using DSS forecast
NON_RALLY_BTC = 2.0             # a week with BTC <= +2% counts as "not rallying"
NON_RALLY_MIN_TRADES = 100      # trades needed before the non-rally test counts
STALE_DAYS = 21                 # open trades older than this need checking


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def side(t):
    return 'buy' if t['signal'] == 'buy' else 'short'


def close_key(t):
    return t.get('closedAt') or t['timestamp']


def summarize(trades):
    p = [t['realizedPnl'] or 0 for t in trades]
    w = [x for x in p if x > 0]
    l = [x for x in p if x < 0]
    s = {'n': len(p), 'w': len(w), 'l': len(l), 'net': sum(p)}
    s['wr'] = len(w) / (len(w) + len(l)) * 100 if (w or l) else 0
    s['per'] = sum(p) / len(p) if p else 0
    s['avg_w'] = sum(w) / len(w) if w else 0
    s['avg_l'] = -sum(l) / len(l) if l else 0
    s['loss_in_wins'] = s['avg_l'] / s['avg_w'] if s['avg_w'] else 0
    s['pf'] = sum(w) / -sum(l) if l else float('inf')
    return s


def row(label, trades):
    if not trades:
        return f'{label:<22} {"-":>6}'
    s = summarize(trades)
    return (f'{label:<22} {s["n"]:>6} {s["wr"]:>5.1f}% {s["net"]:>+8.2f} '
            f'{s["per"]:>+8.3f} {s["avg_w"]:>7.3f} {s["avg_l"]:>7.3f} '
            f'{s["loss_in_wins"]:>6.1f}x {s["pf"]:>5.2f}')


def week_of(iso):
    d = datetime.date.fromisoformat(iso[:10])
    return d - datetime.timedelta(days=d.weekday())


def btc_week_change(closes, monday):
    """BTC % change from the close before Monday to the last close of the week."""
    sunday = monday + datetime.timedelta(days=6)
    before = [d for d in closes if d < monday]
    during = [d for d in closes if monday <= d <= sunday]
    if not before or not during:
        return None
    return (closes[max(during)] / closes[max(before)] - 1) * 100


def max_drawdown(trades):
    cum = peak = worst = 0.0
    for t in sorted(trades, key=close_key):
        cum += t['realizedPnl'] or 0
        peak = max(peak, cum)
        worst = max(worst, peak - cum)
    return worst, peak - cum


def main():
    trades = fetch(API + '?action=raw_trades')['trades']
    dash = fetch(API + '?action=dashboard')
    try:
        chart = fetch(BTC_URL)['chart']['result'][0]
        closes = {
            datetime.datetime.utcfromtimestamp(ts).date(): c
            for ts, c in zip(chart['timestamp'],
                             chart['indicators']['quote'][0]['close'])
            if c
        }
    except Exception as e:  # BTC context is nice-to-have, not required
        print(f'(BTC data unavailable: {e})')
        closes = {}

    trades = [t for t in trades if t['timestamp'] >= BASELINE_START]
    pre = [t for t in trades if t['timestamp'] < DSS_START]
    dss = [t for t in trades if t['timestamp'] >= DSS_START]
    dss_closed = sorted(dss, key=close_key)
    last50 = dss_closed[-50:]
    prev50 = dss_closed[-100:-50]

    open_trades = [a for a in dash.get('actionNeeded', [])
                   if a.get('type') == 'mark_outcome']

    # Weekly breakdown of the DSS era
    weeks = {}
    for t in dss:
        weeks.setdefault(week_of(t['timestamp']), []).append(t)
    open_by_week = {}
    for a in open_trades:
        if a['timestamp'][:10] >= DSS_START:
            wk = week_of(a['timestamp'])
            open_by_week[wk] = open_by_week.get(wk, 0) + 1
    week_rows = []
    for wk in sorted(set(weeks) | set(open_by_week)):
        ts = weeks.get(wk, [])
        week_rows.append({
            'week': wk, 'btc': btc_week_change(closes, wk) if closes else None,
            'trades': ts, 'net': sum(t['realizedPnl'] or 0 for t in ts),
            'buys': [t for t in ts if side(t) == 'buy'],
            'shorts': [t for t in ts if side(t) == 'short'],
            'open': open_by_week.get(wk, 0),
        })

    best = max(week_rows, key=lambda r: r['net'])
    without_best = [t for t in dss if week_of(t['timestamp']) != best['week']]
    non_rally = [t for r in week_rows
                 if r['btc'] is not None and r['btc'] <= NON_RALLY_BTC
                 for t in r['trades']]

    out = []
    today = datetime.date.today().isoformat()
    out.append(f'CRYPTO DSS REVIEW  {today}')
    out.append(f'Trades split by entry date. Before DSS = {BASELINE_START} to '
               f'{DSS_START}; DSS era = {DSS_START} on.')
    out.append('"Loss" = how many average wins one average loss costs.')
    out.append('')
    out.append(f'{"":<22} {"trades":>6} {"win%":>6} {"net $":>8} '
               f'{"$/trade":>8} {"avg win":>7} {"avg loss":>7} '
               f'{"loss":>7} {"PF":>5}')
    out.append(row('Before DSS', pre))
    out.append(row('DSS era', dss))
    out.append(row('  buys', [t for t in dss if side(t) == 'buy']))
    out.append(row('  shorts', [t for t in dss if side(t) == 'short']))
    out.append(row('  without best week', without_best))
    out.append(row('  BTC not rallying', non_rally))
    out.append(row('Previous 50 (DSS)', prev50))
    out.append(row('Last 50 (DSS)', last50))
    out.append('')

    out.append('DSS ERA BY WEEK')
    out.append(f'{"week of":<11} {"BTC":>7} {"trades":>6} {"net $":>8} '
               f'{"buys $":>8} {"shorts $":>8} {"still open":>10}')
    for r in week_rows:
        btc = f'{r["btc"]:+.1f}%' if r['btc'] is not None else '-'
        out.append(
            f'{r["week"].isoformat():<11} {btc:>7} {len(r["trades"]):>6} '
            f'{r["net"]:>+8.2f} '
            f'{sum(t["realizedPnl"] or 0 for t in r["buys"]):>+8.2f} '
            f'{sum(t["realizedPnl"] or 0 for t in r["shorts"]):>+8.2f} '
            f'{r["open"] or "":>10}')
    out.append('Weeks with many trades still open are incomplete.')
    out.append('')

    # ---- Checks ----
    checks = []
    pre_s, dss_s = summarize(pre), summarize(dss)

    s = summarize(last50) if last50 else None
    if s and s['l']:
        v = s['loss_in_wins']
        status = 'OK' if v <= 2.0 else ('WARN' if v <= 2.5 else 'BAD')
        checks.append((status, 'Losses stay small',
                       f'Last 50 trades: a loss costs {v:.1f} wins. Before DSS it '
                       f'was {pre_s["loss_in_wins"]:.1f}; DSS era overall '
                       f'{dss_s["loss_in_wins"]:.1f}. This is what DSS fixed; '
                       f'above 2.5 means it is slipping back.'))

    wb = summarize(without_best)
    btc = f', BTC {best["btc"]:+.1f}%' if best['btc'] is not None else ''
    checks.append(('OK' if wb['net'] > 0 else 'BAD', 'Not a one-week wonder',
                   f'Best week ({best["week"]}{btc}) made ${best["net"]:.2f} of '
                   f'${dss_s["net"]:.2f}. Without it: ${wb["net"]:+.2f} over '
                   f'{wb["n"]} trades (${wb["per"]:+.3f}/trade vs '
                   f'${pre_s["per"]:+.3f} before DSS).'))

    nr = summarize(non_rally)
    if nr['n'] < NON_RALLY_MIN_TRADES:
        status = 'TEST'
        verdict = (f'Not tested yet ({nr["n"]} of {NON_RALLY_MIN_TRADES} '
                   f'trades). Running total ${nr["net"]:+.2f}.')
    else:
        status = 'OK' if nr['net'] > 0 else 'BAD'
        verdict = (f'{nr["n"]} trades in weeks BTC rose {NON_RALLY_BTC:.0f}% or '
                   f'less: ${nr["net"]:+.2f}, PF {nr["pf"]:.2f}.')
    checks.append((status, 'Makes money when BTC is not rallying', verdict))

    sh = summarize([t for t in dss if side(t) == 'short'])
    if sh['n'] < 30:
        checks.append(('TEST', 'Shorts pull their weight',
                       f'Only {sh["n"]} DSS-era shorts so far '
                       f'(${sh["net"]:+.2f}).'))
    else:
        checks.append(('OK' if sh['net'] >= 0 else 'WARN',
                       'Shorts pull their weight',
                       f'{sh["n"]} DSS-era shorts: ${sh["net"]:+.2f}, '
                       f'{sh["wr"]:.0f}% win rate, PF {sh["pf"]:.2f}.'))

    if s:
        pf = s['pf']
        status = 'OK' if pf >= 1.2 else ('WARN' if pf >= 1.0 else 'BAD')
        prev = (f' Previous 50: PF {summarize(prev50)["pf"]:.2f}.'
                if prev50 else '')
        # Big-week entries can close weeks later and make a quiet stretch look hot
        old = [t for t in last50 if week_of(t['timestamp']) == best['week']]
        old_note = (f' {len(old)} of them were entered in the best week and '
                    f'made ${sum(t["realizedPnl"] or 0 for t in old):+.2f}.'
                    if old else '')
        checks.append((status, 'Last 50 closed trades profitable',
                       f'PF {pf:.2f}, {s["wr"]:.0f}% win rate, '
                       f'${s["net"]:+.2f}.{old_note}{prev}'))

    worst_dd, cur_dd = max_drawdown(dss)
    status = 'OK' if cur_dd < 0.5 * max(dss_s['net'], 0.01) else 'WARN'
    checks.append((status, 'Drawdown in check',
                   f'Now ${cur_dd:.2f} below the DSS-era peak; worst so far '
                   f'${worst_dd:.2f}. Before DSS the worst was '
                   f'${max_drawdown(pre)[0]:.2f}.'))

    cutoff = (datetime.date.today()
              - datetime.timedelta(days=STALE_DAYS)).isoformat()
    stale = sorted((a['timestamp'][:10], a['symbol']) for a in open_trades
                   if a['timestamp'][:10] < cutoff)
    checks.append(('OK' if not stale else 'WARN', 'Open trades up to date',
                   'No open trades older than 3 weeks.' if not stale else
                   f'{len(stale)} open trades entered over {STALE_DAYS} days '
                   f'ago: ' + ', '.join(f'{sym} ({d[5:]})' for d, sym in stale)
                   + '. If any were stopped out, mark them or the stats '
                   'flatter you ("Not on BX" filter).'))

    out.append('CHECKS')
    for status, name, detail in checks:
        out.append(f'[{status:<4}] {name}')
        out.append(f'       {detail}')
    bad = sum(1 for c in checks if c[0] == 'BAD')
    warn = sum(1 for c in checks if c[0] == 'WARN')
    untested = sum(1 for c in checks if c[0] == 'TEST')
    if bad:
        verdict = 'Look closer before sizing up.'
    elif untested:
        verdict = 'Holding so far, but not proven until the TEST items pass.'
    else:
        verdict = 'DSS edge holding.'
    out.append('')
    out.append(f'VERDICT: {bad} bad, {warn} warnings, {untested} untested. '
               + verdict)

    report = '\n'.join(out)
    print(report)
    here = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(here, 'reviews'), exist_ok=True)
    path = os.path.join(here, 'reviews', f'{today}.txt')
    with open(path, 'w') as f:
        f.write(report + '\n')
    print(f'\nSaved {path}')


if __name__ == '__main__':
    main()
