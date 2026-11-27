# HomeLedger — Household Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/tacty/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/tacty/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site that runs entirely in the browser from static files.
No account, no network requests, no fees: all data lives in the browser's
localStorage, seeded with a realistic sample household month (the Alvarez
family, November 2026).

## What it does

- **Dashboard** — income, spending and savings rate at a glance, a spending-by-category
  donut chart, an income-vs-spending chart for the last six months, budget-vs-actual
  bars, upcoming bills and the top savings goal.
- **Budget Planner** — set a monthly plan per category, with live totals and
  the amount left for savings; copy last month's plan with one click.
- **Expense Tracker** — add, edit and delete expenses, filter by category and
  search descriptions. Every total and chart on the site updates.
- **Savings Goals** — progress bars for each goal, quick-add buttons (+$25 / +$100),
  custom amounts, and a form to start a new goal.
- **Bills & Subscriptions** — every recurring bill with its due day, autopay status
  and a mark-paid toggle, plus a form to add a new bill.
- **Month switcher** — step between June and December 2026; figures, bills and
  budgets follow the month. Works on desktop and on a phone.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open `app/index.html` directly in a browser also works. There is no build step;
charts are plain SVG drawn by `app/app.js`.

## Hand-in

`main.ts` copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`)
and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.

## Support

If this entry wins a prize, the payout wallet is:

- Wallet (Solana): `8muodSLymFUxtKZi7r3Bb9uR2fHdj61naiViryKdWyjc`
- Referral code: `kwg9khhh`
