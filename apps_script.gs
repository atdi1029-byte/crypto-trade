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
var WEEKLY_TASKS = 'Weekly Tasks';

// === SCORING WEIGHTS ===
// MACD rising/falling: +2, cross <= 5 bars ago: +2, in_zone: +1, volume above avg: +1, signals not maxed: +1
// Max auto-score = 7.
var SCORE_MACD       = 2;
var SCORE_CROSS      = 2;
var SCORE_IN_ZONE    = 1;
var SCORE_VOLUME     = 1;
var SCORE_SIGNALS    = 1;
var MAX_AUTO_SCORE   = 7;

// === AUTO-PICK THRESHOLDS ===
var MIN_PICK_SCORE   = 4;   // Minimum score to auto-add to Claude Picks
var MIN_PICK_RR      = 1.4; // Minimum R:R ratio to auto-add

// ---------------------------------------------------------------
// doPost — Webhook receiver (FAST — queue and return immediately)
// TradingView sends JSON like:
//   {"signal":"buy","symbol":"BTCUSDT","entry":42500,"sl":41800,
//    "tp1":43500,"tp2":44500,"macd":"rising","volume":"above",
//    "cross":3,"in_zone":true,"rsi":38.5,"timeframe":"4h"}
//
// Heavy processing (dedup, scoring, Claude picks, email) is handled
// by processQueue which runs on a 1-minute time-based trigger.
// To set up: Triggers → Add → processQueue → Time-driven → Every minute
// ---------------------------------------------------------------
var QUEUE = 'Queue';

function doPost(e) {
  try {
    var raw = e.postData.contents;
    // Sanitize invalid JSON values (NaN, Infinity) before parsing
    raw = raw.replace(/\bNaN\b/g, 'null').replace(/\bInfinity\b/g, 'null').replace(/\b-Infinity\b/g, 'null');
    var data = JSON.parse(raw);

    // --- Non-webhook actions still run inline (they're fast) ---
    if (data.action === 'update_position') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      return updatePosition_(ss, data);
    }
    if (data.action === 'claude_analysis') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      return saveClaudeAnalysis_(ss, data);
    }
    if (data.action === 'add_trade') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      return addTrade_(ss, data);
    }

    // --- Webhook signal: just queue the raw JSON and return fast ---
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var queueSheet = ss.getSheetByName(QUEUE);
    if (!queueSheet) {
      queueSheet = ss.insertSheet(QUEUE);
      queueSheet.appendRow(['Timestamp', 'Raw JSON']);
      queueSheet.setFrozenRows(1);
    }
    queueSheet.appendRow([new Date(), raw]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', queued: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------------
// processQueue — Runs every 1 minute via time-based trigger.
// Processes queued webhook signals: dedup, score, log, auto-pick.
// Set up trigger: Triggers → Add → processQueue → Time-driven → Every minute
// ---------------------------------------------------------------
function processQueue() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var queueSheet = ss.getSheetByName(QUEUE);
  if (!queueSheet) return;

  var data = queueSheet.getDataRange().getValues();
  if (data.length <= 1) return; // header only

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return; // skip if another instance is running

  try {
    var posSheet = ss.getSheetByName(POSITIONS);
    var logSheet = ss.getSheetByName(SIGNAL_LOG);
    var posData = posSheet.getDataRange().getValues();
    var now = new Date();
    var fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    for (var i = 1; i < data.length; i++) {
      var timestamp = data[i][0];
      var raw = data[i][1];
      if (!raw) continue;

      try {
        var d = JSON.parse(raw);
      } catch (parseErr) {
        continue; // skip malformed JSON
      }

      var symbol    = (d.symbol || '').toUpperCase();
      var signal    = (d.signal || '').toLowerCase();
      var entry     = d.entry || '';
      var sl        = d.sl || '';
      var tp1       = d.tp1 || '';
      var tp2       = d.tp2 || '';
      var macd      = (d.macd || '').toLowerCase();
      var volume    = (d.volume || '').toLowerCase();
      var cross     = d.cross;
      var inZone    = d.in_zone;
      var rsi       = d.rsi || '';
      var timeframe = d.timeframe || '';
      var signalsUsed = d.signals_used || '';

      var score = calcSignalScore_(macd, cross, inZone, volume, signalsUsed);

      // Dedup check against current Positions data
      var isDupe = false;
      for (var p = posData.length - 1; p >= 1; p--) {
        var dTs = posData[p][0];
        if (dTs instanceof Date && dTs >= fourHoursAgo) {
          if (String(posData[p][1]).toUpperCase() === symbol && String(posData[p][2]).toLowerCase() === signal) {
            isDupe = true;
            break;
          }
        }
      }

      // Signal Log (always log)
      logSheet.appendRow([
        timestamp, symbol, signal, entry, sl, tp1, tp2,
        macd, volume, cross, inZone, rsi, timeframe, score, raw
      ]);

      // Positions (skip if duplicate)
      if (!isDupe) {
        posSheet.appendRow([
          timestamp, symbol, signal, entry, sl, tp1, tp2, score,
          '', '', '', rsi || '', macd || ''
        ]);
        // Update posData so subsequent items in this batch can dedup correctly
        posData.push([timestamp, symbol, signal, entry, sl, tp1, tp2, score, '', '', '', rsi, macd]);
      }

      // Auto-pick
      if (!isDupe) autoPickSignal_(ss, d, score);
    }

    // Clear queue (keep header)
    if (data.length > 1) {
      queueSheet.deleteRows(2, data.length - 1);
    }

  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------
// calcSignalScore_ — Auto-score an incoming signal (max 6)
// MACD rising/falling: +2, cross <= 5: +2, in_zone: +1, volume above: +1
// ---------------------------------------------------------------
function calcSignalScore_(macd, cross, inZone, volume, signalsUsed) {
  var score = 0;

  // MACD confirmation: +2 if rising (for buy) or falling (for short)
  if (macd === 'rising' || macd === 'falling') {
    score += SCORE_MACD;
  }

  // Cross recency: +2 if the cross happened within 5 bars
  if (cross !== undefined && cross !== null && cross !== '' && cross !== 'no' && Number(cross) <= 5) {
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

  // Signals not maxed: +1 if signals_used is not at max (e.g., "1/2" not "2/2")
  if (signalsUsed) {
    var parts = String(signalsUsed).split('/');
    if (parts.length === 2 && Number(parts[0]) < Number(parts[1])) {
      score += SCORE_SIGNALS;
    }
  } else {
    // If no signals_used field, assume not maxed
    score += SCORE_SIGNALS;
  }

  return Math.min(score, MAX_AUTO_SCORE);
}

// ---------------------------------------------------------------
// calcRiskReward_ — Calculate R:R ratio for a signal
// Returns numeric R:R or null if invalid
// ---------------------------------------------------------------
function calcRiskReward_(signal, entry, sl, tp1) {
  if (!entry || !sl || !tp1) return null;
  entry = Number(entry);
  sl = Number(sl);
  tp1 = Number(tp1);
  if (isNaN(entry) || isNaN(sl) || isNaN(tp1)) return null;

  var risk, reward;
  if (signal === 'buy') {
    risk = entry - sl;
    reward = tp1 - entry;
  } else {
    risk = sl - entry;
    reward = entry - tp1;
  }
  if (risk <= 0) return null;
  return reward / risk;
}

// ---------------------------------------------------------------
// autoPickSignal_ — Auto-add qualifying signals to Claude Picks
// Called from doPost after logging. Checks score + R:R thresholds.
// ---------------------------------------------------------------
function autoPickSignal_(ss, data, score) {
  var signal = (data.signal || '').toLowerCase();
  var entry  = data.entry;
  var sl     = data.sl;
  var tp1    = data.tp1;
  var tp2    = data.tp2;
  var symbol = (data.symbol || '').toUpperCase();

  // Check score threshold
  if (score < MIN_PICK_SCORE) return;

  // Calculate R:R
  var rr = calcRiskReward_(signal, entry, sl, tp1);
  if (rr === null || rr < MIN_PICK_RR) return;

  // Check for duplicate — skip if same symbol already picked in last 24h
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

  var pickData = pickSheet.getDataRange().getValues();
  var now = new Date();
  for (var i = pickData.length - 1; i >= 1; i--) {
    var pickSym = String(pickData[i][1]).toUpperCase();
    var pickTs  = pickData[i][0];
    if (pickSym === symbol && pickTs instanceof Date) {
      var hoursDiff = (now - pickTs) / (1000 * 60 * 60);
      if (hoursDiff < 24) return; // Already picked within 24h
    }
  }

  // Build auto-analysis text
  var parts = [];
  if (data.macd) parts.push('MACD ' + data.macd);
  if (data.volume === 'above') parts.push('volume above avg');
  if (data.in_zone) parts.push('in zone');
  if (data.cross && data.cross !== 'no') parts.push('cross ' + data.cross + ' bars ago');
  if (data.rsi) parts.push('RSI ' + Number(data.rsi).toFixed(1));
  if (data.touches) parts.push(data.touches + ' touches');
  if (data.divergence) parts.push('DIVERGENCE');
  if (data.dmi === 'caution') parts.push('DMI CAUTION');
  var analysis = parts.join(', ') + '.';

  var rrStr = rr.toFixed(2);
  var rec = 'TAKE — Score ' + score + '/7, R:R ' + rrStr + ':1';
  if (data.dmi === 'caution') rec = 'WATCH — DMI caution, R:R ' + rrStr + ':1';

  pickSheet.appendRow([
    now, symbol, signal, entry, sl, tp1, tp2,
    score, rrStr, analysis, rec, 'new'
  ]);

  // Send email alert for new auto-pick
  try {
    var email = Session.getActiveUser().getEmail();
    if (email) {
      MailApp.sendEmail(email,
        'Trade Alert: ' + symbol + ' ' + signal.toUpperCase(),
        rec + '\n\n' + analysis + '\n\nEntry: ' + entry + ' | SL: ' + sl + ' | TP1: ' + tp1 + ' | TP2: ' + tp2
      );
    }
  } catch(e) { /* skip if email fails */ }
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
  var realizedPnl = data.realized_pnl || data.realizedPnl || data.profitLocked || '';

  var posSheet = ss.getSheetByName(POSITIONS);
  var posData  = posSheet.getDataRange().getValues();

  // Find ALL matching rows and update them all (handles duplicates)
  var matchRows = [];
  for (var i = posData.length - 1; i >= 1; i--) {
    var rowSymbol = String(posData[i][1]).toUpperCase();
    var rowSignal = String(posData[i][2]).toLowerCase();
    var rowAction = String(posData[i][8] || '').trim();

    if (field === 'outcome' || field === 'pnl') {
      // For outcome/pnl updates, match rows already marked as Entered with Open/empty outcome
      var rowOutcome = String(posData[i][9] || '').toLowerCase().trim();
      if (rowSymbol === symbol && rowSignal === signal && rowAction.toLowerCase() === 'entered' && (rowOutcome === '' || rowOutcome === 'open')) {
        matchRows.push(i + 1);
      }
    } else {
      // For action updates, match rows with empty action
      if (rowSymbol === symbol && rowSignal === signal && rowAction === '') {
        matchRows.push(i + 1);
      }
    }
  }

  // Fallback: if no open/empty outcome match, try any entered row (allows re-updating outcomes)
  if (matchRows.length === 0 && (field === 'outcome' || field === 'pnl')) {
    for (var f = posData.length - 1; f >= 1; f--) {
      var fSymbol = String(posData[f][1]).toUpperCase();
      var fSignal = String(posData[f][2]).toLowerCase();
      var fAction = String(posData[f][8] || '').trim().toLowerCase();
      if (fSymbol === symbol && fSignal === signal && fAction === 'entered') {
        matchRows.push(f + 1);
        break; // most recent match only
      }
    }
  }

  if (matchRows.length === 0) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'No matching row found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Positions columns: A=timestamp, B=symbol, C=signal, D=entry, E=sl, F=tp1, G=tp2,
  //                     H=score, I=action, J=outcome, K=realized_pnl
  if (field === 'action') {
    for (var m = 0; m < matchRows.length; m++) {
      posSheet.getRange(matchRows[m], 9).setValue(value);   // Column I = Action
    }
    // Also update Claude Picks status so skipped/entered picks disappear from Top Picks
    var cpSheet = ss.getSheetByName('Claude Picks');
    if (cpSheet) {
      var cpData = cpSheet.getDataRange().getValues();
      for (var cp = cpData.length - 1; cp >= 1; cp--) {
        var cpSymbol = String(cpData[cp][1]).toUpperCase();
        var cpSignal = String(cpData[cp][2]).toLowerCase();
        if (cpSymbol === symbol && cpSignal === signal) {
          cpSheet.getRange(cp + 1, 12).setValue(value.toLowerCase()); // Column L = Status
          break;
        }
      }
    }
  } else if (field === 'pnl') {
    // Update just the P&L column without closing the trade (Hit TP / 0x0)
    posSheet.getRange(matchRows[0], 11).setValue(Number(realizedPnl) || 0); // Column K
    var tradeStatus = data.tradeStatus || '';
    if (tradeStatus) {
      posSheet.getRange(matchRows[0], 12).setValue(tradeStatus); // Column L = Trade Status (0x0/tp)
    }
  } else if (field === 'outcome') {
    posSheet.getRange(matchRows[0], 10).setValue(value);  // Column J = Outcome
    if (realizedPnl !== '') {
      posSheet.getRange(matchRows[0], 11).setValue(Number(realizedPnl)); // Column K
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', updated: field, value: value, rows: matchRows.length }))
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
// addTrade_ — Manually add a completed trade to Positions sheet
// For trades entered directly on exchange (not via dashboard)
// Payload: { action: "add_trade", symbol, signal, entry, close_price,
//            outcome: "won"|"lost", realized_pnl, sl, tp1, tp2, score }
// ---------------------------------------------------------------
function addTrade_(ss, data) {
  var symbol     = (data.symbol || '').toUpperCase();
  var signal     = (data.signal || '').toLowerCase();
  var entry      = data.entry || '';
  var sl         = data.sl || '';
  var tp1        = data.tp1 || '';
  var tp2        = data.tp2 || '';
  var score      = data.score || '';
  var outcome    = (data.outcome || '').toLowerCase();
  var realizedPnl = data.realized_pnl || data.realizedPnl || '';

  if (!symbol || !signal || !outcome) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing required fields: symbol, signal, outcome' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var posSheet = ss.getSheetByName(POSITIONS);
  posSheet.appendRow([
    new Date(),   // Timestamp
    symbol,       // Symbol
    signal,       // Signal (buy/short)
    entry,        // Entry price
    sl,           // SL
    tp1,          // TP1
    tp2,          // TP2
    score,        // Score
    'Entered',    // Action
    outcome,      // Outcome (won/lost)
    realizedPnl   // Realized P&L
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', symbol: symbol, outcome: outcome }))
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

  if (action === 'pending') {
    return getPendingAlerts_();
  }

  if (action === 'clear') {
    return clearSignalLog_();
  }

  if (action === 'performance') {
    return servePerformanceJSON_();
  }

  if (action === 'raw_trades') {
    var trades = getAllCompletedTrades_();
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', trades: trades }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'scaling') {
    return serveScalingJSON_();
  }

  if (action === 'update') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    return updatePosition_(ss, e.parameter);
  }

  if (action === 'add_trade') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    return addTrade_(ss, e.parameter);
  }

  if (action === 'tasks') {
    return serveWeeklyTasks_();
  }

  if (action === 'balance') {
    var bal = (e && e.parameter && e.parameter.value) || '';
    if (bal) return recordBalance_(Number(bal));
    return getBalanceHistory_();
  }

  if (action === 'update_pokeballs') {
    var state = e.parameter.state || '[false,false,false,false,false]';
    setConfig_('pokeball_used', state);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'toggle_dca') {
    var mode = (e.parameter.mode === 'true') ? 'true' : 'false';
    setConfig_('dca_mode', mode);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', dcaMode: mode === 'true' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'update_dca') {
    var amount = parseFloat(e.parameter.amount) || 0;
    if (amount <= 0) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Amount must be positive' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var currentTotal = parseFloat(getConfig_('dca_total')) || 0;
    var newTotal = currentTotal + amount;
    setConfig_('dca_total', newTotal.toString());
    var historyRaw = getConfig_('dca_history');
    var history = [];
    if (historyRaw) { try { history = JSON.parse(historyRaw); } catch(e) {} }
    history.push({ date: new Date().toISOString(), amount: amount });
    setConfig_('dca_history', JSON.stringify(history));
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', dcaTotal: newTotal, added: amount }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'reset_dca') {
    setConfig_('dca_total', '0');
    setConfig_('dca_history', '[]');
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', dcaTotal: 0 }))
      .setMimeType(ContentService.MimeType.JSON);
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
// getPendingAlerts_ — Returns all signals from Signal Log as JSON
// Called via: ?action=pending
// ---------------------------------------------------------------
function getPendingAlerts_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName(SIGNAL_LOG);
  var data = logSheet.getDataRange().getValues();
  var alerts = [];

  for (var i = 1; i < data.length; i++) {
    var rawJson = data[i][14]; // Column O = Raw JSON (index 14)
    if (!rawJson) continue;
    try {
      var alert = JSON.parse(rawJson);
      if (!alert.signal) continue; // Skip junk rows
      var ts = data[i][0];
      if (ts instanceof Date) {
        alert.timestamp = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      } else {
        alert.timestamp = String(ts);
      }
      alert.id = i;
      alerts.push(alert);
    } catch(e) { continue; }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ alerts: alerts, count: alerts.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// clearSignalLog_ — Deletes all data rows from Signal Log
// Called via: ?action=clear
// ---------------------------------------------------------------
function clearSignalLog_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName(SIGNAL_LOG);
  var lastRow = logSheet.getLastRow();
  if (lastRow > 1) {
    logSheet.deleteRows(2, lastRow - 1);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'cleared', timestamp: new Date().toISOString() }))
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
    if (!sym || sym.length > 20 || sym.indexOf(' ') !== -1) continue;

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
      if (outcome === 'won' || outcome === 'closed') {
        tickerMap[sym].totalTrades++;
        tickerMap[sym].wins++;
        tickerMap[sym].totalPnl += Number(pnl) || 0;
      } else if (outcome === 'lost') {
        tickerMap[sym].totalTrades++;
        tickerMap[sym].losses++;
        tickerMap[sym].totalPnl += Number(pnl) || 0; // pnl should be negative for losses
      } else if (outcome === '0x0') {
        tickerMap[sym].totalTrades++;
        tickerMap[sym].totalPnl += Number(pnl) || 0;
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

  // --- Build Signal Log lookup by symbol+entry for RSI/MACD/Vol ---
  // Signal Log columns: 0=timestamp, 1=symbol, 2=signal, 3=entry, 4=sl, 5=tp1, 6=tp2,
  //                     7=macd, 8=volume, 9=cross, 10=inZone, 11=rsi, 12=timeframe, 13=score
  var signalLookup = {};
  for (var sl = 1; sl < logData.length; sl++) {
    var logSym = String(logData[sl][1] || '').toUpperCase().trim();
    var logEntry = logData[sl][3] || 0;
    signalLookup[logSym + '|' + logEntry] = sl;
    signalLookup[logSym] = sl;
  }

  // --- All signals from Positions tab (enriched with Signal Log data) ---
  // Use Positions as primary source since Signal Log may have been cleared
  var recentSignals = [];
  for (var pj = posData.length - 1; pj >= 1; pj--) {
    var pr = posData[pj];
    var pSym = String(pr[1] || '').toUpperCase().trim();
    if (!pSym || pSym.length > 20 || pSym.indexOf(' ') !== -1) continue;
    var pts = pr[0];
    var ptsStr = '';
    if (pts instanceof Date) {
      ptsStr = Utilities.formatDate(pts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    } else {
      ptsStr = String(pts);
    }
    // Enrich with Signal Log data (MACD, volume, RSI, etc.) if available
    var logIdx = signalLookup[pSym + '|' + (pr[3] || 0)] || signalLookup[pSym];
    var logRow = logIdx ? logData[logIdx] : null;
    recentSignals.push({
      timestamp: ptsStr,
      symbol:    pSym,
      signal:    String(pr[2] || '').toLowerCase(),
      entry:     pr[3] || 0,
      sl:        pr[4] || 0,
      tp1:       pr[5] || 0,
      tp2:       pr[6] || 0,
      macd:      logRow ? String(logRow[7] || '') : '',
      volume:    logRow ? String(logRow[8] || '') : '',
      cross:     logRow ? logRow[9] : '',
      inZone:    logRow ? logRow[10] : '',
      rsi:       logRow ? (logRow[11] || null) : null,
      timeframe: logRow ? String(logRow[12] || '') : '',
      score:     pr[7] || 0
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

    // Look up matching Signal Log row for RSI/MACD/Vol
    var logIdx = signalLookup[pSymbol + '|' + (pr[3] || 0)] || signalLookup[pSymbol];
    var logRow = logIdx ? logData[logIdx] : null;

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
        rsi:       logRow ? (logRow[11] || null) : null,
        macd:      logRow ? String(logRow[7] || '') : '',
        volume:    logRow ? String(logRow[8] || '') : '',
        message:   'Mark ' + pSignal.toUpperCase() + ' @ ' + pr[3] + ' as Entered/Skipped (score: ' + (pr[7] || 0) + ')'
      });
    } else if (pAction.toLowerCase() === 'entered' && (pOutcome === '' || pOutcome.toLowerCase() === 'open')) {
      var savedPnl = pr[10] || 0;
      var savedStatus = pr[11] || '';
      var entryTs = pr[0];
      var entryTsStr = '';
      if (entryTs instanceof Date) {
        entryTsStr = entryTs.toISOString();
      } else {
        entryTsStr = String(entryTs);
      }
      actionNeeded.push({
        symbol:    pSymbol,
        signal:    pSignal,
        entry:     pr[3] || 0,
        score:     pr[7] || 0,
        timestamp: entryTsStr,
        type:      'mark_outcome',
        realizedPnl: savedPnl ? Number(savedPnl) : 0,
        tradeStatus: String(savedStatus).toLowerCase(),
        rsi:       logRow ? (logRow[11] || null) : null,
        macd:      logRow ? String(logRow[7] || '') : '',
        volume:    logRow ? String(logRow[8] || '') : '',
        message:   'Mark outcome for ' + pSymbol + ' ' + pSignal.toUpperCase() + ' @ ' + pr[3]
      });
    }
  }

  // --- Overall stats ---
  var trades = getAllCompletedTrades_();
  var wins   = trades.filter(function(t) { return t.win; });
  var losses = trades.filter(function(t) { return !t.win && t.outcome === 'lost'; });
  var totalPnl = 0, grossWin = 0, grossLoss = 0;
  trades.forEach(function(t) {
    totalPnl += t.realizedPnl;
    if (t.win) grossWin += t.realizedPnl;
    else if (t.outcome === 'lost') grossLoss += t.realizedPnl;
  });
  var decided = wins.length + losses.length;
  var winRate = decided > 0 ? (wins.length / decided * 100).toFixed(1) : '0.0';
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
    var winScoreSum = 0, winScoreCount = 0;
    wins.forEach(function(t) { if (t.score > 1) { winScoreSum += t.score; winScoreCount++; } });
    avgWinScore = winScoreCount > 0 ? (winScoreSum / winScoreCount).toFixed(1) : '0.0';
  }
  if (losses.length > 0) {
    var lossScoreSum = 0, lossScoreCount = 0;
    losses.forEach(function(t) { if (t.score > 1) { lossScoreSum += t.score; lossScoreCount++; } });
    avgLossScore = lossScoreCount > 0 ? (lossScoreSum / lossScoreCount).toFixed(1) : '0.0';
  }

  // Best / worst individual trades by P&L (best must be positive, worst must be negative)
  var bestTrade = null, worstTrade = null;
  var tickerPerf = {};
  trades.forEach(function(t) {
    if (t.realizedPnl > 0 && (!bestTrade || t.realizedPnl > bestTrade.realizedPnl)) bestTrade = t;
    if (t.realizedPnl < 0 && (!worstTrade || t.realizedPnl < worstTrade.realizedPnl)) worstTrade = t;
    if (!tickerPerf[t.ticker]) tickerPerf[t.ticker] = { wins: 0, total: 0 };
    tickerPerf[t.ticker].total++;
    if (t.win) tickerPerf[t.ticker].wins++;
  });
  var bestTradeWR = bestTrade && tickerPerf[bestTrade.ticker] ? (tickerPerf[bestTrade.ticker].wins / tickerPerf[bestTrade.ticker].total * 100).toFixed(0) : '0';
  var worstTradeWR = worstTrade && tickerPerf[worstTrade.ticker] ? (tickerPerf[worstTrade.ticker].wins / tickerPerf[worstTrade.ticker].total * 100).toFixed(0) : '0';

  var stats = {
    totalTrades:     trades.length,
    wins:            wins.length,
    losses:          losses.length,
    grossWin:        grossWin.toFixed(2),
    grossLoss:       grossLoss.toFixed(2),
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
    bestTrade:       bestTrade ? bestTrade.ticker : 'N/A',
    bestTradePnl:    bestTrade ? bestTrade.realizedPnl.toFixed(2) : '0.00',
    worstTrade:      worstTrade ? worstTrade.ticker : 'N/A',
    worstTradePnl:   worstTrade ? worstTrade.realizedPnl.toFixed(2) : '0.00',
    trend: (function() {
      // Rolling P&L trend: 7d, 14d, 30d averages + per-trade avg
      var now = new Date();
      var d7 = new Date(now - 7*86400000), d14 = new Date(now - 14*86400000), d30 = new Date(now - 30*86400000);
      var pnl7 = 0, cnt7 = 0, pnl14 = 0, cnt14 = 0, pnl30 = 0, cnt30 = 0;
      var cumulative = [];
      var runningPnl = 0;
      // trades are sorted oldest→newest from getAllCompletedTrades_
      trades.forEach(function(t) {
        runningPnl += t.realizedPnl;
        var ts = t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp);
        cumulative.push({ date: Utilities.formatDate(ts, Session.getScriptTimeZone(), 'MM/dd'), pnl: Math.round(runningPnl * 100) / 100 });
        if (ts >= d30) { pnl30 += t.realizedPnl; cnt30++; }
        if (ts >= d14) { pnl14 += t.realizedPnl; cnt14++; }
        if (ts >= d7)  { pnl7  += t.realizedPnl; cnt7++;  }
      });
      var avg7  = cnt7  > 0 ? pnl7  / cnt7  : 0;
      var avg14 = cnt14 > 0 ? pnl14 / cnt14 : 0;
      var avg30 = cnt30 > 0 ? pnl30 / cnt30 : 0;
      var avgAll = trades.length > 0 ? totalPnl / trades.length : 0;
      // Trend direction: compare recent (7d) to overall
      var direction = cnt7 > 0 ? (avg7 > avgAll ? 'improving' : avg7 < avgAll ? 'declining' : 'stable') : 'stable';
      return {
        avg7d:  { pnl: Math.round(pnl7 * 100) / 100, trades: cnt7, avgPerTrade: Math.round(avg7 * 1000) / 1000 },
        avg14d: { pnl: Math.round(pnl14 * 100) / 100, trades: cnt14, avgPerTrade: Math.round(avg14 * 1000) / 1000 },
        avg30d: { pnl: Math.round(pnl30 * 100) / 100, trades: cnt30, avgPerTrade: Math.round(avg30 * 1000) / 1000 },
        allTime: { avgPerTrade: Math.round(avgAll * 1000) / 1000 },
        direction: direction,
        cumulative: cumulative.slice(-60) // last 60 data points for chart
      };
    })(),
    // DCA vs Initial entry performance
    dcaVsInitial: (function() {
      var initial = { wins: 0, losses: 0, pnl: 0 }; // buy/sell/short
      var dca = { wins: 0, losses: 0, pnl: 0 };     // add/reduce
      trades.forEach(function(t) {
        var sig = t.signal;
        var bucket = (sig === 'add' || sig === 'reduce') ? dca : initial;
        if (t.win) bucket.wins++;
        else if (t.outcome === 'lost') bucket.losses++;
        bucket.pnl += t.realizedPnl;
      });
      var iTotal = initial.wins + initial.losses;
      var dTotal = dca.wins + dca.losses;
      return {
        initial: { wins: initial.wins, losses: initial.losses, total: iTotal, winRate: iTotal > 0 ? (initial.wins / iTotal * 100).toFixed(1) + '%' : 'N/A', pnl: Math.round(initial.pnl * 100) / 100, avgPnl: iTotal > 0 ? Math.round(initial.pnl / iTotal * 1000) / 1000 : 0 },
        dca: { wins: dca.wins, losses: dca.losses, total: dTotal, winRate: dTotal > 0 ? (dca.wins / dTotal * 100).toFixed(1) + '%' : 'N/A', pnl: Math.round(dca.pnl * 100) / 100, avgPnl: dTotal > 0 ? Math.round(dca.pnl / dTotal * 1000) / 1000 : 0 }
      };
    })(),
    // SL/TP efficiency: how much of potential TP captured, how losses compare to SL
    slTpEfficiency: (function() {
      var tpCapture = []; // % of TP1 captured on wins
      var slCapture = []; // % of SL hit on losses
      var closedAboveTp1 = 0, closedAboveTp2 = 0;
      wins.forEach(function(t) {
        if (t.entry && t.tp1 && t.realizedPnl > 0) {
          var tpRange = Math.abs(t.tp1 - t.entry);
          if (tpRange > 0) {
            var pct = (t.realizedPnl / tpRange) * 100; // rough % — not exact since sizes vary
            tpCapture.push(pct);
          }
        }
      });
      losses.forEach(function(t) {
        if (t.entry && t.sl && t.realizedPnl < 0) {
          var slRange = Math.abs(t.sl - t.entry);
          if (slRange > 0) {
            var pct = (Math.abs(t.realizedPnl) / slRange) * 100;
            slCapture.push(pct);
          }
        }
      });
      var avgTpPct = tpCapture.length > 0 ? tpCapture.reduce(function(a,b){return a+b},0) / tpCapture.length : 0;
      var avgSlPct = slCapture.length > 0 ? slCapture.reduce(function(a,b){return a+b},0) / slCapture.length : 0;
      var avgWinAmt = wins.length > 0 ? wins.reduce(function(a,t){return a+t.realizedPnl},0) / wins.length : 0;
      var avgLossAmt = losses.length > 0 ? losses.reduce(function(a,t){return a+Math.abs(t.realizedPnl)},0) / losses.length : 0;
      return {
        avgWinAmount: Math.round(avgWinAmt * 1000) / 1000,
        avgLossAmount: Math.round(avgLossAmt * 1000) / 1000,
        winLossRatio: avgLossAmt > 0 ? Math.round(avgWinAmt / avgLossAmt * 100) / 100 : 0,
        totalWins: wins.length,
        totalLosses: losses.length
      };
    })(),
    // Buy vs Short side breakdown
    sideBreakdown: (function() {
      var buy = { wins: 0, losses: 0, pnl: 0 };
      var sell = { wins: 0, losses: 0, pnl: 0 };
      trades.forEach(function(t) {
        var side = (t.signal === 'sell' || t.signal === 'short' || t.signal === 'reduce') ? sell : buy;
        if (t.win) side.wins++;
        else if (t.outcome === 'lost') side.losses++;
        side.pnl += t.realizedPnl;
      });
      var bTotal = buy.wins + buy.losses;
      var sTotal = sell.wins + sell.losses;
      return {
        buy: { wins: buy.wins, losses: buy.losses, total: bTotal, winRate: bTotal > 0 ? (buy.wins / bTotal * 100).toFixed(1) + '%' : 'N/A', pnl: Math.round(buy.pnl * 100) / 100 },
        sell: { wins: sell.wins, losses: sell.losses, total: sTotal, winRate: sTotal > 0 ? (sell.wins / sTotal * 100).toFixed(1) + '%' : 'N/A', pnl: Math.round(sell.pnl * 100) / 100 }
      };
    })(),
    winRateByScore:  (function() {
      var buckets = { high: { w:0, t:0 }, mid: { w:0, t:0 }, low: { w:0, t:0 } };
      trades.forEach(function(t) {
        var s = Number(t.score);
        if (s <= 1) return;
        var b = s >= 5 ? 'high' : s >= 3 ? 'mid' : 'low';
        buckets[b].t++;
        if (t.win) buckets[b].w++;
      });
      return {
        high: buckets.high.t > 0 ? (buckets.high.w / buckets.high.t * 100).toFixed(0) + '%' : null,
        mid:  buckets.mid.t > 0  ? (buckets.mid.w / buckets.mid.t * 100).toFixed(0) + '%' : null,
        low:  buckets.low.t > 0  ? (buckets.low.w / buckets.low.t * 100).toFixed(0) + '%' : null
      };
    })(),
    // RSI at entry: deep oversold vs moderate
    rsiAnalysis: (function() {
      var deep = { w:0, l:0, pnl:0 };   // RSI < 25
      var mid = { w:0, l:0, pnl:0 };    // RSI 25-35
      var shallow = { w:0, l:0, pnl:0 }; // RSI 35-50
      var ob = { w:0, l:0, pnl:0 };     // RSI > 50 (overbought side / shorts)
      trades.forEach(function(t) {
        if (t.rsi === null || t.rsi === undefined) return;
        var r = Number(t.rsi);
        var bucket = r < 25 ? deep : r < 35 ? mid : r < 50 ? shallow : ob;
        if (t.win) bucket.w++;
        else if (t.outcome === 'lost') bucket.l++;
        bucket.pnl += t.realizedPnl;
      });
      function fmt(b) {
        var total = b.w + b.l;
        return { wins: b.w, losses: b.l, total: total, winRate: total > 0 ? (b.w/total*100).toFixed(0)+'%' : 'N/A', pnl: Math.round(b.pnl*100)/100 };
      }
      return { deepOversold: fmt(deep), moderate: fmt(mid), shallow: fmt(shallow), overbought: fmt(ob) };
    })(),
    // MACD confirmation
    macdAnalysis: (function() {
      var bullish = { w:0, l:0, pnl:0 };
      var bearish = { w:0, l:0, pnl:0 };
      var none = { w:0, l:0, pnl:0 };
      trades.forEach(function(t) {
        var m = String(t.macd || '').toLowerCase();
        var bucket = m.indexOf('bull') >= 0 ? bullish : m.indexOf('bear') >= 0 ? bearish : none;
        if (t.win) bucket.w++;
        else if (t.outcome === 'lost') bucket.l++;
        bucket.pnl += t.realizedPnl;
      });
      function fmt(b) {
        var total = b.w + b.l;
        return { wins: b.w, losses: b.l, total: total, winRate: total > 0 ? (b.w/total*100).toFixed(0)+'%' : 'N/A', pnl: Math.round(b.pnl*100)/100 };
      }
      return { bullish: fmt(bullish), bearish: fmt(bearish), none: fmt(none) };
    })(),
    // Time of day analysis (by session)
    sessionAnalysis: (function() {
      var asian = { w:0, l:0, pnl:0 };   // 00:00-08:00 UTC
      var europe = { w:0, l:0, pnl:0 };  // 08:00-14:00 UTC
      var us = { w:0, l:0, pnl:0 };      // 14:00-21:00 UTC
      var night = { w:0, l:0, pnl:0 };   // 21:00-00:00 UTC
      trades.forEach(function(t) {
        var ts = t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp);
        var h = ts.getUTCHours();
        var bucket = h < 8 ? asian : h < 14 ? europe : h < 21 ? us : night;
        if (t.win) bucket.w++;
        else if (t.outcome === 'lost') bucket.l++;
        bucket.pnl += t.realizedPnl;
      });
      function fmt(b) {
        var total = b.w + b.l;
        return { wins: b.w, losses: b.l, total: total, winRate: total > 0 ? (b.w/total*100).toFixed(0)+'%' : 'N/A', pnl: Math.round(b.pnl*100)/100 };
      }
      return { asian: fmt(asian), europe: fmt(europe), us: fmt(us), night: fmt(night) };
    })(),
    // Day of week analysis
    dayOfWeekAnalysis: (function() {
      var days = {};
      var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      dayNames.forEach(function(d) { days[d] = { w:0, l:0, pnl:0 }; });
      trades.forEach(function(t) {
        var ts = t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp);
        var d = dayNames[ts.getDay()];
        if (t.win) days[d].w++;
        else if (t.outcome === 'lost') days[d].l++;
        days[d].pnl += t.realizedPnl;
      });
      var result = {};
      dayNames.forEach(function(d) {
        var total = days[d].w + days[d].l;
        result[d] = { wins: days[d].w, losses: days[d].l, total: total, winRate: total > 0 ? (days[d].w/total*100).toFixed(0)+'%' : 'N/A', pnl: Math.round(days[d].pnl*100)/100 };
      });
      return result;
    })(),
    // Score granularity (exact scores)
    scoreGranularity: (function() {
      var scores = {};
      trades.forEach(function(t) {
        var s = Number(t.score);
        if (s <= 1) return;
        var key = s >= 6 ? '6+' : String(Math.floor(s));
        if (!scores[key]) scores[key] = { w:0, l:0, pnl:0 };
        if (t.win) scores[key].w++;
        else if (t.outcome === 'lost') scores[key].l++;
        scores[key].pnl += t.realizedPnl;
      });
      var result = {};
      ['2','3','4','5','6+'].forEach(function(k) {
        if (scores[k]) {
          var total = scores[k].w + scores[k].l;
          result[k] = { wins: scores[k].w, losses: scores[k].l, total: total, winRate: total > 0 ? (scores[k].w/total*100).toFixed(0)+'%' : 'N/A', pnl: Math.round(scores[k].pnl*100)/100, avgPnl: total > 0 ? Math.round(scores[k].pnl/total*1000)/1000 : 0 };
        }
      });
      return result;
    })()
  };

  // --- Claude Picks (from Claude Code analysis) ---
  var claudePicks = [];
  var cpSheet = ss.getSheetByName('Claude Picks');
  if (cpSheet) {
    var cpData = cpSheet.getDataRange().getValues();
    // Columns: 0=timestamp, 1=symbol, 2=signal, 3=entry, 4=sl, 5=tp1, 6=tp2,
    //          7=score, 8=rr, 9=analysis, 10=recommendation, 11=status
    // Show last 10, newest first
    var cpStart = Math.max(1, cpData.length - 20);
    for (var cp = cpData.length - 1; cp >= cpStart; cp--) {
      var cpr = cpData[cp];
      // Skip picks that have been acted on (Entered/Skipped)
      var cpStatus = String(cpr[11] || '').toLowerCase();
      if (cpStatus === 'entered' || cpStatus === 'skipped') continue;
      if (claudePicks.length >= 10) break; // Still cap at 10 visible picks
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

  // --- Pokeball state from Config tab ---
  var pokeballRaw = getConfig_('pokeball_used');
  var pokeballUsed = [false,false,false,false,false];
  if (pokeballRaw) {
    try { pokeballUsed = JSON.parse(pokeballRaw); } catch(e) {}
  }

  // --- DCA state from Config tab ---
  var dcaMode = String(getConfig_('dca_mode')).toLowerCase() === 'true';
  var dcaTotal = parseFloat(getConfig_('dca_total')) || 0;

  var payload = {
    status:        'ok',
    timestamp:     new Date().toISOString(),
    tickers:       tickers,
    recentSignals: recentSignals,
    topPicks:      topPicks,
    claudePicks:   claudePicks,
    actionNeeded:  actionNeeded,
    stats:         stats,
    pokeballUsed:  pokeballUsed,
    dcaMode:       dcaMode,
    dcaTotal:      dcaTotal
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
// Helper: set config value by label (upsert)
// Config tab layout: Column A = label, Column B = value
// ---------------------------------------------------------------
function setConfig_(label, value) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG);
  var data  = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === label.toLowerCase()) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  // Not found — append new row
  sheet.appendRow([label, value]);
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
    if (outcome !== 'won' && outcome !== 'lost' && outcome !== 'closed' && outcome !== '0x0') continue;

    var symbol = String(posData[j][1]).toUpperCase();
    var signal = String(posData[j][2]).toLowerCase();
    var entry  = posData[j][3];
    var sl     = posData[j][4];
    var tp1    = posData[j][5];
    var tp2    = posData[j][6];
    var score  = posData[j][7] || 0;
    var pnl    = posData[j][10] || 0;

    // Read RSI/MACD directly from Positions columns L/M (new trades)
    // Fall back to Signal Log cross-reference for older trades
    var rsi = posData[j][11] || '';
    var macd = posData[j][12] || '';
    var timeframe = '';
    if (!rsi && !macd) {
      var lookupKey = symbol + '|' + signal + '|' + String(entry);
      if (logLookup[lookupKey] && logLookup[lookupKey].length > 0) {
        var match = logLookup[lookupKey][0];
        rsi = match.rsi;
        timeframe = match.timeframe;
        macd = match.macd;
        logLookup[lookupKey].shift();
      }
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
      win:         outcome === 'won' || outcome === 'closed',
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

    var score = calcSignalScore_(testData.macd, testData.cross, testData.in_zone, testData.volume, testData.signals_used);

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

  // --- Balance History ---
  var balSheet = ss.getSheetByName('Balance History') || ss.insertSheet('Balance History');
  if (balSheet.getLastRow() === 0 || balSheet.getRange('A1').getValue() === '') {
    balSheet.getRange('A1:C1').setValues([['Timestamp', 'Balance', 'Notes']]);
    balSheet.getRange('A1:C1').setFontWeight('bold');
    balSheet.setFrozenRows(1);
  }

  SpreadsheetApp.getUi().alert('Setup complete! All tabs created with headers.\n\nSignal Log: 15 columns\nPositions: 11 columns\nDashboard: 8 columns\nConfig: max_positions = 3\nBalance History: 3 columns');
}

// ===============================================================
// PERFORMANCE ANALYSIS API
// ?action=performance — Full performance breakdown as JSON
// ===============================================================
function servePerformanceJSON_() {
  var trades = getAllCompletedTrades_();

  if (trades.length === 0) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'No completed trades yet', trades: 0 }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var wins = trades.filter(function(t) { return t.win; });
  var losses = trades.filter(function(t) { return !t.win; });
  var totalPnl = 0;
  trades.forEach(function(t) { totalPnl += t.realizedPnl; });
  var streaks = calcStreaks_(trades);

  // --- By Score ---
  var byScore = {};
  trades.forEach(function(t) {
    var s = String(t.score);
    if (!byScore[s]) byScore[s] = { wins: 0, losses: 0, pnl: 0 };
    if (t.win) byScore[s].wins++; else byScore[s].losses++;
    byScore[s].pnl += t.realizedPnl;
  });
  var scoreBreakdown = [];
  Object.keys(byScore).sort(function(a,b) { return Number(b)-Number(a); }).forEach(function(s) {
    var d = byScore[s];
    var total = d.wins + d.losses;
    scoreBreakdown.push({
      score: s + '/7',
      trades: total,
      wins: d.wins,
      losses: d.losses,
      winRate: (d.wins / total * 100).toFixed(1) + '%',
      pnl: d.pnl.toFixed(2)
    });
  });

  // --- By RSI Range ---
  var rsiRanges = {'20-30':[],'30-40':[],'40-50':[],'50-60':[],'60-70':[]};
  trades.forEach(function(t) {
    if (t.rsi === null) return;
    var r = t.rsi;
    if (r >= 20 && r < 30) rsiRanges['20-30'].push(t);
    else if (r >= 30 && r < 40) rsiRanges['30-40'].push(t);
    else if (r >= 40 && r < 50) rsiRanges['40-50'].push(t);
    else if (r >= 50 && r < 60) rsiRanges['50-60'].push(t);
    else if (r >= 60 && r < 70) rsiRanges['60-70'].push(t);
  });
  var rsiBreakdown = [];
  Object.keys(rsiRanges).forEach(function(range) {
    var rt = rsiRanges[range];
    if (rt.length === 0) return;
    var rw = rt.filter(function(t) { return t.win; });
    rsiBreakdown.push({
      range: range,
      trades: rt.length,
      wins: rw.length,
      winRate: (rw.length / rt.length * 100).toFixed(1) + '%'
    });
  });

  // --- By Signal Type ---
  var bySignal = {};
  trades.forEach(function(t) {
    if (!bySignal[t.signal]) bySignal[t.signal] = { wins: 0, losses: 0 };
    if (t.win) bySignal[t.signal].wins++; else bySignal[t.signal].losses++;
  });
  var signalBreakdown = [];
  Object.keys(bySignal).forEach(function(sig) {
    var d = bySignal[sig];
    var total = d.wins + d.losses;
    signalBreakdown.push({
      signal: sig,
      trades: total,
      wins: d.wins,
      winRate: (d.wins / total * 100).toFixed(1) + '%'
    });
  });

  // --- Top/Bottom Tickers ---
  var tickerStats = {};
  trades.forEach(function(t) {
    if (!tickerStats[t.ticker]) tickerStats[t.ticker] = { wins: 0, losses: 0, pnl: 0 };
    if (t.win) tickerStats[t.ticker].wins++; else tickerStats[t.ticker].losses++;
    tickerStats[t.ticker].pnl += t.realizedPnl;
  });
  var tickerList = Object.keys(tickerStats).map(function(sym) {
    var d = tickerStats[sym];
    var total = d.wins + d.losses;
    return { ticker: sym, trades: total, wins: d.wins, winRate: (d.wins/total*100).toFixed(1)+'%', pnl: d.pnl.toFixed(2) };
  }).sort(function(a,b) { return parseFloat(b.winRate) - parseFloat(a.winRate); });

  // --- Milestone check ---
  var milestone = null;
  var milestones = [25, 50, 75, 100, 150, 200, 250, 500];
  for (var m = 0; m < milestones.length; m++) {
    if (trades.length >= milestones[m] && trades.length < milestones[m] + 5) {
      // Compare last N vs previous N
      var half = Math.floor(milestones[m] / 2);
      var recent = trades.slice(-half);
      var earlier = trades.slice(-milestones[m], -half);
      var recentWR = recent.filter(function(t){return t.win;}).length / recent.length * 100;
      var earlierWR = earlier.filter(function(t){return t.win;}).length / earlier.length * 100;
      milestone = {
        reached: milestones[m],
        recentWinRate: recentWR.toFixed(1) + '%',
        earlierWinRate: earlierWR.toFixed(1) + '%',
        trend: recentWR > earlierWR ? 'IMPROVING' : recentWR < earlierWR ? 'DECLINING' : 'STABLE',
        message: 'Milestone: ' + milestones[m] + ' trades! Recent ' + half + ': ' + recentWR.toFixed(1) + '% vs Earlier ' + half + ': ' + earlierWR.toFixed(1) + '%'
      };
      break;
    }
  }

  var payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    summary: {
      totalTrades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: (wins.length / trades.length * 100).toFixed(1) + '%',
      netPnl: totalPnl.toFixed(2),
      bestWinStreak: streaks.bestWin,
      worstLossStreak: streaks.worstLoss,
      currentStreak: streaks.current > 0 ? streaks.current + 'W' : Math.abs(streaks.current) + 'L'
    },
    byScore: scoreBreakdown,
    byRSI: rsiBreakdown,
    bySignal: signalBreakdown,
    topTickers: tickerList.slice(0, 5),
    bottomTickers: tickerList.slice(-5).reverse(),
    milestone: milestone
  };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===============================================================
// SCALING ADVISOR
// ?action=scaling — Returns current phase + recommended sizes
// Based on the scaling plan from NOTES.txt
// ===============================================================
function serveScalingJSON_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deposited = 132; // Total deposited

  // Get latest balance from Balance History tab
  var balSheet = ss.getSheetByName('Balance History');
  var currentBalance = deposited;
  if (balSheet && balSheet.getLastRow() > 1) {
    var balData = balSheet.getDataRange().getValues();
    currentBalance = Number(balData[balData.length - 1][1]) || deposited;
  }

  var profit = currentBalance - deposited;

  // Scaling tiers: [profitThreshold, [t1, t2, t3, t4, t5]]
  var tiers = [
    [0,   [1,1,1,1,1]],
    [50,  [3,2,2,1,1]],
    [100, [4,3,2,1,1]],
    [150, [5,3,2,1,1]],
    [200, [5,3,2,2,1]],
    [250, [5,3,3,3,2]],
    [300, [5,4,3,3,2]],
    [350, [5,4,4,4,2]],
    [400, [5,5,4,4,2]],
    [450, [5,5,5,4,2]],
    [500, [5,5,5,5,3]],
    [750, [6,6,6,6,3]],
    [1000,[7,7,7,7,4]],
    [1500,[8,8,8,8,4]],
    [2000,[9,9,9,9,5]],
    [2500,[10,10,10,10,5]],
    [5000,[11,11,11,11,6]]
  ];

  var phase = 'Phase 1: Proving ($0-$500)';
  var sizes = [1,1,1,1,1];
  for (var i = tiers.length - 1; i >= 0; i--) {
    if (profit >= tiers[i][0]) {
      sizes = tiers[i][1];
      if (profit < 500) phase = 'Phase 1: Proving ($0-$500)';
      else if (profit < 5000) phase = 'Phase 2: Early Scaling ($500-$5k)';
      else if (profit < 10000) phase = 'Phase 3: Slow ($5k-$10k)';
      else if (profit < 20000) phase = 'Phase 4: Building ($10k-$20k)';
      else if (profit < 40000) phase = 'Phase 5: Ramping ($20k-$40k)';
      else if (profit < 80000) phase = 'Phase 6: Peak ($40k-$80k)';
      else phase = 'Phase 7: Tapering ($80k-$150k)';
      break;
    }
  }

  var totalMargin = sizes.reduce(function(a,b) { return a+b; }, 0);

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      deposited: deposited,
      currentBalance: currentBalance,
      profit: profit.toFixed(2),
      phase: phase,
      positionSizes: sizes,
      totalMarginPerSession: totalMargin,
      sizing: 'Trade 1: $' + sizes[0] + ' | Trade 2: $' + sizes[1] + ' | Trade 3: $' + sizes[2] + ' | Trade 4: $' + sizes[3] + ' | Trade 5: $' + sizes[4]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===============================================================
// BALANCE TRACKING
// ?action=balance&value=XX — Record a new balance snapshot
// ?action=balance — Get balance history
// ===============================================================
function recordBalance_(balance) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var balSheet = ss.getSheetByName('Balance History');
  if (!balSheet) {
    balSheet = ss.insertSheet('Balance History');
    balSheet.appendRow(['Timestamp', 'Balance', 'Notes']);
    balSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    balSheet.setFrozenRows(1);
  }

  var now = new Date();
  balSheet.appendRow([now, balance, '']);

  var deposited = 132;
  var profit = balance - deposited;

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      balance: balance,
      deposited: deposited,
      profit: profit.toFixed(2),
      profitPct: (profit / deposited * 100).toFixed(1) + '%',
      timestamp: now.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getBalanceHistory_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var balSheet = ss.getSheetByName('Balance History');

  if (!balSheet || balSheet.getLastRow() <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', history: [], message: 'No balance records yet. Use ?action=balance&value=XX to record.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = balSheet.getDataRange().getValues();
  var history = [];
  var deposited = 132;

  for (var i = 1; i < data.length; i++) {
    var ts = data[i][0];
    var tsStr = '';
    if (ts instanceof Date) {
      tsStr = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    } else {
      tsStr = String(ts);
    }
    var bal = Number(data[i][1]);
    history.push({
      timestamp: tsStr,
      balance: bal,
      profit: (bal - deposited).toFixed(2),
      notes: data[i][2] || ''
    });
  }

  var latest = history[history.length - 1];

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      deposited: deposited,
      latestBalance: latest.balance,
      currentProfit: latest.profit,
      profitPct: ((latest.balance - deposited) / deposited * 100).toFixed(1) + '%',
      history: history
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// serveWeeklyTasks_ — Returns weekly task list as JSON array
// Called via: ?action=tasks
// Weekly Tasks tab: Column A = task text, row 1 = header
// ---------------------------------------------------------------
function serveWeeklyTasks_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(WEEKLY_TASKS);

  if (!sheet || sheet.getLastRow() <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', tasks: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  var tasks = [];
  for (var i = 0; i < data.length; i++) {
    var text = String(data[i][0] || '').trim();
    if (text) tasks.push(text);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', tasks: tasks }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// Keep-alive — prevents cold starts that cause webhook timeouts
// Set up: Triggers → Add Trigger → keepAlive → Time-driven → Every 5 minutes
// ---------------------------------------------------------------
function keepAlive() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
}
