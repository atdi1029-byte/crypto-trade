// ============================================================
// Crypto Trading Dashboard — Google Apps Script
// Receives TradingView webhook JSON, auto-scores signals,
// logs to Google Sheets, and provides a JSON dashboard API.
// ============================================================

// === SHEET NAME CONSTANTS ===
var SIGNAL_LOG  = 'Signal Log';
var POSITIONS   = 'Positions';
var DASHBOARD   = 'Dashboard';
var CONFIG      = 'Config';
var PERFORMANCE = 'Performance';

// === SCORING WEIGHTS ===
// MACD rising/falling: +2, cross <= 5 bars ago: +2, in_zone: +1, volume above avg: +1
// Max auto-score = 6. A 7th point (open slots available) is calculated dashboard-side.
var SCORE_MACD       = 2;
var SCORE_CROSS      = 2;
var SCORE_IN_ZONE    = 1;
var SCORE_VOLUME     = 1;
var MAX_AUTO_SCORE   = 6;

// ---------------------------------------------------------------
// doPost — Webhook receiver + position update handler
// TradingView sends JSON like:
//   {"signal":"buy","symbol":"BTCUSDT","entry":42500,"sl":41800,
//    "tp1":43500,"tp2":44500,"macd":"rising","volume":"above",
//    "cross":3,"in_zone":true,"rsi":38.5,"timeframe":"4h"}
// ---------------------------------------------------------------
function doPost(e) {
  try {
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var raw  = e.postData.contents;
    var data = JSON.parse(raw);

    // --- Position update actions ---
    if (data.action === 'update_position') {
      return updatePosition_(ss, data);
    }

    // --- Claude analysis push ---
    if (data.action === 'claude_analysis') {
      return saveClaudeAnalysis_(ss, data);
    }

    // --- Normal webhook flow ---
    var timestamp = new Date();
    var symbol    = (data.symbol || '').toUpperCase();
    var signal    = (data.signal || '').toLowerCase();   // buy / short
    var entry     = data.entry || '';
    var sl        = data.sl || '';
    var tp1       = data.tp1 || '';
    var tp2       = data.tp2 || '';
    var macd      = (data.macd || '').toLowerCase();     // rising / falling
    var volume    = (data.volume || '').toLowerCase();    // above / below
    var cross     = data.cross;                          // number of bars since cross
    var inZone    = data.in_zone;                        // true / false
    var rsi       = data.rsi || '';
    var timeframe = data.timeframe || '';

    // --- Auto-score the signal ---
    var score = calcSignalScore_(macd, cross, inZone, volume);

    // --- Signal Log (raw backup, never edit) ---
    var logSheet = ss.getSheetByName(SIGNAL_LOG);
    logSheet.appendRow([
      timestamp, symbol, signal, entry, sl, tp1, tp2,
      macd, volume, cross, inZone, rsi, timeframe, score, raw
    ]);

    // --- Positions (user marks outcomes here) ---
    var posSheet = ss.getSheetByName(POSITIONS);
    posSheet.appendRow([
      timestamp, symbol, signal, entry, sl, tp1, tp2, score,
      '',  // Action — user fills: Entered / Skipped
      '',  // Outcome — user fills: Won / Lost / Open
      ''   // Realized P&L
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        symbol: symbol,
        signal: signal,
        score: score
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------------
// calcSignalScore_ — Auto-score an incoming signal (max 6)
// MACD rising/falling: +2, cross <= 5: +2, in_zone: +1, volume above: +1
// ---------------------------------------------------------------
function calcSignalScore_(macd, cross, inZone, volume) {
  var score = 0;

  // MACD confirmation: +2 if rising (for buy) or falling (for short)
  // We award points if MACD has a directional value at all
  if (macd === 'rising' || macd === 'falling') {
    score += SCORE_MACD;
  }

  // Cross recency: +2 if the cross happened within 5 bars
  if (cross !== undefined && cross !== null && cross !== '' && Number(cross) <= 5) {
    score += SCORE_CROSS;
  }

  // In zone (price in value zone / key level): +1
  if (inZone === true || inZone === 'true' || inZone === 1) {
    score += SCORE_IN_ZONE;
  }

  // Volume above average: +1
  if (volume === 'above') {
    score += SCORE_VOLUME;
  }

  return Math.min(score, MAX_AUTO_SCORE);
}

// ---------------------------------------------------------------
// updatePosition_ — Mark action (Entered/Skipped) or outcome
// (Won/Lost) on a Positions row from the dashboard.
// Payload: { action: "update_position", symbol, signal, entry,
//            field: "action"|"outcome", value: "Entered"|...,
//            realized_pnl: 25.50 }
// ---------------------------------------------------------------
function updatePosition_(ss, data) {
  var symbol = (data.symbol || data.ticker || '').toUpperCase();
  var signal = (data.signal || '').toLowerCase();
  var entry  = data.entry || data.price || '';
  var field  = (data.field || '').toLowerCase();   // 'action' or 'outcome'
  var value  = data.value || '';                    // 'Entered','Skipped','Won','Lost','Open'
  var realizedPnl = data.realized_pnl || data.realizedPnl || '';

  var posSheet = ss.getSheetByName(POSITIONS);
  var posData  = posSheet.getDataRange().getValues();

  // Find the most recent matching row (walk backwards)
  var matchRow = -1;
  for (var i = posData.length - 1; i >= 1; i--) {
    var rowSymbol = String(posData[i][1]).toUpperCase();
    var rowSignal = String(posData[i][2]).toLowerCase();
    var rowEntry  = String(posData[i][3]);

    if (rowSymbol === symbol && rowSignal === signal && rowEntry === String(entry)) {
      matchRow = i + 1; // 1-indexed for Sheets
      break;
    }
  }

  if (matchRow === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'No matching row found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Positions columns: A=timestamp, B=symbol, C=signal, D=entry, E=sl, F=tp1, G=tp2,
  //                     H=score, I=action, J=outcome, K=realized_pnl
  if (field === 'action') {
    posSheet.getRange(matchRow, 9).setValue(value);   // Column I = Action
  } else if (field === 'outcome') {
    posSheet.getRange(matchRow, 10).setValue(value);  // Column J = Outcome
    if (realizedPnl !== '') {
      posSheet.getRange(matchRow, 11).setValue(Number(realizedPnl)); // Column K
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', updated: field, value: value, row: matchRow }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// saveClaudeAnalysis_ — Receives Claude Code's analysis of alerts
// Stores picks in a "Claude Picks" tab with full analysis text.
// Payload: { action: "claude_analysis", picks: [
//   { symbol, signal, entry, sl, tp1, tp2, score, rr, analysis, recommendation }
// ]}
// ---------------------------------------------------------------
function saveClaudeAnalysis_(ss, data) {
  var picks = data.picks || [];
  if (picks.length === 0) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'No picks to save' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Get or create Claude Picks tab
  var pickSheet = ss.getSheetByName('Claude Picks');
  if (!pickSheet) {
    pickSheet = ss.insertSheet('Claude Picks');
    pickSheet.appendRow([
      'Timestamp', 'Symbol', 'Signal', 'Entry', 'SL', 'TP1', 'TP2',
      'Score', 'R:R', 'Analysis', 'Recommendation', 'Status'
    ]);
    pickSheet.getRange(1, 1, 1, 12).setFontWeight('bold');
    pickSheet.setFrozenRows(1);
  }

  var timestamp = new Date();
  var saved = 0;

  for (var i = 0; i < picks.length; i++) {
    var p = picks[i];
    pickSheet.appendRow([
      timestamp,
      (p.symbol || '').toUpperCase(),
      (p.signal || '').toLowerCase(),
      p.entry || '',
      p.sl || '',
      p.tp1 || '',
      p.tp2 || '',
      p.score || 0,
      p.rr || '',
      p.analysis || '',
      p.recommendation || '',
      'new'  // Status: new → entered → won/lost
    ]);
    saved++;
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', saved: saved }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// doGet — Health check + Dashboard JSON API
// ?action=dashboard returns full dashboard data
// ---------------------------------------------------------------
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'dashboard') {
    return serveDashboardJSON_();
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Crypto Trade Tracker webhook is live',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// serveDashboardJSON_ — Builds JSON payload for the web dashboard
// Returns: { tickers, recentSignals, topPicks, actionNeeded, stats }
// ---------------------------------------------------------------
function serveDashboardJSON_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Load all tabs ---
  var posSheet = ss.getSheetByName(POSITIONS);
  var posData  = posSheet ? posSheet.getDataRange().getValues() : [];
  var logSheet = ss.getSheetByName(SIGNAL_LOG);
  var logData  = logSheet ? logSheet.getDataRange().getValues() : [];
  var maxPositions = Number(getConfig_('max_positions')) || 3;

  // --- Build per-ticker stats from Positions tab ---
  // Positions columns: 0=timestamp, 1=symbol, 2=signal, 3=entry, 4=sl, 5=tp1, 6=tp2,
  //                     7=score, 8=action, 9=outcome, 10=realized_pnl
  var tickerMap = {};
  for (var i = 1; i < posData.length; i++) {
    var sym = String(posData[i][1]).toUpperCase().trim();
    if (!sym) continue;

    if (!tickerMap[sym]) {
      tickerMap[sym] = {
        ticker: sym,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        totalPnl: 0,
        lastSignal: '',
        lastSignalTime: '',
        lastEntry: 0,
        lastScore: 0,
        openPositions: 0,
        avgScore: { sum: 0, count: 0 }
      };
    }

    var action  = String(posData[i][8]).toLowerCase().trim();
    var outcome = String(posData[i][9]).toLowerCase().trim();
    var score   = posData[i][7] || 0;
    var pnl     = posData[i][10] || 0;

    // Track last signal regardless of action
    tickerMap[sym].lastSignal = String(posData[i][2]).toLowerCase();
    tickerMap[sym].lastEntry  = posData[i][3] || 0;
    tickerMap[sym].lastScore  = score;

    var ts = posData[i][0];
    if (ts instanceof Date) {
      tickerMap[sym].lastSignalTime = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    } else {
      tickerMap[sym].lastSignalTime = String(ts);
    }

    // Score tracking for averages
    if (score) {
      tickerMap[sym].avgScore.sum += Number(score);
      tickerMap[sym].avgScore.count++;
    }

    if (action === 'entered') {
      if (outcome === 'won') {
        tickerMap[sym].totalTrades++;
        tickerMap[sym].wins++;
        tickerMap[sym].totalPnl += Number(pnl) || 0;
      } else if (outcome === 'lost') {
        tickerMap[sym].totalTrades++;
        tickerMap[sym].losses++;
        tickerMap[sym].totalPnl += Number(pnl) || 0; // pnl should be negative for losses
      } else if (outcome === 'open' || outcome === '') {
        tickerMap[sym].openPositions++;
      }
    }
  }

  // Build tickers array
  var tickers = [];
  for (var sym in tickerMap) {
    var t = tickerMap[sym];
    var winRate = t.totalTrades > 0 ? (t.wins / t.totalTrades * 100).toFixed(1) : '0.0';
    var avgRR = t.avgScore.count > 0 ? (t.avgScore.sum / t.avgScore.count).toFixed(1) : '0.0';
    tickers.push({
      ticker:       t.ticker,
      winRate:      winRate + '%',
      totalTrades:  t.totalTrades,
      wins:         t.wins,
      losses:       t.losses,
      totalPnl:     t.totalPnl,
      lastSignal:   t.lastSignal,
      lastSignalTime: t.lastSignalTime,
      lastEntry:    t.lastEntry,
      lastScore:    t.lastScore,
      openPositions: t.openPositions,
      avgScore:     avgRR
    });
  }

  // Sort by win rate descending
  tickers.sort(function(a, b) {
    return parseFloat(b.winRate) - parseFloat(a.winRate);
  });

  // --- Recent signals (last 20 from Signal Log) ---
  var recentSignals = [];
  var startIdx = Math.max(1, logData.length - 20);
  for (var j = logData.length - 1; j >= startIdx; j--) {
    var lr = logData[j];
    var ts = lr[0];
    var tsStr = '';
    if (ts instanceof Date) {
      tsStr = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    } else {
      tsStr = String(ts);
    }
    recentSignals.push({
      timestamp: tsStr,
      symbol:    String(lr[1] || '').toUpperCase(),
      signal:    String(lr[2] || '').toLowerCase(),
      entry:     lr[3] || 0,
      sl:        lr[4] || 0,
      tp1:       lr[5] || 0,
      tp2:       lr[6] || 0,
      macd:      String(lr[7] || ''),
      volume:    String(lr[8] || ''),
      cross:     lr[9],
      inZone:    lr[10],
      rsi:       lr[11] || null,
      timeframe: String(lr[12] || ''),
      score:     lr[13] || 0
    });
  }

  // --- Top picks (score >= 5) from recent signals, deduplicated by symbol ---
  var topPicks = [];
  var seenSymbols = {};
  for (var tp = 0; tp < recentSignals.length; tp++) {
    var sig = recentSignals[tp];
    if (sig.score >= 5 && !seenSymbols[sig.symbol]) {
      // Check if there's still an open slot (not already at max positions for this symbol)
      var symData = tickerMap[sig.symbol];
      var openSlots = maxPositions - (symData ? symData.openPositions : 0);
      topPicks.push({
        symbol:    sig.symbol,
        signal:    sig.signal,
        entry:     sig.entry,
        sl:        sig.sl,
        tp1:       sig.tp1,
        tp2:       sig.tp2,
        score:     sig.score,
        slotsOpen: openSlots > 0,
        finalScore: openSlots > 0 ? Math.min(sig.score + 1, 7) : sig.score, // +1 if slots available
        timestamp: sig.timestamp,
        timeframe: sig.timeframe
      });
      seenSymbols[sig.symbol] = true;
    }
  }

  // --- Action needed (positions needing user input) ---
  var actionNeeded = [];
  for (var k = 1; k < posData.length; k++) {
    var pr = posData[k];
    var pSymbol  = String(pr[1] || '').toUpperCase().trim();
    var pSignal  = String(pr[2] || '').toLowerCase();
    var pAction  = String(pr[8] || '').trim();
    var pOutcome = String(pr[9] || '').trim();

    if (!pSymbol) continue;

    if (pAction === '') {
      // Needs Entered/Skipped
      var pts = pr[0];
      var ptsStr = '';
      if (pts instanceof Date) {
        ptsStr = Utilities.formatDate(pts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
      } else {
        ptsStr = String(pts);
      }
      actionNeeded.push({
        symbol:    pSymbol,
        signal:    pSignal,
        entry:     pr[3] || 0,
        score:     pr[7] || 0,
        timestamp: ptsStr,
        type:      'mark_action',
        message:   'Mark ' + pSignal.toUpperCase() + ' @ ' + pr[3] + ' as Entered/Skipped (score: ' + (pr[7] || 0) + ')'
      });
    } else if (pAction.toLowerCase() === 'entered' && (pOutcome === '' || pOutcome.toLowerCase() === 'open')) {
      actionNeeded.push({
        symbol:    pSymbol,
        signal:    pSignal,
        entry:     pr[3] || 0,
        score:     pr[7] || 0,
        timestamp: '',
        type:      'mark_outcome',
        message:   'Mark outcome for ' + pSymbol + ' ' + pSignal.toUpperCase() + ' @ ' + pr[3]
      });
    }
  }

  // --- Overall stats ---
  var trades = getAllCompletedTrades_();
  var wins   = trades.filter(function(t) { return t.win; });
  var losses = trades.filter(function(t) { return !t.win; });
  var totalPnl = 0;
  trades.forEach(function(t) { totalPnl += t.realizedPnl; });
  var winRate = trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : '0.0';
  var streaks = trades.length > 0 ? calcStreaks_(trades) : { bestWin: 0, worstLoss: 0, current: 0 };

  // Today's signals count
  var today = new Date();
  var todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var todaySignals = 0;
  for (var m = 1; m < logData.length; m++) {
    var logTs = logData[m][0];
    if (logTs instanceof Date) {
      var logDay = Utilities.formatDate(logTs, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      if (logDay === todayStr) todaySignals++;
    }
  }

  // Count total open positions
  var totalOpen = 0;
  for (var ot in tickerMap) {
    totalOpen += tickerMap[ot].openPositions;
  }

  // Average score of winning vs losing trades
  var avgWinScore = 0, avgLossScore = 0;
  if (wins.length > 0) {
    var winScoreSum = 0;
    wins.forEach(function(t) { winScoreSum += t.score; });
    avgWinScore = (winScoreSum / wins.length).toFixed(1);
  }
  if (losses.length > 0) {
    var lossScoreSum = 0;
    losses.forEach(function(t) { lossScoreSum += t.score; });
    avgLossScore = (lossScoreSum / losses.length).toFixed(1);
  }

  // Best / worst tickers
  var bestTicker = '', worstTicker = '', bestWR = -1, worstWR = 101;
  var tickerPerf = {};
  trades.forEach(function(t) {
    if (!tickerPerf[t.ticker]) tickerPerf[t.ticker] = { wins: 0, total: 0 };
    tickerPerf[t.ticker].total++;
    if (t.win) tickerPerf[t.ticker].wins++;
  });
  for (var tp2 in tickerPerf) {
    var wr = tickerPerf[tp2].wins / tickerPerf[tp2].total * 100;
    if (wr > bestWR)  { bestWR = wr; bestTicker = tp2; }
    if (wr < worstWR) { worstWR = wr; worstTicker = tp2; }
  }

  var stats = {
    totalTrades:     trades.length,
    wins:            wins.length,
    losses:          losses.length,
    winRate:         winRate + '%',
    netPnl:          totalPnl.toFixed(2),
    openPositions:   totalOpen,
    maxPositions:    maxPositions,
    slotsAvailable:  maxPositions - totalOpen,
    todaySignals:    todaySignals,
    bestWinStreak:   streaks.bestWin,
    worstLossStreak: streaks.worstLoss,
    currentStreak:   streaks.current > 0 ? streaks.current + 'W' : (streaks.current < 0 ? Math.abs(streaks.current) + 'L' : '0'),
    avgWinScore:     avgWinScore,
    avgLossScore:    avgLossScore,
    bestTicker:      bestTicker ? bestTicker + ' (' + bestWR.toFixed(0) + '%)' : 'N/A',
    worstTicker:     worstTicker ? worstTicker + ' (' + worstWR.toFixed(0) + '%)' : 'N/A'
  };

  // --- Claude Picks (from Claude Code analysis) ---
  var claudePicks = [];
  var cpSheet = ss.getSheetByName('Claude Picks');
  if (cpSheet) {
    var cpData = cpSheet.getDataRange().getValues();
    // Columns: 0=timestamp, 1=symbol, 2=signal, 3=entry, 4=sl, 5=tp1, 6=tp2,
    //          7=score, 8=rr, 9=analysis, 10=recommendation, 11=status
    // Show last 10, newest first
    var cpStart = Math.max(1, cpData.length - 10);
    for (var cp = cpData.length - 1; cp >= cpStart; cp--) {
      var cpr = cpData[cp];
      var cpTs = cpr[0];
      var cpTsStr = '';
      if (cpTs instanceof Date) {
        cpTsStr = Utilities.formatDate(cpTs, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
      } else {
        cpTsStr = String(cpTs);
      }
      claudePicks.push({
        timestamp:      cpTsStr,
        symbol:         String(cpr[1] || '').toUpperCase(),
        signal:         String(cpr[2] || '').toLowerCase(),
        entry:          cpr[3] || 0,
        sl:             cpr[4] || 0,
        tp1:            cpr[5] || 0,
        tp2:            cpr[6] || 0,
        score:          cpr[7] || 0,
        rr:             cpr[8] || '',
        analysis:       String(cpr[9] || ''),
        recommendation: String(cpr[10] || ''),
        status:         String(cpr[11] || 'new')
      });
    }
  }

  var payload = {
    status:        'ok',
    timestamp:     new Date().toISOString(),
    tickers:       tickers,
    recentSignals: recentSignals,
    topPicks:      topPicks,
    claudePicks:   claudePicks,
    actionNeeded:  actionNeeded,
    stats:         stats
  };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// Helper: get config value by label
// Config tab layout: Column A = label, Column B = value
// ---------------------------------------------------------------
function getConfig_(label) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG);
  var data  = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === label.toLowerCase()) return data[i][1];
  }
  return null;
}

// ---------------------------------------------------------------
// Helper: get ALL completed trades across all symbols
// Returns array of enriched trade objects
// ---------------------------------------------------------------
function getAllCompletedTrades_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Load Signal Log for cross-referencing extra fields
  var logSheet = ss.getSheetByName(SIGNAL_LOG);
  var logData  = logSheet.getDataRange().getValues();
  // Build lookup: key = "SYMBOL|signal|entry" -> {macd, volume, cross, inZone, rsi, timeframe}
  var logLookup = {};
  for (var i = 1; i < logData.length; i++) {
    var key = String(logData[i][1]).toUpperCase() + '|' +
              String(logData[i][2]).toLowerCase() + '|' +
              String(logData[i][3]);
    if (!logLookup[key]) logLookup[key] = [];
    logLookup[key].push({
      timestamp: logData[i][0],
      macd:      logData[i][7],
      volume:    logData[i][8],
      cross:     logData[i][9],
      inZone:    logData[i][10],
      rsi:       logData[i][11],
      timeframe: logData[i][12]
    });
  }

  // Load Positions
  // Columns: 0=timestamp, 1=symbol, 2=signal, 3=entry, 4=sl, 5=tp1, 6=tp2,
  //          7=score, 8=action, 9=outcome, 10=realized_pnl
  var posSheet = ss.getSheetByName(POSITIONS);
  var posData  = posSheet.getDataRange().getValues();
  var trades = [];

  for (var j = 1; j < posData.length; j++) {
    var action  = String(posData[j][8]).toLowerCase().trim();
    var outcome = String(posData[j][9]).toLowerCase().trim();

    // Only include entered trades with a resolved outcome
    if (action !== 'entered') continue;
    if (outcome !== 'won' && outcome !== 'lost') continue;

    var symbol = String(posData[j][1]).toUpperCase();
    var signal = String(posData[j][2]).toLowerCase();
    var entry  = posData[j][3];
    var sl     = posData[j][4];
    var tp1    = posData[j][5];
    var tp2    = posData[j][6];
    var score  = posData[j][7] || 0;
    var pnl    = posData[j][10] || 0;

    // Cross-reference Signal Log for extra fields
    var lookupKey = symbol + '|' + signal + '|' + String(entry);
    var rsi = '';
    var timeframe = '';
    var macd = '';
    if (logLookup[lookupKey] && logLookup[lookupKey].length > 0) {
      var match = logLookup[lookupKey][0];
      rsi = match.rsi;
      timeframe = match.timeframe;
      macd = match.macd;
      logLookup[lookupKey].shift(); // consume match
    }

    trades.push({
      timestamp:   posData[j][0],
      ticker:      symbol,
      signal:      signal,
      entry:       entry,
      sl:          sl,
      tp1:         tp1,
      tp2:         tp2,
      score:       Number(score),
      outcome:     outcome,
      win:         outcome === 'won',
      realizedPnl: pnl ? Number(pnl) : 0,
      rsi:         rsi !== '' ? Number(rsi) : null,
      timeframe:   timeframe || 'unknown',
      macd:        macd || ''
    });
  }

  return trades;
}

// ---------------------------------------------------------------
// Helper: calculate streaks for a sorted array of trades
// Returns { bestWin, worstLoss, current }
// ---------------------------------------------------------------
function calcStreaks_(trades) {
  var bestWin = 0, worstLoss = 0;
  var runWin = 0, runLoss = 0;
  for (var i = 0; i < trades.length; i++) {
    if (trades[i].win) {
      runWin++;
      runLoss = 0;
      if (runWin > bestWin) bestWin = runWin;
    } else {
      runLoss++;
      runWin = 0;
      if (runLoss > worstLoss) worstLoss = runLoss;
    }
  }
  // Current streak (from end)
  var current = 0;
  if (trades.length > 0) {
    var lastWin = trades[trades.length - 1].win;
    for (var k = trades.length - 1; k >= 0; k--) {
      if (trades[k].win === lastWin) current++;
      else break;
    }
    if (!lastWin) current = -current; // negative = loss streak
  }
  return { bestWin: bestWin, worstLoss: worstLoss, current: current };
}

// ---------------------------------------------------------------
// buildPerformanceReport()
// Rebuilds the Performance tab from scratch with full analytics.
// Call from menu: Trading Tools -> Refresh Performance
// ---------------------------------------------------------------
function buildPerformanceReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PERFORMANCE) || ss.insertSheet(PERFORMANCE);
  sheet.clearContents();

  var trades = getAllCompletedTrades_();

  if (trades.length === 0) {
    sheet.getRange('A1').setValue('No completed trades yet. Mark outcomes in Positions tab first.');
    sheet.getRange('A1').setFontWeight('bold');
    return;
  }

  var row = 1;

  // ========== SECTION 1: OVERALL SUMMARY ==========
  var wins   = trades.filter(function(t) { return t.win; });
  var losses = trades.filter(function(t) { return !t.win; });
  var totalPnl = 0;
  trades.forEach(function(t) { totalPnl += t.realizedPnl; });
  var streaks = calcStreaks_(trades);
  var winRate = (wins.length / trades.length * 100).toFixed(1);

  // Average scores
  var avgWinScore = 0, avgLossScore = 0;
  if (wins.length > 0) {
    var ws = 0; wins.forEach(function(t) { ws += t.score; });
    avgWinScore = (ws / wins.length).toFixed(1);
  }
  if (losses.length > 0) {
    var ls = 0; losses.forEach(function(t) { ls += t.score; });
    avgLossScore = (ls / losses.length).toFixed(1);
  }

  sheet.getRange(row, 1).setValue('OVERALL PERFORMANCE');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var summaryData = [
    ['Total Trades',        trades.length],
    ['Wins',                wins.length],
    ['Losses',              losses.length],
    ['Win Rate',            winRate + '%'],
    ['Net P&L',             '$' + totalPnl.toFixed(2)],
    ['Best Win Streak',     streaks.bestWin],
    ['Worst Loss Streak',   streaks.worstLoss],
    ['Current Streak',      streaks.current > 0 ? streaks.current + 'W' : Math.abs(streaks.current) + 'L'],
    ['Avg Score (Wins)',    avgWinScore],
    ['Avg Score (Losses)',  avgLossScore]
  ];
  sheet.getRange(row, 1, summaryData.length, 2).setValues(summaryData);
  sheet.getRange(row, 1, summaryData.length, 1).setFontWeight('bold');
  row += summaryData.length + 2;

  // ========== SECTION 2: BY TICKER ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY TICKER');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var tickerHeader = ['Ticker', 'Trades', 'Wins', 'Losses', 'Win %', 'Net P&L', 'Avg Score', 'Best W', 'Worst L'];
  sheet.getRange(row, 1, 1, tickerHeader.length).setValues([tickerHeader]);
  sheet.getRange(row, 1, 1, tickerHeader.length).setFontWeight('bold');
  row++;

  var tickerGroups = {};
  trades.forEach(function(t) {
    if (!tickerGroups[t.ticker]) tickerGroups[t.ticker] = [];
    tickerGroups[t.ticker].push(t);
  });

  var tickerNames = Object.keys(tickerGroups).sort(function(a, b) {
    var wrA = tickerGroups[a].filter(function(t) { return t.win; }).length / tickerGroups[a].length;
    var wrB = tickerGroups[b].filter(function(t) { return t.win; }).length / tickerGroups[b].length;
    return wrB - wrA;
  });

  var tickerRows = [];
  tickerNames.forEach(function(name) {
    var tt = tickerGroups[name];
    var tw = tt.filter(function(t) { return t.win; });
    var tl = tt.filter(function(t) { return !t.win; });
    var pnl = 0;
    tt.forEach(function(t) { pnl += t.realizedPnl; });
    var scoreSum = 0;
    tt.forEach(function(t) { scoreSum += t.score; });
    var ts = calcStreaks_(tt);
    tickerRows.push([
      name,
      tt.length,
      tw.length,
      tl.length,
      (tw.length / tt.length * 100).toFixed(0) + '%',
      '$' + pnl.toFixed(2),
      (scoreSum / tt.length).toFixed(1),
      ts.bestWin,
      ts.worstLoss
    ]);
  });
  if (tickerRows.length > 0) {
    sheet.getRange(row, 1, tickerRows.length, tickerHeader.length).setValues(tickerRows);
    row += tickerRows.length;
  }
  row += 2;

  // ========== SECTION 3: BY SIGNAL TYPE ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY SIGNAL TYPE');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var sigHeader = ['Signal', 'Trades', 'Wins', 'Losses', 'Win %', 'Avg Score'];
  sheet.getRange(row, 1, 1, sigHeader.length).setValues([sigHeader]);
  sheet.getRange(row, 1, 1, sigHeader.length).setFontWeight('bold');
  row++;

  var signalGroups = {};
  trades.forEach(function(t) {
    if (!signalGroups[t.signal]) signalGroups[t.signal] = [];
    signalGroups[t.signal].push(t);
  });

  var sigRows = [];
  ['buy', 'short'].forEach(function(sig) {
    var st = signalGroups[sig] || [];
    if (st.length === 0) return;
    var sw = st.filter(function(t) { return t.win; });
    var scoreSum = 0;
    st.forEach(function(t) { scoreSum += t.score; });
    sigRows.push([
      sig.toUpperCase(),
      st.length,
      sw.length,
      st.length - sw.length,
      (sw.length / st.length * 100).toFixed(0) + '%',
      (scoreSum / st.length).toFixed(1)
    ]);
  });
  if (sigRows.length > 0) {
    sheet.getRange(row, 1, sigRows.length, sigHeader.length).setValues(sigRows);
    row += sigRows.length;
  }
  row += 2;

  // ========== SECTION 4: BY SCORE RANGE ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY SIGNAL SCORE');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var scoreHeader = ['Score', 'Trades', 'Wins', 'Losses', 'Win %'];
  sheet.getRange(row, 1, 1, scoreHeader.length).setValues([scoreHeader]);
  sheet.getRange(row, 1, 1, scoreHeader.length).setFontWeight('bold');
  row++;

  var scoreBuckets = {};
  trades.forEach(function(t) {
    var s = String(t.score);
    if (!scoreBuckets[s]) scoreBuckets[s] = [];
    scoreBuckets[s].push(t);
  });

  var scoreKeys = Object.keys(scoreBuckets).sort(function(a, b) { return Number(b) - Number(a); });
  var scoreRows = [];
  scoreKeys.forEach(function(s) {
    var st = scoreBuckets[s];
    var sw = st.filter(function(t) { return t.win; });
    scoreRows.push([
      s + '/6',
      st.length,
      sw.length,
      st.length - sw.length,
      (sw.length / st.length * 100).toFixed(0) + '%'
    ]);
  });
  if (scoreRows.length > 0) {
    sheet.getRange(row, 1, scoreRows.length, scoreHeader.length).setValues(scoreRows);
    row += scoreRows.length;
  }
  row += 2;

  // ========== SECTION 5: BY RSI RANGE ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY RSI AT ENTRY');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var rsiHeader = ['RSI Range', 'Trades', 'Wins', 'Losses', 'Win %'];
  sheet.getRange(row, 1, 1, rsiHeader.length).setValues([rsiHeader]);
  sheet.getRange(row, 1, 1, rsiHeader.length).setFontWeight('bold');
  row++;

  var rsiBuckets = {
    '10-20': [], '20-30': [], '30-40': [], '40-50': [],
    '50-60': [], '60-70': [], '70-80': [], '80-90': []
  };
  trades.forEach(function(t) {
    if (t.rsi === null) return;
    var r = t.rsi;
    if (r >= 10 && r < 20)      rsiBuckets['10-20'].push(t);
    else if (r >= 20 && r < 30) rsiBuckets['20-30'].push(t);
    else if (r >= 30 && r < 40) rsiBuckets['30-40'].push(t);
    else if (r >= 40 && r < 50) rsiBuckets['40-50'].push(t);
    else if (r >= 50 && r < 60) rsiBuckets['50-60'].push(t);
    else if (r >= 60 && r < 70) rsiBuckets['60-70'].push(t);
    else if (r >= 70 && r < 80) rsiBuckets['70-80'].push(t);
    else if (r >= 80 && r < 90) rsiBuckets['80-90'].push(t);
  });

  var rsiRows = [];
  ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90'].forEach(function(range) {
    var rt = rsiBuckets[range];
    if (rt.length === 0) return;
    var rw = rt.filter(function(t) { return t.win; });
    rsiRows.push([
      range,
      rt.length,
      rw.length,
      rt.length - rw.length,
      (rw.length / rt.length * 100).toFixed(0) + '%'
    ]);
  });
  if (rsiRows.length > 0) {
    sheet.getRange(row, 1, rsiRows.length, rsiHeader.length).setValues(rsiRows);
    row += rsiRows.length;
  }
  row += 2;

  // ========== SECTION 6: BY TIMEFRAME ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY TIMEFRAME');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var tfHeader = ['Timeframe', 'Trades', 'Wins', 'Losses', 'Win %', 'Avg Score'];
  sheet.getRange(row, 1, 1, tfHeader.length).setValues([tfHeader]);
  sheet.getRange(row, 1, 1, tfHeader.length).setFontWeight('bold');
  row++;

  var timeframes = {};
  trades.forEach(function(t) {
    var tf = t.timeframe || 'unknown';
    if (!timeframes[tf]) timeframes[tf] = [];
    timeframes[tf].push(t);
  });

  var tfRows = [];
  Object.keys(timeframes).sort().forEach(function(tf) {
    var ft = timeframes[tf];
    var fw = ft.filter(function(t) { return t.win; });
    var scoreSum = 0;
    ft.forEach(function(t) { scoreSum += t.score; });
    tfRows.push([
      tf,
      ft.length,
      fw.length,
      ft.length - fw.length,
      (fw.length / ft.length * 100).toFixed(0) + '%',
      (scoreSum / ft.length).toFixed(1)
    ]);
  });
  if (tfRows.length > 0) {
    sheet.getRange(row, 1, tfRows.length, tfHeader.length).setValues(tfRows);
    row += tfRows.length;
  }
  row += 2;

  // ========== SECTION 7: BY MACD DIRECTION ==========
  sheet.getRange(row, 1).setValue('PERFORMANCE BY MACD DIRECTION');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var macdHeader = ['MACD', 'Trades', 'Wins', 'Losses', 'Win %'];
  sheet.getRange(row, 1, 1, macdHeader.length).setValues([macdHeader]);
  sheet.getRange(row, 1, 1, macdHeader.length).setFontWeight('bold');
  row++;

  var macdGroups = {};
  trades.forEach(function(t) {
    var m = t.macd || 'unknown';
    if (!macdGroups[m]) macdGroups[m] = [];
    macdGroups[m].push(t);
  });

  var macdRows = [];
  Object.keys(macdGroups).sort().forEach(function(m) {
    var mt = macdGroups[m];
    var mw = mt.filter(function(t) { return t.win; });
    macdRows.push([
      m.toUpperCase(),
      mt.length,
      mw.length,
      mt.length - mw.length,
      (mw.length / mt.length * 100).toFixed(0) + '%'
    ]);
  });
  if (macdRows.length > 0) {
    sheet.getRange(row, 1, macdRows.length, macdHeader.length).setValues(macdRows);
    row += macdRows.length;
  }
  row += 2;

  // ========== SECTION 8: COMPLETED TRADE LOG ==========
  sheet.getRange(row, 1).setValue('COMPLETED TRADE LOG');
  sheet.getRange(row, 1).setFontWeight('bold').setFontSize(12);
  row++;
  var logHeader = ['Date', 'Symbol', 'Signal', 'Entry', 'SL', 'TP1', 'TP2', 'Score', 'Outcome', 'P&L', 'RSI', 'Timeframe'];
  sheet.getRange(row, 1, 1, logHeader.length).setValues([logHeader]);
  sheet.getRange(row, 1, 1, logHeader.length).setFontWeight('bold');
  row++;

  var sortedTrades = trades.slice().reverse();
  var logRows = [];
  sortedTrades.forEach(function(t) {
    var dateStr = '';
    if (t.timestamp instanceof Date) {
      dateStr = Utilities.formatDate(t.timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    } else {
      dateStr = String(t.timestamp);
    }
    logRows.push([
      dateStr,
      t.ticker,
      t.signal.toUpperCase(),
      t.entry,
      t.sl,
      t.tp1,
      t.tp2,
      t.score + '/6',
      t.win ? 'Won' : 'Lost',
      t.realizedPnl !== 0 ? '$' + t.realizedPnl.toFixed(2) : '',
      t.rsi !== null ? Number(t.rsi).toFixed(1) : '',
      t.timeframe
    ]);
  });
  if (logRows.length > 0) {
    sheet.getRange(row, 1, logRows.length, logHeader.length).setValues(logRows);
  }

  // Auto-resize columns
  for (var c = 1; c <= 12; c++) {
    sheet.autoResizeColumn(c);
  }

  SpreadsheetApp.getUi().alert('Performance report updated! ' + trades.length + ' completed trades analyzed.');
}

// ---------------------------------------------------------------
// onOpen — Adds Trading Tools menu
// ---------------------------------------------------------------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Trading Tools')
    .addItem('Refresh Performance', 'buildPerformanceReport')
    .addSeparator()
    .addItem('Add Symbol', 'addSymbolPrompt')
    .addItem('Test Webhook (POST sample)', 'testWebhook')
    .addToUi();
}

// ---------------------------------------------------------------
// addSymbolPrompt — Add a symbol row to Dashboard manually
// (Dashboard is auto-populated from Positions, but this allows
//  pre-adding symbols you plan to track.)
// ---------------------------------------------------------------
function addSymbolPrompt() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Add Symbol', 'Enter crypto pair (e.g. BTCUSDT):', ui.ButtonSet.OK_CANCEL);
  if (result.getSelectedButton() !== ui.Button.OK) return;

  var symbol = result.getResponseText().toUpperCase().trim();
  if (!symbol) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(DASHBOARD);
  var lastRow = dash.getLastRow() + 1;

  dash.getRange(lastRow, 1).setValue(symbol);
  dash.getRange(lastRow, 2).setValue('(auto)');  // Placeholder — stats computed on refresh

  ui.alert('Added ' + symbol + ' to Dashboard row ' + lastRow + '. Stats will populate from Positions data.');
}

// ---------------------------------------------------------------
// testWebhook — Simulate a POST for testing
// ---------------------------------------------------------------
function testWebhook() {
  var ui = SpreadsheetApp.getUi();
  var testData = {
    signal: 'buy',
    symbol: 'BTCUSDT',
    entry: 42500.00,
    sl: 41800.00,
    tp1: 43500.00,
    tp2: 44500.00,
    macd: 'rising',
    volume: 'above',
    cross: 3,
    in_zone: true,
    rsi: 38.5,
    timeframe: '4h'
  };

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();
    var raw = JSON.stringify(testData);

    var score = calcSignalScore_(testData.macd, testData.cross, testData.in_zone, testData.volume);

    var logSheet = ss.getSheetByName(SIGNAL_LOG);
    logSheet.appendRow([
      timestamp, testData.symbol, testData.signal,
      testData.entry, testData.sl, testData.tp1, testData.tp2,
      testData.macd, testData.volume, testData.cross, testData.in_zone,
      testData.rsi, testData.timeframe, score, raw
    ]);

    var posSheet = ss.getSheetByName(POSITIONS);
    posSheet.appendRow([
      timestamp, testData.symbol, testData.signal,
      testData.entry, testData.sl, testData.tp1, testData.tp2, score,
      '', '', ''
    ]);

    ui.alert('Test signal logged! Score: ' + score + '/6. Check Signal Log and Positions tabs.');
  } catch (err) {
    ui.alert('Error: ' + err.message);
  }
}

// ---------------------------------------------------------------
// setupSheet — One-time setup: creates all tabs with headers
// Run this once after pasting the script into Apps Script.
// ---------------------------------------------------------------
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Signal Log ---
  var log = ss.getSheetByName(SIGNAL_LOG) || ss.insertSheet(SIGNAL_LOG);
  if (log.getLastRow() === 0 || log.getRange('A1').getValue() === '') {
    log.getRange('A1:O1').setValues([[
      'Timestamp', 'Symbol', 'Signal', 'Entry', 'SL', 'TP1', 'TP2',
      'MACD', 'Volume', 'Cross', 'In Zone', 'RSI', 'Timeframe', 'Score', 'Raw JSON'
    ]]);
    log.getRange('A1:O1').setFontWeight('bold');
    log.setFrozenRows(1);
  }

  // --- Positions ---
  var pos = ss.getSheetByName(POSITIONS) || ss.insertSheet(POSITIONS);
  if (pos.getLastRow() === 0 || pos.getRange('A1').getValue() === '') {
    pos.getRange('A1:K1').setValues([[
      'Timestamp', 'Symbol', 'Signal', 'Entry', 'SL', 'TP1', 'TP2',
      'Score', 'Action', 'Outcome', 'Realized P&L'
    ]]);
    pos.getRange('A1:K1').setFontWeight('bold');
    pos.setFrozenRows(1);

    // Data validation dropdowns
    var actionRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Entered', 'Skipped'], true)
      .setAllowInvalid(false)
      .build();
    var outcomeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Won', 'Lost', 'Open'], true)
      .setAllowInvalid(false)
      .build();
    pos.getRange('I2:I500').setDataValidation(actionRule);
    pos.getRange('J2:J500').setDataValidation(outcomeRule);
  }

  // --- Dashboard ---
  var dash = ss.getSheetByName(DASHBOARD) || ss.insertSheet(DASHBOARD);
  if (dash.getLastRow() === 0 || dash.getRange('A1').getValue() === '') {
    dash.getRange('A1:H1').setValues([[
      'Symbol', 'Total Trades', 'Wins', 'Losses', 'Win Rate',
      'Net P&L', 'Open Positions', 'Last Signal'
    ]]);
    dash.getRange('A1:H1').setFontWeight('bold');
    dash.setFrozenRows(1);
  }

  // --- Config ---
  var cfg = ss.getSheetByName(CONFIG) || ss.insertSheet(CONFIG);
  if (cfg.getLastRow() === 0 || cfg.getRange('A1').getValue() === '') {
    cfg.getRange('A1:B1').setValues([['max_positions', 3]]);
    cfg.getRange('A1').setFontWeight('bold');
  }

  // --- Performance ---
  var perf = ss.getSheetByName(PERFORMANCE) || ss.insertSheet(PERFORMANCE);
  if (perf.getLastRow() === 0 || perf.getRange('A1').getValue() === '') {
    perf.getRange('A1').setValue('Run Trading Tools -> Refresh Performance after completing some trades.');
    perf.getRange('A1').setFontWeight('bold');
  }

  SpreadsheetApp.getUi().alert('Setup complete! All tabs created with headers.\n\nSignal Log: 15 columns\nPositions: 11 columns\nDashboard: 8 columns\nConfig: max_positions = 3');
}
