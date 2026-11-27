// HomeLedger seed data: a sample household month, November 2026.
// All figures are realistic example data for the Alvarez household (2 adults, 2 kids).
// The app loads this into localStorage on first run; every edit the user makes
// is saved there, so the seed is only the starting point.

window.HOMELEDGER_SEED = {
  household: 'The Alvarez Household',
  members: 'Maya & Jon Alvarez + Sofia (9) and Leo (6)',
  currency: '$',
  months: ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'],
  monthLabels: {
    '2026-06': 'June 2026', '2026-07': 'July 2026', '2026-08': 'August 2026',
    '2026-09': 'September 2026', '2026-10': 'October 2026', '2026-11': 'November 2026',
    '2026-12': 'December 2026'
  },
  categories: [
    { id: 'housing', name: 'Housing', color: '#2f6f5e' },
    { id: 'groceries', name: 'Groceries', color: '#4a9b6b' },
    { id: 'dining', name: 'Dining Out', color: '#d98e32' },
    { id: 'transport', name: 'Transport', color: '#3e7cb1' },
    { id: 'utilities', name: 'Utilities', color: '#7a6fb0' },
    { id: 'health', name: 'Health', color: '#c65b7c' },
    { id: 'kids', name: 'Kids', color: '#e07856' },
    { id: 'fun', name: 'Entertainment', color: '#5aa9a0' },
    { id: 'shopping', name: 'Shopping', color: '#8a7d6b' },
    { id: 'other', name: 'Other', color: '#9aa5b1' }
  ],
  income: {
    '2026-06': [{ source: 'Maya — salary', amount: 3850 }, { source: 'Jon — salary', amount: 2620 }, { source: 'Weekend tutoring', amount: 280 }],
    '2026-07': [{ source: 'Maya — salary', amount: 3850 }, { source: 'Jon — salary', amount: 2620 }, { source: 'Weekend tutoring', amount: 320 }],
    '2026-08': [{ source: 'Maya — salary', amount: 3850 }, { source: 'Jon — salary', amount: 2620 }, { source: 'Weekend tutoring', amount: 240 }],
    '2026-09': [{ source: 'Maya — salary', amount: 3850 }, { source: 'Jon — salary', amount: 2620 }, { source: 'Weekend tutoring', amount: 300 }],
    '2026-10': [{ source: 'Maya — salary', amount: 3920 }, { source: 'Jon — salary', amount: 2680 }, { source: 'Weekend tutoring', amount: 310 }],
    '2026-11': [{ source: 'Maya — salary', amount: 3920 }, { source: 'Jon — salary', amount: 2680 }, { source: 'Weekend tutoring', amount: 290 }],
    '2026-12': [{ source: 'Maya — salary', amount: 3920 }, { source: 'Jon — salary', amount: 2680 }, { source: 'Holiday bonus', amount: 1200 }]
  },
  budgets: {
    '2026-06': { housing: 1850, groceries: 600, dining: 220, transport: 360, utilities: 270, health: 160, kids: 300, fun: 140, shopping: 180, other: 100 },
    '2026-07': { housing: 1850, groceries: 600, dining: 240, transport: 370, utilities: 300, health: 160, kids: 340, fun: 160, shopping: 200, other: 100 },
    '2026-08': { housing: 1850, groceries: 620, dining: 240, transport: 380, utilities: 310, health: 180, kids: 420, fun: 160, shopping: 200, other: 120 },
    '2026-09': { housing: 1850, groceries: 620, dining: 240, transport: 380, utilities: 280, health: 180, kids: 320, fun: 150, shopping: 200, other: 100 },
    '2026-10': { housing: 1850, groceries: 620, dining: 240, transport: 380, utilities: 290, health: 180, kids: 320, fun: 150, shopping: 200, other: 100 },
    '2026-11': { housing: 1850, groceries: 620, dining: 240, transport: 380, utilities: 290, health: 180, kids: 320, fun: 150, shopping: 200, other: 100 },
    '2026-12': { housing: 1850, groceries: 680, dining: 300, transport: 380, utilities: 320, health: 180, kids: 380, fun: 220, shopping: 320, other: 150 }
  },
  savingsTarget: { '2026-06': 750, '2026-07': 750, '2026-08': 700, '2026-09': 800, '2026-10': 800, '2026-11': 800, '2026-12': 900 },
  expenses: {
    '2026-11': [
      { id: 'e1', date: '2026-11-01', desc: 'Rent — Maple Court Apt 4B', cat: 'housing', amount: 1850 },
      { id: 'e2', date: '2026-11-02', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 142.60 },
      { id: 'e3', date: '2026-11-03', desc: 'City power & light', cat: 'utilities', amount: 118.40 },
      { id: 'e4', date: '2026-11-04', desc: 'Bus passes — Maya & Jon', cat: 'transport', amount: 96.00 },
      { id: 'e5', date: '2026-11-05', desc: 'Sofia piano lesson', cat: 'kids', amount: 45.00 },
      { id: 'e6', date: '2026-11-06', desc: 'Pharmacy — Leo inhaler refill', cat: 'health', amount: 28.50 },
      { id: 'e7', date: '2026-11-07', desc: 'Pizza night (takeout)', cat: 'dining', amount: 34.75 },
      { id: 'e8', date: '2026-11-08', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 128.90 },
      { id: 'e9', date: '2026-11-09', desc: 'Fuel — family car', cat: 'transport', amount: 52.30 },
      { id: 'e10', date: '2026-11-10', desc: 'Internet & TV', cat: 'utilities', amount: 89.00 },
      { id: 'e11', date: '2026-11-12', desc: 'Leo winter coat', cat: 'shopping', amount: 68.00 },
      { id: 'e12', date: '2026-11-13', desc: 'Sofia school trip deposit', cat: 'kids', amount: 120.00 },
      { id: 'e13', date: '2026-11-14', desc: 'Cinema — family film night', cat: 'fun', amount: 46.50 },
      { id: 'e14', date: '2026-11-15', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 119.40 },
      { id: 'e15', date: '2026-11-16', desc: 'Dentist check-up — Maya', cat: 'health', amount: 42.00 },
      { id: 'e16', date: '2026-11-17', desc: 'Lunch out — Jon work', cat: 'dining', amount: 18.20 },
      { id: 'e17', date: '2026-11-18', desc: 'Kids swimming lessons', cat: 'kids', amount: 64.00 },
      { id: 'e18', date: '2026-11-19', desc: 'Fuel — family car', cat: 'transport', amount: 48.75 },
      { id: 'e19', date: '2026-11-20', desc: 'New kettle + baking tray', cat: 'shopping', amount: 54.90 },
      { id: 'e20', date: '2026-11-21', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 96.35 },
      { id: 'e21', date: '2026-11-22', desc: 'Streaming — movies & music', cat: 'fun', amount: 24.98 },
      { id: 'e22', date: '2026-11-23', desc: 'Birthday gift — Grandma', cat: 'other', amount: 38.00 },
      { id: 'e23', date: '2026-11-24', desc: 'Takeout — Thai night', cat: 'dining', amount: 41.60 },
      { id: 'e24', date: '2026-11-25', desc: 'Water bill', cat: 'utilities', amount: 56.80 },
      { id: 'e25', date: '2026-11-26', desc: 'Sofia art supplies', cat: 'kids', amount: 22.40 }
    ],
    '2026-10': [
      { id: 'o1', date: '2026-10-01', desc: 'Rent — Maple Court Apt 4B', cat: 'housing', amount: 1850 },
      { id: 'o2', date: '2026-10-03', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 131.20 },
      { id: 'o3', date: '2026-10-05', desc: 'City power & light', cat: 'utilities', amount: 124.60 },
      { id: 'o4', date: '2026-10-07', desc: 'Fuel — family car', cat: 'transport', amount: 55.10 },
      { id: 'o5', date: '2026-10-09', desc: 'Sofia piano lesson', cat: 'kids', amount: 45.00 },
      { id: 'o6', date: '2026-10-11', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 118.75 },
      { id: 'o7', date: '2026-10-13', desc: 'Internet & TV', cat: 'utilities', amount: 89.00 },
      { id: 'o8', date: '2026-10-15', desc: 'Dinner out — anniversary', cat: 'dining', amount: 86.40 },
      { id: 'o9', date: '2026-10-17', desc: 'Kids swimming lessons', cat: 'kids', amount: 64.00 },
      { id: 'o10', date: '2026-10-19', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 122.30 },
      { id: 'o11', date: '2026-10-21', desc: 'Pharmacy — vitamins', cat: 'health', amount: 31.20 },
      { id: 'o12', date: '2026-10-23', desc: 'Fuel — family car', cat: 'transport', amount: 49.80 },
      { id: 'o13', date: '2026-10-25', desc: 'Cinema + popcorn', cat: 'fun', amount: 52.00 },
      { id: 'o14', date: '2026-10-27', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 104.60 },
      { id: 'o15', date: '2026-10-29', desc: 'Sofia new school shoes', cat: 'shopping', amount: 58.00 },
      { id: 'o16', date: '2026-10-31', desc: 'Halloween pumpkins & treats', cat: 'fun', amount: 27.50 }
    ],
    '2026-12': [
      { id: 'd1', date: '2026-12-01', desc: 'Rent — Maple Court Apt 4B', cat: 'housing', amount: 1850 },
      { id: 'd2', date: '2026-12-02', desc: 'GreenMart weekly shop', cat: 'groceries', amount: 138.40 },
      { id: 'd3', date: '2026-12-04', desc: 'City power & light', cat: 'utilities', amount: 131.20 }
    ],
    '2026-06': [], '2026-07': [], '2026-08': [], '2026-09': []
  },
  // Monthly totals for the months that only have summary history (used by the 6-month chart).
  history: {
    '2026-06': { income: 6750, spent: 5880 },
    '2026-07': { income: 6790, spent: 6120 },
    '2026-08': { income: 6710, spent: 6340 },
    '2026-09': { income: 6770, spent: 6010 }
  },
  bills: [
    { id: 'b1', name: 'Rent — Maple Court', amount: 1850, due: 1, freq: 'Monthly', cat: 'housing', autopay: true },
    { id: 'b2', name: 'City power & light', amount: 118.40, due: 3, freq: 'Monthly', cat: 'utilities', autopay: true },
    { id: 'b3', name: 'Internet & TV', amount: 89.00, due: 10, freq: 'Monthly', cat: 'utilities', autopay: true },
    { id: 'b4', name: 'Mobile phones (2 lines)', amount: 74.00, due: 12, freq: 'Monthly', cat: 'utilities', autopay: true },
    { id: 'b5', name: 'Home insurance', amount: 62.50, due: 15, freq: 'Monthly', cat: 'housing', autopay: true },
    { id: 'b6', name: 'Car insurance', amount: 96.00, due: 18, freq: 'Monthly', cat: 'transport', autopay: true },
    { id: 'b7', name: 'Water bill', amount: 56.80, due: 25, freq: 'Monthly', cat: 'utilities', autopay: false },
    { id: 'b8', name: 'Streaming — movies & music', amount: 24.98, due: 21, freq: 'Monthly', cat: 'fun', autopay: true },
    { id: 'b9', name: 'Gym membership', amount: 39.00, due: 5, freq: 'Monthly', cat: 'health', autopay: true },
    { id: 'b10', name: 'Sofia piano lessons', amount: 180.00, due: 8, freq: 'Monthly', cat: 'kids', autopay: false }
  ],
  // Which bills are already paid in the current month (Nov 2026 seed state).
  billsPaid: { '2026-11': ['b1', 'b2', 'b9'] },
  goals: [
    { id: 'g1', name: 'Emergency fund', target: 10000, saved: 4200, note: '6 months of essentials' },
    { id: 'g2', name: 'Family summer trip', target: 3000, saved: 1850, note: 'Beach cottage, July 2027' },
    { id: 'g3', name: 'Next family car', target: 12000, saved: 7400, note: 'Replace the 2014 hatchback' },
    { id: 'g4', name: 'Kids college fund', target: 5000, saved: 2300, note: 'Top up $150 a month' }
  ],
  tips: [
    { title: 'Groceries are $134 under budget', body: 'Four weekly shops averaged $121. Keep the list habit and the surplus rolls into the trip fund.' },
    { title: 'Dining is creeping up', body: 'Takeout is $94 this month. One home-cooked Friday a month saves about $45.' },
    { title: 'Shopping is $23 over', body: 'The coat and kettle were one-offs. No action needed unless December repeats it.' }
  ]
};
