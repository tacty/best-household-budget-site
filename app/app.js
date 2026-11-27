// HomeLedger — a household budget site. Hash routes, localStorage persistence,
// plain SVG charts, no network. window.__shotReady tells a screenshot script
// the page has finished rendering.
//
//   #/            Dashboard
//   #/planner     Monthly budget planner
//   #/expenses    Expense tracker (add / edit / delete)
//   #/goals       Savings goals
//   #/bills       Bills & subscriptions

(function () {
  'use strict';
  var KEY = 'homeledger-v1';
  var seed = window.HOMELEDGER_SEED;
  var app = document.getElementById('app');
  var monthLabel = document.getElementById('monthLabel');
  var state = load();
  var month = '2026-11'; // the sample month the site opens on
  var editingId = null;
  var expenseFilter = { cat: 'all', q: '' };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.expenses && parsed.budgets) return parsed;
      }
    } catch (e) { /* corrupted storage: fall through to the seed */ }
    return JSON.parse(JSON.stringify(seed));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked: edits still show this session */ }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function money0(n) {
    return '$' + Math.round(Number(n || 0)).toLocaleString('en-US');
  }
  function catById(id) {
    for (var i = 0; i < seed.categories.length; i++) if (seed.categories[i].id === id) return seed.categories[i];
    return { id: id, name: 'Other', color: '#9aa5b1' };
  }
  function incomeTotal(m) {
    return (state.income[m] || []).reduce(function (s, r) { return s + r.amount; }, 0);
  }
  function expensesOf(m) { return state.expenses[m] || []; }
  function spentTotal(m) {
    return expensesOf(m).reduce(function (s, e) { return s + e.amount; }, 0);
  }
  function spentByCat(m) {
    var out = {};
    expensesOf(m).forEach(function (e) { out[e.cat] = (out[e.cat] || 0) + e.amount; });
    return out;
  }
  function budgetTotal(m) {
    var b = state.budgets[m] || {};
    return Object.keys(b).reduce(function (s, k) { return s + (Number(b[k]) || 0); }, 0);
  }
  function monthTotal(m) {
    // For months with only summary history, use it; otherwise compute from the books.
    if (state.history[m] && !expensesOf(m).length) return state.history[m];
    return { income: incomeTotal(m), spent: spentTotal(m) };
  }
  function setMonth(m) {
    month = m;
    monthLabel.textContent = seed.monthLabels[m] || m;
    var idx = seed.months.indexOf(m);
    document.getElementById('monthPrev').disabled = idx <= 0;
    document.getElementById('monthNext').disabled = idx >= seed.months.length - 1;
    render();
  }
  function stepMonth(d) {
    var idx = seed.months.indexOf(month) + d;
    if (idx >= 0 && idx < seed.months.length) setMonth(seed.months[idx]);
  }

  /* ---------- SVG charts (plain, no libraries) ---------- */
  function donutChart(byCat) {
    var total = 0, cats = [];
    seed.categories.forEach(function (c) {
      var v = byCat[c.id] || 0;
      if (v > 0) { cats.push({ c: c, v: v }); total += v; }
    });
    if (!total) return '<p class="chart-note">No spending recorded this month yet.</p>';
    var r = 70, circ = 2 * Math.PI * r, off = 0, parts = '';
    cats.forEach(function (x) {
      var len = (x.v / total) * circ;
      parts += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="' + x.c.color +
        '" stroke-width="34" stroke-dasharray="' + len.toFixed(2) + ' ' + (circ - len).toFixed(2) +
        '" stroke-dashoffset="' + (-off).toFixed(2) + '" />';
      off += len;
    });
    var legend = cats.map(function (x) {
      return '<span><span class="dot" style="background:' + x.c.color + '"></span>' + esc(x.c.name) +
        ' — ' + money0(x.v) + ' (' + Math.round((x.v / total) * 100) + '%)</span>';
    }).join('');
    return '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Spending by category">' +
      '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="#f0ebe0" stroke-width="34" />' + parts +
      '<text x="100" y="96" text-anchor="middle" font-size="15" fill="#6b7a72">Spent</text>' +
      '<text x="100" y="120" text-anchor="middle" font-size="19" font-weight="700" fill="#22302b">' + money0(total) + '</text>' +
      '</svg><div class="legend" style="flex:1;min-width:180px">' + legend + '</div></div>';
  }

  function sixMonthChart() {
    var months = seed.months.slice(0, 6); // Jun–Nov 2026
    var max = 0;
    var rows = months.map(function (m) {
      var t = monthTotal(m);
      max = Math.max(max, t.income, t.spent);
      return { m: m, income: t.income, spent: t.spent };
    });
    var W = 520, H = 190, base = H - 26, top = 14, bw = 26, gap = 28;
    var x0 = 30, bars = '', labels = '';
    rows.forEach(function (r, i) {
      var x = x0 + i * (bw * 2 + gap);
      var ih = ((r.income / max) * (base - top)).toFixed(1);
      var sh = ((r.spent / max) * (base - top)).toFixed(1);
      bars += '<rect x="' + x + '" y="' + (base - ih) + '" width="' + bw + '" height="' + ih +
        '" rx="3" fill="#2f6f5e"><title>Income ' + seed.monthLabels[r.m] + ': ' + money0(r.income) + '</title></rect>';
      bars += '<rect x="' + (x + bw + 4) + '" y="' + (base - sh) + '" width="' + bw + '" height="' + sh +
        '" rx="3" fill="#d98e32"><title>Spent ' + seed.monthLabels[r.m] + ': ' + money0(r.spent) + '</title></rect>';
      labels += '<text x="' + (x + bw) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" fill="#6b7a72">' +
        seed.monthLabels[r.m].slice(0, 3) + '</text>';
    });
    return '<svg width="100%" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Income versus spending, last six months">' +
      '<line x1="20" y1="' + base + '" x2="' + (W - 10) + '" y2="' + base + '" stroke="#e4ddd0" stroke-width="1" />' +
      bars + labels + '</svg>' +
      '<div class="legend"><span><span class="dot" style="background:#2f6f5e"></span>Income</span>' +
      '<span><span class="dot" style="background:#d98e32"></span>Spent</span></div>';
  }

  function budgetBars(m) {
    var b = state.budgets[m] || {};
    var byCat = spentByCat(m);
    var rows = seed.categories.map(function (c) {
      var planned = Number(b[c.id]) || 0, spent = byCat[c.id] || 0;
      return { c: c, planned: planned, spent: spent };
    }).filter(function (r) { return r.planned > 0 || r.spent > 0; })
      .sort(function (a, b) { return b.spent - a.spent; });
    return rows.map(function (r) {
      var pct = r.planned ? Math.min(100, (r.spent / r.planned) * 100) : (r.spent ? 100 : 0);
      var cls = r.spent > r.planned ? 'over' : (pct > 85 ? 'amber' : '');
      var tag = r.spent > r.planned
        ? '<span class="pill over">over by ' + money0(r.spent - r.planned) + '</span>'
        : '<span class="pill">' + money0(r.planned - r.spent) + ' left</span>';
      return '<div class="barrow"><span class="cat"><span class="dot" style="background:' + r.c.color +
        '"></span>' + esc(r.c.name) + '</span>' +
        '<span class="meter"><span class="' + cls + '" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="amt">' + money0(r.spent) + ' / ' + money0(r.planned) + '<br>' + tag + '</span></div>';
    }).join('');
  }

  /* ---------- Shared bits ---------- */
  function navActive(route) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === route);
    });
  }
  function flash(msg) {
    var el = document.getElementById('flash');
    if (el) { el.textContent = msg; }
  }
  function upcomingBills(m, n) {
    var paid = (state.billsPaid[m] || []);
    var year = Number(m.slice(0, 4)), mon = Number(m.slice(5, 7));
    return state.bills
      .filter(function (b) { return paid.indexOf(b.id) === -1; })
      .map(function (b) { return { b: b, date: new Date(year, mon - 1, b.due) }; })
      .sort(function (a, b) { return a.date - b.date; })
      .slice(0, n == null ? 99 : n);
  }

  /* ---------- Views ---------- */
  function viewDashboard() {
    var income = incomeTotal(month), spent = spentTotal(month);
    var left = income - spent;
    var saveRate = income ? Math.round((left / income) * 100) : 0;
    var byCat = spentByCat(month);
    var bills = upcomingBills(month, 3);
    var billsTotal = upcomingBills(month).reduce(function (s, x) { return s + x.b.amount; }, 0);
    var goal = state.goals[0];
    var goalPct = Math.round((goal.saved / goal.target) * 100);
    var tips = state.tips.map(function (t) {
      return '<div class="tip"><strong>' + esc(t.title) + '</strong><p>' + esc(t.body) + '</p></div>';
    }).join('');

    app.innerHTML =
      '<div id="flash" class="msg"></div>' +
      '<h1>' + esc(state.household) + '</h1>' +
      '<p class="sub">' + esc(state.members) + ' · ' + esc(seed.monthLabels[month]) + ' · all figures in US dollars</p>' +
      '<div class="grid3" style="margin-bottom:18px">' +
      '<div class="stat"><div class="label">Income</div><div class="value">' + money0(income) + '</div>' +
      '<div class="note">' + state.income[month].map(function (r) { return esc(r.source) + ' ' + money0(r.amount); }).join(' · ') + '</div></div>' +
      '<div class="stat"><div class="label">Spent so far</div><div class="value">' + money0(spent) + '</div>' +
      '<div class="note">of ' + money0(budgetTotal(month)) + ' budgeted · ' + (spentTotal(month) ? expensesOf(month).length + ' expenses' : '') + '</div></div>' +
      '<div class="stat"><div class="label">Left to save</div><div class="value ' + (left >= 0 ? 'good' : 'bad') + '">' + money0(left) + '</div>' +
      '<div class="note">Savings rate ' + saveRate + '% · target ' + money0(state.savingsTarget[month] || 0) + '/month</div></div>' +
      '</div>' +
      '<div class="grid2" style="margin-bottom:18px">' +
      '<section class="card"><h2>Where the money went</h2>' + donutChart(byCat) + '</section>' +
      '<section class="card"><h2>Income vs spending — last 6 months</h2>' + sixMonthChart() +
      '<p class="chart-note">November is on track: spending is below income for the sixth month in a row.</p></section>' +
      '</div>' +
      '<div class="grid2" style="margin-bottom:18px">' +
      '<section class="card"><h2>Budget vs actual</h2>' + budgetBars(month) +
      '<p style="margin:12px 0 0"><a class="btn secondary" href="#/planner">Adjust the budget →</a></p></section>' +
      '<section class="card"><h2>Coming up</h2>' +
      (bills.length ? bills.map(function (x) {
        return '<div class="bill"><span class="bname">' + esc(x.b.name) + '</span>' +
          '<span class="bmeta">due ' + x.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
          (x.b.autopay ? ' · autopay' : '') + '</span><span class="bamt">' + money(x.b.amount) + '</span></div>';
      }).join('') : '<p>All bills for this month are paid. Nice work.</p>') +
      '<p style="margin:12px 0 0">' + money0(billsTotal) + ' still due this month · ' +
      '<a href="#/bills">See all bills →</a></p>' +
      '<h2 style="margin-top:20px">Top savings goal</h2>' +
      '<div class="goal-head"><strong>' + esc(goal.name) + '</strong><span>' + money0(goal.saved) + ' of ' + money0(goal.target) + ' (' + goalPct + '%)</span></div>' +
      '<div class="meter" style="margin:8px 0"><span style="width:' + goalPct + '%"></span></div>' +
      '<p class="note" style="margin:0 0 8px;color:var(--muted);font-size:.9rem">' + esc(goal.note) + ' · ' + money0(goal.target - goal.saved) + ' to go</p>' +
      '<p style="margin:0"><a href="#/goals">All savings goals →</a></p></section>' +
      '</div>' +
      '<section class="card"><h2>This month, in plain words</h2>' + tips + '</section>';
  }

  function viewPlanner() {
    var b = state.budgets[month] || {};
    var rows = seed.categories.map(function (c) {
      return '<div class="barrow" style="grid-template-columns:150px 220px 1fr">' +
        '<label for="bud-' + c.id + '" class="cat"><span class="dot" style="background:' + c.color + '"></span>' + esc(c.name) + '</label>' +
        '<input id="bud-' + c.id + '" type="number" min="0" step="5" value="' + (Number(b[c.id]) || 0) + '" data-cat="' + c.id + '" inputmode="decimal">' +
        '<span class="amt" id="spent-' + c.id + '">spent ' + money0((spentByCat(month))[c.id] || 0) + '</span></div>';
    }).join('');
    app.innerHTML =
      '<div id="flash" class="msg"></div>' +
      '<h1>Budget planner</h1>' +
      '<p class="sub">Set what each category may cost in ' + esc(seed.monthLabels[month]) +
      '. The totals update as you type; saving stores the plan in this browser.</p>' +
      '<section class="card"><h2>Monthly plan — ' + esc(seed.monthLabels[month]) + '</h2>' + rows +
      '<hr style="border:0;border-top:1px solid var(--line);margin:16px 0">' +
      '<div class="barrow" style="grid-template-columns:150px 220px 1fr;font-weight:800">' +
      '<span>Total planned</span><span></span><span class="amt" id="planTotal">' + money0(budgetTotal(month)) + '</span></div>' +
      '<div class="barrow" style="grid-template-columns:150px 220px 1fr">' +
      '<span>Income</span><span></span><span class="amt">' + money0(incomeTotal(month)) + '</span></div>' +
      '<div class="barrow" style="grid-template-columns:150px 220px 1fr">' +
      '<span>Left for savings</span><span></span><span class="amt" id="planLeft">' + money0(incomeTotal(month) - budgetTotal(month)) + '</span></div>' +
      '<p style="margin:16px 0 0"><button type="button" id="savePlan">Save this budget</button> ' +
      '<button type="button" class="secondary" id="copyLast">Copy last month’s plan</button></p></section>' +
      '<section class="card"><h2>How the plan is holding up</h2>' + budgetBars(month) + '</section>';
    document.querySelectorAll('#app input[data-cat]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var total = 0;
        document.querySelectorAll('#app input[data-cat]').forEach(function (i) { total += Number(i.value) || 0; });
        document.getElementById('planTotal').textContent = money0(total);
        document.getElementById('planLeft').textContent = money0(incomeTotal(month) - total);
      });
    });
    document.getElementById('savePlan').addEventListener('click', function () {
      document.querySelectorAll('#app input[data-cat]').forEach(function (i) {
        state.budgets[month][i.getAttribute('data-cat')] = Math.max(0, Number(i.value) || 0);
      });
      save(); flash('Budget saved for ' + seed.monthLabels[month] + '.');
    });
    document.getElementById('copyLast').addEventListener('click', function () {
      var idx = seed.months.indexOf(month);
      if (idx <= 0) { flash('There is no earlier month to copy from.'); return; }
      var prev = state.budgets[seed.months[idx - 1]] || {};
      document.querySelectorAll('#app input[data-cat]').forEach(function (i) {
        i.value = Number(prev[i.getAttribute('data-cat')]) || 0;
        i.dispatchEvent(new Event('input'));
      });
      flash('Copied ' + seed.monthLabels[seed.months[idx - 1]] + '’s plan — press Save this budget to keep it.');
    });
  }

  function expenseRow(e) {
    var c = catById(e.cat);
    return '<tr><td>' + esc(e.date) + '</td><td>' + esc(e.desc) + '</td>' +
      '<td><span class="dot" style="background:' + c.color + ';display:inline-block;vertical-align:-1px"></span> ' + esc(c.name) + '</td>' +
      '<td class="num">' + money(e.amount) + '</td>' +
      '<td class="rowbtns"><button type="button" class="small secondary" data-edit="' + e.id + '">Edit</button> ' +
      '<button type="button" class="small danger" data-del="' + e.id + '">Delete</button></td></tr>';
  }

  function viewExpenses() {
    var list = expensesOf(month).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var filtered = list.filter(function (e) {
      var okCat = expenseFilter.cat === 'all' || e.cat === expenseFilter.cat;
      var okQ = !expenseFilter.q || (e.desc + ' ' + e.date).toLowerCase().indexOf(expenseFilter.q.toLowerCase()) !== -1;
      return okCat && okQ;
    });
    var total = filtered.reduce(function (s, e) { return s + e.amount; }, 0);
    var catOpts = '<option value="all">All categories</option>' + seed.categories.map(function (c) {
      return '<option value="' + c.id + '"' + (expenseFilter.cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>';
    }).join('');
    var formOpts = seed.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('');

    app.innerHTML =
      '<div id="flash" class="msg"></div>' +
      '<h1>Expense tracker</h1>' +
      '<p class="sub">' + expensesOf(month).length + ' expenses in ' + esc(seed.monthLabels[month]) +
      ' · total ' + money(spentTotal(month)) + ' · add one below and every total on the site updates.</p>' +
      '<section class="card"><h2 id="formTitle">Add an expense</h2>' +
      '<form id="expForm" class="inline">' +
      '<label class="field">Date<input type="date" id="fDate" required value="' + month + '-26"></label>' +
      '<label class="field grow">Description<input type="text" id="fDesc" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></label>' +
      '<label class="field">Category<select id="fCat">' + formOpts + '</select></label>' +
      '<label class="field">Amount ($)<input type="number" id="fAmt" required min="0.01" step="0.01" placeholder="0.00" inputmode="decimal"></label>' +
      '<button type="submit" id="fSubmit">Add expense</button> ' +
      '<button type="button" class="secondary" id="fCancel" hidden>Cancel edit</button></form></section>' +
      '<section class="card"><div class="toolbar">' +
      '<label class="field">Category<select id="filterCat">' + catOpts + '</select></label>' +
      '<label class="field grow">Search<input type="search" id="filterQ" placeholder="Search descriptions…" value="' + esc(expenseFilter.q) + '"></label>' +
      '<span class="pill" id="filterCount">' + filtered.length + ' shown · ' + money(total) + '</span></div>' +
      '<div style="overflow-x:auto"><table class="expenses"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>' +
      '<tbody id="expBody">' + (filtered.length ? filtered.map(expenseRow).join('') :
        '<tr><td colspan="5">Nothing matches — try another category or search.</td></tr>') + '</tbody></table></div></section>';

    document.getElementById('filterCat').addEventListener('change', function (ev) {
      expenseFilter.cat = ev.target.value; render();
    });
    document.getElementById('filterQ').addEventListener('input', function (ev) {
      expenseFilter.q = ev.target.value;
      var q = ev.target.value.toLowerCase();
      var rows = expensesOf(month).filter(function (e) {
        var okCat = expenseFilter.cat === 'all' || e.cat === expenseFilter.cat;
        return okCat && (!q || (e.desc + ' ' + e.date).toLowerCase().indexOf(q) !== -1);
      });
      document.getElementById('expBody').innerHTML = rows.length ? rows.map(expenseRow).join('') :
        '<tr><td colspan="5">Nothing matches — try another category or search.</td></tr>';
      var t = rows.reduce(function (s, e) { return s + e.amount; }, 0);
      document.getElementById('filterCount').textContent = rows.length + ' shown · ' + money(t);
      bindRowButtons();
    });
    function bindRowButtons() {
      document.querySelectorAll('[data-edit]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var e = expensesOf(month).find(function (x) { return x.id === btn.getAttribute('data-edit'); });
          if (!e) return;
          editingId = e.id;
          document.getElementById('fDate').value = e.date;
          document.getElementById('fDesc').value = e.desc;
          document.getElementById('fCat').value = e.cat;
          document.getElementById('fAmt').value = e.amount;
          document.getElementById('formTitle').textContent = 'Edit expense';
          document.getElementById('fSubmit').textContent = 'Save changes';
          document.getElementById('fCancel').hidden = false;
          document.getElementById('fDesc').focus();
          window.scrollTo(0, 0);
        });
      });
      document.querySelectorAll('[data-del]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-del');
          var e = expensesOf(month).find(function (x) { return x.id === id; });
          state.expenses[month] = expensesOf(month).filter(function (x) { return x.id !== id; });
          save(); render();
          flash('Deleted “' + (e ? e.desc : '') + '” (' + (e ? money(e.amount) : '') + ').');
        });
      });
    }
    bindRowButtons();
    document.getElementById('fCancel').addEventListener('click', function () { editingId = null; render(); });
    document.getElementById('expForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var date = document.getElementById('fDate').value;
      var desc = document.getElementById('fDesc').value.trim();
      var cat = document.getElementById('fCat').value;
      var amt = Math.round((Number(document.getElementById('fAmt').value) || 0) * 100) / 100;
      if (!date || !desc || !(amt > 0)) { flash('Fill in a date, a description and an amount over $0.'); return; }
      var m = date.slice(0, 7);
      if (!state.expenses[m]) state.expenses[m] = [];
      if (editingId) {
        var old = null;
        Object.keys(state.expenses).forEach(function (k) {
          state.expenses[k] = state.expenses[k].filter(function (x) {
            if (x.id === editingId) { old = x; return false; }
            return true;
          });
        });
        state.expenses[m].push({ id: editingId, date: date, desc: desc, cat: cat, amount: amt });
        editingId = null;
        save(); setMonth(m);
        flash('Saved “' + desc + '” — ' + money(amt) + ' on ' + date + '.');
      } else {
        state.expenses[m].push({ id: 'u' + Date.now(), date: date, desc: desc, cat: cat, amount: amt });
        save(); setMonth(m);
        flash('Added “' + desc + '” — ' + money(amt) + '. Totals and charts updated.');
      }
    });
  }

  function viewGoals() {
    var totalSaved = state.goals.reduce(function (s, g) { return s + g.saved; }, 0);
    var totalTarget = state.goals.reduce(function (s, g) { return s + g.target; }, 0);
    var goalCards = state.goals.map(function (g) {
      var pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      var remain = Math.max(0, g.target - g.saved);
      var monthsLeft = remain > 0 ? Math.ceil(remain / 100) : 0;
      return '<div class="goal"><div class="goal-head"><strong>' + esc(g.name) + '</strong>' +
        '<span>' + money0(g.saved) + ' of ' + money0(g.target) + ' · ' + pct + '%</span></div>' +
        '<div class="meter" style="margin:8px 0"><span style="width:' + pct + '%"></span></div>' +
        '<p class="note">' + esc(g.note) + ' · ' + (remain > 0 ? money0(remain) + ' to go — about ' + monthsLeft + ' months at $100 a month' : 'Fully funded!') + '</p>' +
        '<div class="goal-actions"><button type="button" class="small secondary" data-addgoal="' + g.id + '" data-amt="25">+ $25</button>' +
        '<button type="button" class="small secondary" data-addgoal="' + g.id + '" data-amt="100">+ $100</button>' +
        '<input type="number" min="1" step="1" placeholder="$ amount" aria-label="Custom amount for ' + esc(g.name) + '" data-custom="' + g.id + '">' +
        '<button type="button" class="small" data-addcustom="' + g.id + '">Add amount</button></div></div>';
    }).join('');
    app.innerHTML =
      '<div id="flash" class="msg"></div>' +
      '<h1>Savings goals</h1>' +
      '<p class="sub">' + money0(totalSaved) + ' saved toward ' + money0(totalTarget) + ' across ' + state.goals.length +
      ' goals · ' + Math.round((totalSaved / totalTarget) * 100) + '% of the way there.</p>' +
      '<section class="card">' + goalCards + '</section>' +
      '<section class="card"><h2>Start a new goal</h2>' +
      '<form id="goalForm" class="inline">' +
      '<label class="field grow">Goal name<input type="text" id="gName" required maxlength="60" placeholder="e.g. New washing machine"></label>' +
      '<label class="field">Target ($)<input type="number" id="gTarget" required min="1" step="10" placeholder="1000" inputmode="decimal"></label>' +
      '<label class="field">Already saved ($)<input type="number" id="gSaved" min="0" step="10" value="0" inputmode="decimal"></label>' +
      '<label class="field grow">Note<input type="text" id="gNote" maxlength="80" placeholder="Why this goal?"></label>' +
      '<button type="submit">Add goal</button></form></section>';
    document.querySelectorAll('[data-addgoal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var g = state.goals.find(function (x) { return x.id === btn.getAttribute('data-addgoal'); });
        if (!g) return;
        g.saved = Math.min(g.target, g.saved + Number(btn.getAttribute('data-amt')));
        save(); render();
        flash('Added $' + btn.getAttribute('data-amt') + ' to “' + g.name + '” — now ' + money0(g.saved) + ' of ' + money0(g.target) + '.');
      });
    });
    document.querySelectorAll('[data-addcustom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-addcustom');
        var input = document.querySelector('[data-custom="' + id + '"]');
        var amt = Math.round(Number(input.value) || 0);
        var g = state.goals.find(function (x) { return x.id === id; });
        if (!g || !(amt > 0)) { flash('Enter an amount over $0 first.'); return; }
        g.saved = Math.min(g.target, g.saved + amt);
        save(); render();
        flash('Added ' + money0(amt) + ' to “' + g.name + '”.');
      });
    });
    document.getElementById('goalForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('gName').value.trim();
      var target = Math.max(1, Math.round(Number(document.getElementById('gTarget').value) || 0));
      var saved = Math.max(0, Math.round(Number(document.getElementById('gSaved').value) || 0));
      var note = document.getElementById('gNote').value.trim() || 'A new goal for the household';
      state.goals.push({ id: 'g' + Date.now(), name: name, target: target, saved: Math.min(saved, target), note: note });
      save(); render();
      flash('Goal “' + name + '” added — target ' + money0(target) + '.');
    });
  }

  function viewBills() {
    var paid = state.billsPaid[month] || [];
    var unpaid = upcomingBills(month);
    var unpaidTotal = unpaid.reduce(function (s, x) { return s + x.b.amount; }, 0);
    var paidTotal = state.bills.filter(function (b) { return paid.indexOf(b.id) !== -1; })
      .reduce(function (s, b) { return s + b.amount; }, 0);
    var rows = state.bills.slice().sort(function (a, b) { return a.due - b.due; }).map(function (b) {
      var isPaid = paid.indexOf(b.id) !== -1;
      var c = catById(b.cat);
      return '<div class="bill' + (isPaid ? ' paid' : '') + '">' +
        '<span class="dot" style="background:' + c.color + '"></span>' +
        '<span class="bname">' + esc(b.name) + '</span>' +
        '<span class="bmeta">due day ' + b.due + ' · ' + esc(b.freq) + ' · ' + (b.autopay ? 'autopay' : 'manual') + '</span>' +
        '<span class="bamt">' + money(b.amount) + '</span>' +
        (isPaid ? '<span class="pill">Paid</span>' : '<span class="pill soon">Due</span>') +
        '<button type="button" class="small ' + (isPaid ? 'secondary' : '') + '" data-bill="' + b.id + '">' +
        (isPaid ? 'Mark unpaid' : 'Mark paid') + '</button></div>';
    }).join('');
    var catOpts = seed.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('');
    app.innerHTML =
      '<div id="flash" class="msg"></div>' +
      '<h1>Bills &amp; subscriptions</h1>' +
      '<p class="sub">Everything the household pays on a schedule, for ' + esc(seed.monthLabels[month]) +
      ' · ' + money0(unpaidTotal) + ' still due, ' + money0(paidTotal) + ' already paid.</p>' +
      '<section class="card"><h2>Monthly bills</h2>' + rows + '</section>' +
      '<section class="card"><h2>Add a bill or subscription</h2>' +
      '<form id="billForm" class="inline">' +
      '<label class="field grow">Name<input type="text" id="bName" required maxlength="60" placeholder="e.g. Streaming — sports"></label>' +
      '<label class="field">Amount ($)<input type="number" id="bAmt" required min="0.01" step="0.01" placeholder="0.00" inputmode="decimal"></label>' +
      '<label class="field">Due day<input type="number" id="bDue" required min="1" max="28" value="1"></label>' +
      '<label class="field">Category<select id="bCat">' + catOpts + '</select></label>' +
      '<label class="field">Payment<select id="bAuto"><option value="true">Autopay</option><option value="false">Manual</option></select></label>' +
      '<button type="submit">Add bill</button></form></section>';
    document.querySelectorAll('[data-bill]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-bill');
        var list = state.billsPaid[month] || (state.billsPaid[month] = []);
        var i = list.indexOf(id);
        var b = state.bills.find(function (x) { return x.id === id; });
        if (i === -1) { list.push(id); } else { list.splice(i, 1); }
        save(); render();
        flash('“' + (b ? b.name : '') + '” marked ' + (i === -1 ? 'paid' : 'unpaid') + ' for ' + seed.monthLabels[month] + '.');
      });
    });
    document.getElementById('billForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('bName').value.trim();
      var amt = Math.round((Number(document.getElementById('bAmt').value) || 0) * 100) / 100;
      var due = Math.max(1, Math.min(28, Number(document.getElementById('bDue').value) || 1));
      state.bills.push({
        id: 'b' + Date.now(), name: name, amount: amt, due: due, freq: 'Monthly',
        cat: document.getElementById('bCat').value,
        autopay: document.getElementById('bAuto').value === 'true'
      });
      save(); render();
      flash('Added bill “' + name + '” — ' + money(amt) + ' due day ' + due + '.');
    });
  }

  function viewMissing() {
    app.innerHTML = '<h1>Page not found</h1><p class="sub">That section does not exist.</p>' +
      '<p><a class="btn" href="#/">Back to the dashboard</a></p>';
  }

  /* ---------- Router ---------- */
  function render() {
    window.__shotReady = false;
    var hash = location.hash || '#/';
    var route = 'dashboard';
    if (hash.indexOf('#/planner') === 0) route = 'planner';
    else if (hash.indexOf('#/expenses') === 0) route = 'expenses';
    else if (hash.indexOf('#/goals') === 0) route = 'goals';
    else if (hash.indexOf('#/bills') === 0) route = 'bills';
    else if (hash !== '#/' && hash !== '') route = 'missing';
    navActive(route === 'missing' ? '' : route);
    document.title = { dashboard: 'HomeLedger — Household Budget', planner: 'Budget Planner | HomeLedger', expenses: 'Expense Tracker | HomeLedger', goals: 'Savings Goals | HomeLedger', bills: 'Bills & Subscriptions | HomeLedger', missing: 'Not found | HomeLedger' }[route];
    if (route === 'dashboard') viewDashboard();
    else if (route === 'planner') viewPlanner();
    else if (route === 'expenses') viewExpenses();
    else if (route === 'goals') viewGoals();
    else if (route === 'bills') viewBills();
    else viewMissing();
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }

  document.getElementById('monthPrev').addEventListener('click', function () { stepMonth(-1); });
  document.getElementById('monthNext').addEventListener('click', function () { stepMonth(1); });
  document.getElementById('resetData').addEventListener('click', function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    state = JSON.parse(JSON.stringify(seed));
    editingId = null;
    setMonth('2026-11');
    flash('Sample data reset to the original November 2026 figures.');
  });
  window.addEventListener('hashchange', render);
  monthLabel.textContent = seed.monthLabels[month];
  setMonth(month);
})();
