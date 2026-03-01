/* ═══════════════════════════════════════════════════════════
   RAMADAN TRACKER PWA — app.js
   All logic: data, state, rendering, navigation, install prompt
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PRAYERS = ['S', 'Z', 'A', 'M', 'I']; // Subhi, Zuhr, Asr, Maghrib, Isha

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
];

const HIJRI_MONTHS_AR = [
  '\u0645\u064f\u062d\u064e\u0631\u064e\u0651\u0645', '\u0635\u064e\u0641\u064e\u0631', '\u0631\u064e\u0628\u0650\u064a\u0639 \u0627\u0644\u0623\u064e\u0648\u064e\u0651\u0644', '\u0631\u064e\u0628\u0650\u064a\u0639 \u0627\u0644\u062b\u064e\u0651\u0627\u0646\u0650\u064a',
  '\u062c\u064f\u0645\u064e\u0627\u062f\u064e\u0649 \u0627\u0644\u0623\u064f\u0648\u0644\u064e\u0649', '\u062c\u064f\u0645\u064e\u0627\u062f\u064e\u0649 \u0627\u0644\u062b\u064e\u0651\u0627\u0646\u0650\u064a\u064e\u0629', '\u0631\u064e\u062c\u064e\u0628', '\u0634\u064e\u0639\u0652\u0628\u064e\u0627\u0646',
  '\u0631\u064e\u0645\u064e\u0636\u064e\u0627\u0646', '\u0634\u064e\u0648\u064e\u0651\u0627\u0644', '\u0630\u064f\u0648 \u0627\u0644\u0642\u064e\u0639\u0652\u062f\u064e\u0629', '\u0630\u064f\u0648 \u0627\u0644\u062d\u0650\u062c\u064e\u0651\u0629',
];

const DEFAULT_IBADAH_CATEGORIES = [
  { id: 'solat_jamah',   label: 'Ṣolat in Jamah',         type: 'prayers',  expectedTotal: 5,   group: 'Ṣolat' },
  { id: 'rawatib',       label: 'Rawātib',                 type: 'prayers',  expectedTotal: 5,   group: 'Ṣolat' },
  { id: 'adhkar_solat',  label: 'Adhkār after Ṣolat',     type: 'prayers',  expectedTotal: 5,   group: 'Ṣolat' },
  { id: 'tarawih',       label: 'Tarāwīh',                 type: 'boolean',  expectedTotal: 1,   group: 'Ṣolat' },
  { id: 'ties_kinship',  label: 'Ties of Kinship',         type: 'boolean',  expectedTotal: 1,   group: 'Character' },
  { id: 'quran',         label: 'Qur\'ān',                 type: 'quran',    expectedTotal: { tilawah: 30, tadabbur: 30, hifz: 30 }, group: 'Qur\'ān' },
  { id: 'dua',           label: 'Du\'ā\'',                 type: 'morning_evening', expectedTotal: 2, group: 'Dhikr' },
  { id: 'adhkar_me',     label: 'Adhkār (Morning/Evening)',type: 'morning_evening', expectedTotal: 2, group: 'Dhikr' },
  { id: 'iftar_saim',    label: 'Iftār Ṣā\'im',           type: 'boolean',  expectedTotal: 1,   group: 'Charity' },
  { id: 'sadaqah',       label: 'Ṣadaqah',                type: 'boolean',  expectedTotal: 1,   group: 'Charity' },
];

const DEFAULT_VICES = [
  { id: 'lying',       icon: '🤥', name: 'Lying',              tip: 'Pause before speaking — is it true?' },
  { id: 'backbiting',  icon: '👂', name: 'Backbiting',         tip: 'If you wouldn\'t say it to their face, don\'t say it.' },
  { id: 'anger',       icon: '😡', name: 'Anger',              tip: 'Say A\'ūdhu billāh and change position.' },
  { id: 'waste_time',  icon: '⏱️', name: 'Wasting Time',       tip: 'Replace idle time with dhikr or Qur\'ān.' },
  { id: 'bad_food',    icon: '🍔', name: 'Excessive Eating',   tip: 'Eat to one-third capacity at Iftār.' },
  { id: 'bad_eyes',    icon: '👁️', name: 'Lowering the Gaze',  tip: 'Lower your gaze immediately and make istighfār.' },
  { id: 'social_media',icon: '📱', name: 'Excessive Screens',  tip: 'Set a 30-minute limit and use app timers.' },
];

const LIFE_HABITS = [
  'Wake for Fajr on time',
  'Exercise / walk',
  'Gratitude journal',
  'No backbiting',
  'Read / learn something',
  'Call a family member',
  'Give sadaqah',
  'Avoid wasting time',
  'Sleep before midnight',
  'Make du\'ā\' for others',
];

const REMINDERS_DEFAULT = [
  { id: 'suhoor',    icon: '🌙', name: 'Suhoor',            time: '04:00', on: true  },
  { id: 'fajr',      icon: '🌅', name: 'Fajr',              time: '05:15', on: true  },
  { id: 'duha',      icon: '☀️', name: 'Ṣolat Duha',        time: '08:00', on: false },
  { id: 'dhuhr',     icon: '🕛', name: 'Dhuhr',             time: '13:00', on: true  },
  { id: 'asr',       icon: '🕓', name: 'Asr',               time: '16:15', on: true  },
  { id: 'iftar',     icon: '🌇', name: 'Iftār',             time: '19:00', on: true  },
  { id: 'maghrib',   icon: '🌆', name: 'Maghrib',           time: '19:10', on: true  },
  { id: 'isha',      icon: '🌃', name: 'Isha',              time: '20:30', on: true  },
  { id: 'tarawih',   icon: '🕌', name: 'Tarāwīh',           time: '21:00', on: false },
  { id: 'quran',     icon: '📖', name: 'Qur\'ān Recitation',time: '22:00', on: false },
  { id: 'tahajjud',  icon: '⭐', name: 'Tahajjud',          time: '03:30', on: false },
];

const THEMES = [
  {
    id: 'forest_green',
    name: 'Forest Green',
    emoji: '🌿',
    description: 'Clean white with rich forest green — Al-Quran style',
    swatches: ['#F8FAF8','#EDF3ED','#2E7D32','#00796B','#A0392B'],
  },
  {
    id: 'desert_sand',
    name: 'Desert Sand',
    emoji: '🏕️',
    description: 'Warm parchment — soft and easy on the eyes',
    swatches: ['#F5ECD7','#EDE0C4','#8B5E3C','#4A7C59','#A0392B'],
  },
  {
    id: 'navy_gold',
    name: 'Navy & Gold',
    emoji: '🌙',
    description: 'Classic deep navy with golden accents',
    swatches: ['#09121C','#0F1E2E','#C9A84C','#27AE60','#C0392B'],
  },
  {
    id: 'midnight_purple',
    name: 'Night Mode',
    emoji: '🌃',
    description: 'Deep purple — ideal for night-time use',
    swatches: ['#0D0A1A','#1A1530','#A78BFA','#34D399','#F87171'],
  },
];

// ─── DHIKR DEFINITIONS ───────────────────────────────────────────────────────

const DEFAULT_DHIKR = [
  { id: 'tasbih',  label: 'Tasbīḥ',              arabic: 'سُبْحَانَ اللَّهِ',                     transliteration: 'SubḥānAllāh',                    defaultTarget: 100 },
  { id: 'tahmeed', label: 'Taḥmīd',              arabic: 'الْحَمْدُ لِلَّهِ',                     transliteration: 'Alḥamdulillāh',                  defaultTarget: 100 },
  { id: 'tahleel', label: 'Tahlīl',               arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',           transliteration: 'Lā ilāha illAllāh',               defaultTarget: 100 },
  { id: 'takbeer', label: 'Takbīr',               arabic: 'اللَّهُ أَكْبَرُ',                     transliteration: 'Allāhu Akbar',                    defaultTarget: 100 },
  { id: 'salawat', label: 'Ṣalāt on the Prophet', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',   transliteration: 'Allāhumma ṣalli ʿalā Muḥammad',  defaultTarget: 100 },
];

const DHIKR_TARGET_OPTIONS = [100, 200, 300, 500, 700, 1000];
const DHIKR_INTERVAL_OPTIONS = [1, 2, 5, 10, 15, 20, 30, 45, 60];

// ─── GUIDE SECTIONS (13 sections) ────────────────────────────────────────────

const GUIDE_SECTIONS = [
  {
    id: 'overview', icon: '🌙', color: '#C9A84C',
    title: 'Welcome to Ramadan Tracker', subtitle: 'Your personal Ramadan companion',
    steps: [
      'Ramadan Tracker helps you log, measure, and improve your ibadah across all 30 days of Ramadan.',
      'All data is stored privately on your device — no account or internet connection is required.',
      'Navigate using the 5 tabs at the bottom: Home, Log, Life, Scores, and More.',
      'Your progress is saved automatically every time you make a change.',
    ],
    tip: 'Start by logging Day 1 from the Home screen — tap the green "Log Today" button.',
  },
  {
    id: 'setup', icon: '📅', color: '#C9A84C',
    title: 'First-Time Setup', subtitle: 'Set your Ramadan start date',
    steps: [
      'On first launch, tap "Set Ramadan Start Date" on the Home screen.',
      'Select the date when Ramadan Day 1 began for your local moon-sighting (e.g. 18 Feb 2026).',
      'The app will then automatically calculate today\'s Ramadan day number from your device clock.',
      'For example, if you set Day 1 as 18 Feb 2026, opening the app on 1 Mar 2026 will show Day 12.',
      'You can change the start date at any time by tapping the "📅 Set Start Date" button on the Home screen.',
    ],
    tip: 'This one-time setup ensures the app always opens on the correct day — no manual day selection needed.',
  },
  {
    id: 'home', icon: '🏠', color: '#C9A84C',
    title: 'Home Screen', subtitle: 'Your daily dashboard',
    steps: [
      'The Home screen shows the current Hijri date (e.g. "12 Ramadan 1446 AH") and the Gregorian date side by side.',
      'Tap "Adjust" on the date card to shift the Hijri date by ±days to match your local moon-sighting authority.',
      'Your overall ibadah score and category progress grid are shown below the date card.',
      'Tap "Log Today" to jump directly to today\'s daily log entry.',
      'The 30-day selector at the bottom lets you tap any day to open or review its log.',
    ],
    tip: 'The score updates live as you log each day — watch your percentage climb!',
  },
  {
    id: 'log', icon: '📝', color: '#27AE60',
    title: 'Daily Log', subtitle: 'Record your ibadah for each day',
    steps: [
      'The Log tab shows all ibadah categories for the selected day.',
      'Use the day selector at the top to switch between days 1–30.',
      'For prayer categories (Ṣolat in Jamah, Rawātib, Adhkār after Ṣolat), tap each prayer abbreviation to mark it done: S=Subhi, Z=Zuhr, A=Asr, M=Maghrib, I=Isha.',
      'For simple yes/no categories (Tarāwīh, Ṣadaqah, etc.), tap the toggle to mark as done.',
      'For the Qur\'ān section, enter the number of juz\' read and toggle Tadabbur and Hifz.',
      'For Morning/Evening categories (Du\'ā\', Adhkār), tap M for Morning and E for Evening.',
      'Custom ibadah categories you create appear at the bottom of the list.',
      'The Dhikr section at the bottom of the Log lets you count Tasbīḥ, Taḥmīd, Tahlīl, Takbīr, and Ṣalāt on the Prophet for that day.',
      'Use the ‹ and › arrows at the top of the Log screen to navigate between days, or tap "Today" to jump back.',
    ],
    tip: 'You can go back and edit any previous day at any time — nothing is locked.',
  },
  {
    id: 'life', icon: '🌿', color: '#27AE60',
    title: 'Life Tracker', subtitle: 'Build positive daily habits',
    steps: [
      'The Life tab tracks 10 daily habits such as waking for Fajr, exercise, gratitude, and avoiding gossip.',
      'Use the day selector at the top to choose which day to log.',
      'Tap the checkbox next to each habit to mark it as completed for that day.',
      'Your current streak (consecutive days with all habits completed) is shown at the top.',
      'The progress bar shows how many habits you completed today out of 10.',
    ],
    tip: 'Consistency is key — even completing 5 out of 10 habits every day builds powerful momentum.',
  },
  {
    id: 'scores', icon: '📊', color: '#C9A84C',
    title: 'Scores & Evaluation', subtitle: 'See your full Ramadan report',
    steps: [
      'The Scores tab gives you a full breakdown of your ibadah performance across all 30 days.',
      'Each category shows your score, the maximum possible, and a percentage.',
      'Scores are colour-coded: green (≥71%) = Excellent, amber (51–70%) = Good, red (≤50%) = Needs Improvement.',
      'The overall grade at the top summarises your entire Ramadan performance.',
      'Use this screen at the end of Ramadan to reflect on your journey and identify areas to improve.',
    ],
    tip: 'Aim for green across all categories — but remember, consistency matters more than perfection.',
  },
  {
    id: 'vices', icon: '⚠️', color: '#C0392B',
    title: 'Vices Log', subtitle: 'Accountability for sins & bad habits',
    steps: [
      'The Vices Log (found in More) helps you track incidents of sins or bad habits during Ramadan.',
      'Each vice shows a counter — tap "+" to record an incident for today.',
      'A tip is shown for each vice to help you avoid it.',
      'The goal is zero incidents — use this as a tool for honest self-accountability, not self-punishment.',
      'Add your own custom vices via More → Custom Vices.',
    ],
    tip: 'Seeing your vice count go down day by day is one of the most powerful motivators in this app.',
  },
  {
    id: 'todos', icon: '✅', color: '#27AE60',
    title: 'To-Do List', subtitle: 'Manage Ramadan tasks and goals',
    steps: [
      'The To-Do screen (found in More) lets you create tasks with High, Medium, or Low priority.',
      'Tap the "+" button to add a new task and select its priority level.',
      'Tap a task to mark it as done — completed tasks move to the bottom.',
      'Use the filter buttons (All / Active / Done) to focus on what matters.',
      'A progress bar at the top shows how many tasks you have completed.',
    ],
    tip: 'Use this for Ramadan goals like "Finish one juz\' per day", "Call parents every day", or "Give sadaqah weekly".',
  },
  {
    id: 'reminders', icon: '🔔', color: '#C9A84C',
    title: 'Reminders', subtitle: 'Never miss a prayer or ibadah',
    steps: [
      'The Reminders screen (found in More) has 11 preset reminders for prayers and ibadah.',
      'Toggle any reminder on or off using the switch on the right.',
      'Tap the time next to a reminder to edit it and set your local prayer times.',
      'Reminders include: Suhoor, Fajr, Ṣolat Duha, Dhuhr, Asr, Iftār, Maghrib, Isha, Tarāwīh, Qur\'ān recitation, and Tahajjud.',
      'Note: Reminders require notification permissions to be granted on your device.',
    ],
    tip: 'Set your local prayer times accurately — the default times are approximate only.',
  },
  {
    id: 'grid', icon: '📅', color: '#6B8FA8',
    title: '30-Day Grid', subtitle: 'See your full Ramadan at a glance',
    steps: [
      'The 30-Day Grid (found in More) shows every ibadah category across all 30 days in a scrollable table.',
      'Each cell is colour-coded: green = completed, red = missed, grey = not yet logged.',
      'Scroll horizontally to see all categories, and vertically to see all 30 days.',
      'Use this screen to spot patterns — for example, which prayers you consistently miss.',
    ],
    tip: 'The grid is most useful in the second half of Ramadan when you have enough data to see trends.',
  },
  {
    id: 'dhikr_counter', icon: '📿', color: '#27AE60',
    title: 'Daily Dhikr Counter', subtitle: 'Track your daily dhikr targets',
    steps: [
      'Open the Log tab and scroll to the bottom to find the Dhikr section.',
      'Five dhikr are tracked: Tasbīḥ (سبحان الله), Taḥmīd (الحمد لله), Tahlīl (لا إله إلا الله), Takbīr (الله أكبر), and Ṣalāt on the Prophet.',
      'Tap the large "+1" button on each card to count one recitation.',
      'Set your daily target (100, 200, 300, 500, 700, or 1000) by tapping the "Target ▾" button on each card.',
      'A progress bar fills as you count. The card border turns green when you reach your target.',
      'Counts are saved per day — you can review any previous day\'s dhikr count from the Log screen.',
    ],
    tip: 'Start with a target of 100 for each dhikr and gradually increase as you build the habit.',
  },
  {
    id: 'dhikr_reminder', icon: '🎙️', color: '#27AE60',
    title: 'Dhikr Voice Reminders', subtitle: 'Hear dhikr prompts at regular intervals',
    steps: [
      'Go to More → Dhikr Reminders to set up rotating audio dhikr prompts.',
      'Toggle "Enable Dhikr Reminders" to start the rotation. The app will play each dhikr in sequence at your chosen interval.',
      'Set the interval (1–60 minutes) using the row of time buttons. Default is 10 minutes.',
      'The active dhikr card is highlighted with a green border and a "▶ Playing" badge.',
      'The app uses your browser\'s text-to-speech to read the dhikr aloud in Arabic.',
      'Keep the app open (screen can be locked) for reminders to continue playing.',
    ],
    tip: 'Set the interval to match your natural rhythm — 10 minutes works well during general daily activities.',
  },
  {
    id: 'hijri_calendar', icon: '🗓️', color: '#6B8FA8',
    title: 'Hijri Calendar', subtitle: 'Full Islamic year with Gregorian dates',
    steps: [
      'Go to More → Hijri Calendar to view the full Islamic year from Muharram to Dhul-Hijjah.',
      'Each month card shows the Hijri month name, the number of days (29 or 30), and the corresponding Gregorian date range.',
      'Ramadan is highlighted with a special banner and a crescent icon.',
      'Key Islamic dates (e.g. 1 Muharram, 10 Muharram, 12 Rabi\' al-Awwal, 27 Rajab, Eid al-Fitr, Eid al-Adha) are marked within each month.',
      'Use the year navigation arrows at the top to browse previous or future Hijri years.',
    ],
    tip: 'The Hijri Calendar is calculated using the Kuwaiti/Fourmilab tabular algorithm for sequential, accurate dates.',
  },
  {
    id: 'theme', icon: '🎨', color: '#A78BFA',
    title: 'Choose Theme', subtitle: 'Personalise your app appearance',
    steps: [
      'Go to More → Choose Theme to change the colour scheme of the entire app.',
      'Four themes are available: Forest Green (default, clean white with green), Desert Sand (warm parchment), Navy & Gold (classic dark), and Night Mode (deep purple for night-time use).',
      'Tap "Apply Theme" on any theme card to switch instantly — no restart needed.',
      'Your theme preference is saved and will be remembered the next time you open the app.',
      'Each theme card shows a colour swatch row and a mini preview so you can see the look before applying.',
    ],
    tip: 'Switch to Night Mode in the evenings for a comfortable dark experience during Tarāwīh and Tahajjud.',
  },
];

// ─── STATE ────────────────────────────────────────────────────────────────────

let state = {
  selectedDay: 1,
  logSelectedDay: 1,
  lifeSelectedDay: 1,
  activeTab: 'home',
  activeSubScreen: null,
  todoFilter: 'all',
  editingIbadahId: null,
  editingViceId: null,
  dhikrReminderEnabled: true,
  dhikrReminderInterval: 10,
  dhikrReminderIndex: 0,
  dhikrReminderTimer: null,
  dhikrShowTargetPicker: null, // dhikr id showing target picker
};

let data = {
  days: {},          // { 'day_1': { solat_jamah: [...], ... }, ... }
  dhikrDays: {},     // { 'day_1': { counts: {tasbih:87,...}, targets: {tasbih:100,...} }, ... }
  lifeDays: {},      // { 'day_1': [true, false, ...], ... }
  viceDays: {},      // { 'day_1': { lying: 2, ... }, ... }
  todos: [],         // [{ id, text, priority, done }]
  reminders: [],     // [{ id, name, icon, time, on }]
  customIbadah: [],  // [{ id, label, group }]
  customVices: [],   // [{ id, name, icon, tip }]
  theme: 'forest_green',
  hijriOffset: 0,
  ramadanStartDate: null, // ISO string e.g. '2026-02-18'
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function save() {
  localStorage.setItem('rt_data', JSON.stringify(data));
}

function load() {
  try {
    const raw = localStorage.getItem('rt_data');
    if (raw) {
      const saved = JSON.parse(raw);
      data = { ...data, ...saved };
    }
  } catch (e) { /* ignore */ }
  // Ensure reminders have defaults
  if (!data.reminders || data.reminders.length === 0) {
    data.reminders = JSON.parse(JSON.stringify(REMINDERS_DEFAULT));
  }
  // Ensure dhikrDays exists
  if (!data.dhikrDays) data.dhikrDays = {};
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function dayKey(d) { return `day_${d}`; }

function allCategories() {
  return [
    ...DEFAULT_IBADAH_CATEGORIES,
    ...data.customIbadah.map(c => ({
      id: `custom_${c.id}`,
      label: c.label,
      type: 'boolean',
      expectedTotal: 30,
      group: c.group || 'Custom',
    })),
  ];
}

function allVices() {
  return [
    ...DEFAULT_VICES,
    ...data.customVices.map(v => ({
      id: `custom_${v.id}`,
      icon: v.icon || '❓',
      name: v.name,
      tip: v.tip || '',
    })),
  ];
}

function calcDayScore(dayData, cat) {
  if (!dayData) return 0;
  const val = dayData[cat.id];
  if (!val) return 0;
  if (cat.type === 'prayers') {
    return Array.isArray(val) ? val.filter(Boolean).length : 0;
  }
  if (cat.type === 'boolean') return val ? 1 : 0;
  if (cat.type === 'morning_evening') {
    return (val.morning ? 1 : 0) + (val.evening ? 1 : 0);
  }
  if (cat.type === 'quran') {
    return (parseFloat(val.tilawah) || 0) + (val.tadabbur ? 1 : 0) + (val.hifz ? 1 : 0);
  }
  return 0;
}

function calcCategoryTotal(cat) {
  let total = 0;
  for (let d = 1; d <= 30; d++) {
    total += calcDayScore(data.days[dayKey(d)], cat);
  }
  return total;
}

function categoryExpected(cat) {
  if (cat.type === 'quran') {
    const e = cat.expectedTotal;
    return e.tilawah + e.tadabbur + e.hifz;
  }
  if (cat.type === 'prayers' || cat.type === 'morning_evening') {
    return (cat.expectedTotal || 1) * 30;
  }
  return (cat.expectedTotal || 1) * 30;
}

function gradeColor(pct) {
  if (pct >= 71) return 'var(--success)';
  if (pct >= 51) return 'var(--warning)';
  return 'var(--error)';
}

function gradeLabel(pct) {
  if (pct >= 71) return 'Excellent ✨';
  if (pct >= 51) return 'Good 👍';
  return 'Needs Improvement 📈';
}

function pct(score, exp) {
  return exp > 0 ? Math.min(100, Math.round((score / exp) * 100)) : 0;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── RAMADAN DAY CALCULATION ──────────────────────────────────────────────────

function computeTodayRamadanDay() {
  if (!data.ramadanStartDate) return null;
  const start = new Date(data.ramadanStartDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const day = diffDays + 1;
  if (day < 1 || day > 30) return null;
  return day;
}

function getTodayRamadanDay() {
  const computed = computeTodayRamadanDay();
  if (computed !== null) return computed;
  // Fallback: count logged days + 1
  const loggedDays = Object.keys(data.days).filter(k => {
    const d = data.days[k];
    return d && Object.keys(d).length > 0;
  }).length;
  return Math.min(loggedDays + 1, 30);
}

// ─── THEME ────────────────────────────────────────────────────────────────────

function applyTheme(themeId) {
  data.theme = themeId;
  document.documentElement.setAttribute('data-theme', themeId);
  save();
  renderThemePicker();
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

const TAB_SCREENS = ['home', 'log', 'life', 'scores', 'more'];
const SUB_SCREENS = ['vices', 'todos', 'reminders', 'grid', 'custom-ibadah', 'custom-vices', 'theme-picker', 'user-guide', 'hijri-calendar', 'dhikr-reminders'];

function switchTab(tab) {
  state.activeTab = tab;
  state.activeSubScreen = null;

  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Show tab screen
  document.getElementById(`screen-${tab}`).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  // Show tab bar
  document.getElementById('tab-bar').style.display = 'flex';

  // Render the active screen
  renderScreen(tab);
}

function navigate(subScreen) {
  state.activeSubScreen = subScreen;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${subScreen}`).classList.add('active');

  // Hide tab bar for sub-screens
  document.getElementById('tab-bar').style.display = 'none';

  renderScreen(subScreen);
}

function renderScreen(name) {
  switch (name) {
    case 'home':             renderHome(); break;
    case 'log':              renderLog(); break;
    case 'life':             renderLife(); break;
    case 'scores':           renderScores(); break;
    case 'vices':            renderVices(); break;
    case 'todos':            renderTodos(); break;
    case 'reminders':        renderReminders(); break;
    case 'grid':             renderGrid(); break;
    case 'custom-ibadah':    renderCustomIbadah(); break;
    case 'custom-vices':     renderCustomVices(); break;
    case 'theme-picker':     renderThemePicker(); break;
    case 'user-guide':       renderUserGuide(); break;
    case 'hijri-calendar':   renderHijriCalendar(); break;
    case 'dhikr-reminders':  renderDhikrReminders(); break;
  }
}

// ─── DAY SELECTOR ─────────────────────────────────────────────────────────────

function renderDaySelector(containerId, selectedDay, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const today = getTodayRamadanDay();

  let html = '';
  for (let d = 1; d <= 30; d++) {
    const hasData = data.days[dayKey(d)] && Object.keys(data.days[dayKey(d)]).length > 0;
    const isToday = d === today;
    const isSelected = d === selectedDay;
    let cls = 'day-btn';
    if (hasData) cls += ' has-data';
    if (isToday) cls += ' today';
    if (isSelected && !isToday) cls += ' today'; // highlight selected
    html += `<button class="${cls}" onclick="${onSelect}(${d})">${d}</button>`;
  }
  container.innerHTML = html;
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

function renderHome() {
  const cats = allCategories();
  let totalScore = 0, totalExp = 0;
  const tiles = [];

  cats.forEach(cat => {
    const score = calcCategoryTotal(cat);
    const exp = categoryExpected(cat);
    totalScore += score;
    totalExp += exp;
    tiles.push({ id: cat.id, label: cat.label, pct: pct(score, exp) });
  });

  const overallPct = pct(totalScore, totalExp);
  const color = gradeColor(overallPct);

  const today = getTodayRamadanDay();
  const loggedDays = Object.keys(data.days).filter(k => {
    const d = data.days[k];
    return d && Object.keys(d).length > 0;
  }).length;

  document.getElementById('home-day-label').textContent = `Day ${today} of Ramadan`;
  document.getElementById('home-logged-label').textContent = `${loggedDays} day${loggedDays !== 1 ? 's' : ''} logged`;
  document.getElementById('home-score-pct').textContent = `${overallPct}%`;
  document.getElementById('home-score-pct').style.color = color;
  document.getElementById('home-score-grade').textContent = gradeLabel(overallPct);
  document.getElementById('home-score-grade').style.color = color;
  document.getElementById('home-score-bar').style.width = `${overallPct}%`;
  document.getElementById('home-score-bar').style.background = color;
  document.getElementById('home-score-pts').textContent = `${Math.round(totalScore)} / ${totalExp} pts`;
  document.getElementById('home-score-card').style.borderColor = color;

  // Ramadan start date section
  const startDateEl = document.getElementById('home-start-date-info');
  if (startDateEl) {
    if (data.ramadanStartDate) {
      const d = new Date(data.ramadanStartDate);
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      startDateEl.innerHTML = `<span style="color:var(--muted);font-size:13px">Ramadan starts: <strong style="color:var(--primary)">${label}</strong></span>`;
    } else {
      startDateEl.innerHTML = `<span style="color:var(--warning);font-size:13px">⚠️ Ramadan start date not set</span>`;
    }
  }

  // Tiles
  const tilesHtml = tiles.map(t => {
    const c = gradeColor(t.pct);
    return `
      <div class="tile">
        <div class="tile-label">${t.label}</div>
        <div class="tile-pct" style="color:${c}">${t.pct}%</div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${t.pct}%;background:${c}"></div></div>
      </div>`;
  }).join('');
  document.getElementById('home-tiles').innerHTML = tilesHtml;

  // Day selector
  renderDaySelector('home-day-selector', today, 'openLogDay');

  // Dual date display
  updateHomeDates();
}

function openLogDay(d) {
  state.logSelectedDay = d;
  switchTab('log');
}

document.getElementById('home-log-today-btn').addEventListener('click', () => {
  state.logSelectedDay = getTodayRamadanDay();
  switchTab('log');
});

document.getElementById('home-set-start-date-btn').addEventListener('click', () => {
  openRamadanStartDateModal();
});

// ─── RAMADAN START DATE MODAL ─────────────────────────────────────────────────

let startDateTemp = { year: 2026, month: 2, day: 18 };

function openRamadanStartDateModal() {
  if (data.ramadanStartDate) {
    const d = new Date(data.ramadanStartDate);
    startDateTemp = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  } else {
    const today = new Date();
    startDateTemp = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }
  renderStartDateModal();
  showModal('modal-start-date');
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function renderStartDateModal() {
  const dim = daysInMonth(startDateTemp.year, startDateTemp.month);
  if (startDateTemp.day > dim) startDateTemp.day = dim;

  const isoStr = `${startDateTemp.year}-${String(startDateTemp.month).padStart(2,'0')}-${String(startDateTemp.day).padStart(2,'0')}`;
  const previewEl = document.getElementById('start-date-preview');
  if (previewEl) {
    const d = new Date(isoStr);
    const h = gregorianToHijri(d, data.hijriOffset || 0);
    previewEl.textContent = `${d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} = ${h.day} ${h.monthName} ${h.year} AH`;
  }

  const dayEl = document.getElementById('sd-day-val');
  const monthEl = document.getElementById('sd-month-val');
  const yearEl = document.getElementById('sd-year-val');
  if (dayEl) dayEl.textContent = startDateTemp.day;
  if (monthEl) monthEl.textContent = MONTH_NAMES[startDateTemp.month - 1];
  if (yearEl) yearEl.textContent = startDateTemp.year;
}

function sdChangeDay(delta) {
  const dim = daysInMonth(startDateTemp.year, startDateTemp.month);
  startDateTemp.day = Math.max(1, Math.min(dim, startDateTemp.day + delta));
  renderStartDateModal();
}

function sdChangeMonth(delta) {
  startDateTemp.month += delta;
  if (startDateTemp.month < 1) { startDateTemp.month = 12; startDateTemp.year--; }
  if (startDateTemp.month > 12) { startDateTemp.month = 1; startDateTemp.year++; }
  renderStartDateModal();
}

function sdChangeYear(delta) {
  startDateTemp.year += delta;
  renderStartDateModal();
}

function saveRamadanStartDate() {
  const isoStr = `${startDateTemp.year}-${String(startDateTemp.month).padStart(2,'0')}-${String(startDateTemp.day).padStart(2,'0')}`;
  data.ramadanStartDate = isoStr;
  // Auto-set logSelectedDay to today's Ramadan day
  const today = computeTodayRamadanDay();
  if (today !== null) {
    state.logSelectedDay = today;
    state.logSelectedDay = today;
  }
  save();
  closeModal('modal-start-date');
  renderHome();
}

// ─── DAILY LOG SCREEN ─────────────────────────────────────────────────────────

function setLogDay(d) {
  state.logSelectedDay = d;
  renderLog();
}

function renderLog() {
  const day = state.logSelectedDay;
  const today = getTodayRamadanDay();
  const isToday = day === today;

  // Header
  const titleEl = document.getElementById('log-day-title');
  if (titleEl) {
    titleEl.innerHTML = `Day ${day}${isToday ? ' <span class="today-badge">TODAY</span>' : ''}`;
  }

  // Nav buttons
  const prevBtn = document.getElementById('log-prev-btn');
  const nextBtn = document.getElementById('log-next-btn');
  const goTodayBtn = document.getElementById('log-go-today-btn');
  if (prevBtn) prevBtn.disabled = day <= 1;
  if (nextBtn) nextBtn.disabled = day >= 30;
  if (goTodayBtn) {
    goTodayBtn.style.display = isToday ? 'none' : 'block';
    goTodayBtn.textContent = `Go to Today (Day ${today})`;
  }

  renderDaySelector('log-day-selector', day, 'setLogDay');

  const cats = allCategories();
  const dayData = data.days[dayKey(day)] || {};
  let html = '';

  let currentGroup = null;
  cats.forEach(cat => {
    if (cat.group !== currentGroup) {
      currentGroup = cat.group;
      html += `<div class="section-title">${cat.group}</div>`;
    }

    html += `<div class="card" style="margin-bottom:8px">`;
    html += `<div style="font-size:14px;font-weight:700;color:var(--fg);margin-bottom:8px">${cat.label}</div>`;

    if (cat.type === 'prayers') {
      const val = dayData[cat.id] || [false, false, false, false, false];
      html += `<div class="prayer-btn-row">`;
      PRAYERS.forEach((p, i) => {
        const done = val[i] ? 'done' : '';
        html += `<button class="prayer-btn ${done}" onclick="togglePrayer('${cat.id}',${i})">${p}</button>`;
      });
      html += `</div>`;
    } else if (cat.type === 'boolean') {
      const val = dayData[cat.id] || false;
      html += `<label class="toggle">
        <input type="checkbox" ${val ? 'checked' : ''} onchange="toggleBoolean('${cat.id}',this.checked)">
        <div class="toggle-track"></div>
      </label>`;
    } else if (cat.type === 'morning_evening') {
      const val = dayData[cat.id] || { morning: false, evening: false };
      html += `<div class="prayer-btn-row">
        <button class="prayer-btn ${val.morning ? 'done' : ''}" onclick="toggleME('${cat.id}','morning')">M</button>
        <button class="prayer-btn ${val.evening ? 'done' : ''}" onclick="toggleME('${cat.id}','evening')">E</button>
      </div>`;
    } else if (cat.type === 'quran') {
      const val = dayData[cat.id] || { tilawah: '', tadabbur: false, hifz: false };
      html += `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div style="flex:1;min-width:120px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Juz\' read</div>
          <input type="number" min="0" max="30" step="0.5" value="${val.tilawah || ''}" 
            placeholder="0.0" style="width:100%"
            onchange="updateQuran('tilawah',this.value)">
        </div>
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Tadabbur</div>
          <button class="prayer-btn ${val.tadabbur ? 'done' : ''}" onclick="toggleQuran('tadabbur')">✓</button>
        </div>
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Hifz</div>
          <button class="prayer-btn ${val.hifz ? 'done' : ''}" onclick="toggleQuran('hifz')">✓</button>
        </div>
      </div>`;
    }

    html += `</div>`;
  });

  document.getElementById('log-categories').innerHTML = html;

  // Render dhikr section
  renderDhikrSection(day);
}

function getDayData() {
  const k = dayKey(state.logSelectedDay);
  if (!data.days[k]) data.days[k] = {};
  return data.days[k];
}

function togglePrayer(catId, idx) {
  const d = getDayData();
  if (!d[catId]) d[catId] = [false, false, false, false, false];
  d[catId][idx] = !d[catId][idx];
  save();
  renderLog();
}

function toggleBoolean(catId, val) {
  const d = getDayData();
  d[catId] = val;
  save();
}

function toggleME(catId, which) {
  const d = getDayData();
  if (!d[catId]) d[catId] = { morning: false, evening: false };
  d[catId][which] = !d[catId][which];
  save();
  renderLog();
}

function updateQuran(field, val) {
  const d = getDayData();
  if (!d['quran']) d['quran'] = { tilawah: '', tadabbur: false, hifz: false };
  d['quran'][field] = field === 'tilawah' ? parseFloat(val) || 0 : val;
  save();
}

function toggleQuran(field) {
  const d = getDayData();
  if (!d['quran']) d['quran'] = { tilawah: '', tadabbur: false, hifz: false };
  d['quran'][field] = !d['quran'][field];
  save();
  renderLog();
}

// ─── DHIKR COUNTER (in Daily Log) ────────────────────────────────────────────

function getDhikrDay(day) {
  const k = dayKey(day);
  if (!data.dhikrDays[k]) data.dhikrDays[k] = { counts: {}, targets: {} };
  return data.dhikrDays[k];
}

function renderDhikrSection(day) {
  const container = document.getElementById('log-dhikr-section');
  if (!container) return;

  const dhikrDay = getDhikrDay(day);

  let html = `
    <div style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:14px 16px;margin-bottom:8px">
      <div style="font-size:16px;font-weight:800;color:var(--fg)">📿 Daily Dhikr</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Tap anywhere on the card to count · set your target · track progress</div>
    </div>`;

  DEFAULT_DHIKR.forEach(item => {
    const count = (dhikrDay.counts[item.id] || 0);
    const target = (dhikrDay.targets[item.id] || item.defaultTarget);
    const progress = Math.min(count / target, 1);
    const done = count >= target;
    const showPicker = state.dhikrShowTargetPicker === item.id;

    html += `
      <div class="card" onclick="dhikrIncrement('${item.id}')" style="margin-bottom:8px;border-color:${done ? 'var(--success)' : 'var(--border)'};cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;active:opacity:0.8">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700;color:var(--fg);text-align:right;line-height:1.4;direction:rtl">${item.arabic}</div>
            <div style="font-size:12px;font-style:italic;color:var(--muted);margin-top:2px">${item.transliteration}</div>
            <div style="font-size:11px;color:var(--muted)">${item.label}</div>
          </div>
          ${done ? `<div style="background:var(--success);color:#fff;font-size:11px;font-weight:700;border-radius:8px;padding:3px 10px;margin-left:8px;align-self:flex-start">✓ Done</div>` : ''}
        </div>
        <div class="progress-bar-bg" style="margin-bottom:10px">
          <div class="progress-bar-fill" style="width:${progress*100}%;background:${done ? 'var(--success)' : 'var(--primary)'}"></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px" onclick="event.stopPropagation()">
          <button onclick="dhikrIncrement('${item.id}')" style="width:52px;height:52px;border-radius:26px;background:var(--primary);color:var(--bg);font-size:20px;font-weight:800;border:none;cursor:pointer;flex-shrink:0">+1</button>
          <div style="flex:1;display:flex;align-items:baseline;gap:4px">
            <span style="font-size:28px;font-weight:800;color:${done ? 'var(--success)' : 'var(--fg)'}">${count}</span>
            <span style="font-size:14px;color:var(--muted)">/ ${target}</span>
          </div>
          <button onclick="dhikrToggleTargetPicker('${item.id}');event.stopPropagation()" style="border:1px solid var(--border);border-radius:8px;padding:6px 10px;background:transparent;color:var(--primary);font-size:12px;font-weight:600;cursor:pointer">Target ▾</button>
          <button onclick="dhikrReset('${item.id}');event.stopPropagation()" style="border:1px solid var(--border);border-radius:8px;width:36px;height:36px;background:transparent;color:var(--muted);font-size:18px;cursor:pointer">↺</button>
        </div>
        ${showPicker ? `
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            ${DHIKR_TARGET_OPTIONS.map(t => `
              <button onclick="dhikrSetTarget('${item.id}',${t});event.stopPropagation()" style="border:1px solid var(--border);border-radius:8px;padding:6px 12px;background:${t === target ? 'var(--primary)' : 'var(--surface)'};color:${t === target ? 'var(--bg)' : 'var(--fg)'};font-size:13px;font-weight:600;cursor:pointer">${t}</button>
            `).join('')}
          </div>` : ''}
      </div>`;
  });

  container.innerHTML = html;
}

function dhikrIncrement(id) {
  const day = state.logSelectedDay;
  const dhikrDay = getDhikrDay(day);
  dhikrDay.counts[id] = (dhikrDay.counts[id] || 0) + 1;
  save();
  renderDhikrSection(day);
}

function dhikrReset(id) {
  const day = state.logSelectedDay;
  const dhikrDay = getDhikrDay(day);
  dhikrDay.counts[id] = 0;
  save();
  renderDhikrSection(day);
}

function dhikrToggleTargetPicker(id) {
  state.dhikrShowTargetPicker = state.dhikrShowTargetPicker === id ? null : id;
  renderDhikrSection(state.logSelectedDay);
}

function dhikrSetTarget(id, target) {
  const day = state.logSelectedDay;
  const dhikrDay = getDhikrDay(day);
  dhikrDay.targets[id] = target;
  state.dhikrShowTargetPicker = null;
  save();
  renderDhikrSection(day);
}

// ─── LIFE TRACKER ─────────────────────────────────────────────────────────────

function setLifeDay(d) {
  state.lifeSelectedDay = d;
  renderLife();
}

function renderLife() {
  renderDaySelector('life-day-selector', state.lifeSelectedDay, 'setLifeDay');

  const k = dayKey(state.lifeSelectedDay);
  const habits = data.lifeDays[k] || new Array(10).fill(false);

  // Streak
  let streak = 0;
  for (let d = state.lifeSelectedDay; d >= 1; d--) {
    const h = data.lifeDays[dayKey(d)] || [];
    if (h.every(Boolean) && h.length === 10) streak++;
    else break;
  }

  const doneCount = habits.filter(Boolean).length;
  document.getElementById('life-streak').textContent = `🔥 ${streak} day streak`;
  document.getElementById('life-progress-label').textContent = `${doneCount} / 10 habits today`;
  document.getElementById('life-progress-bar').style.width = `${(doneCount / 10) * 100}%`;

  let html = '';
  LIFE_HABITS.forEach((habit, i) => {
    const done = habits[i] || false;
    html += `
      <div class="habit-row">
        <div class="habit-check ${done ? 'done' : ''}" onclick="toggleHabit(${i})">${done ? '✓' : ''}</div>
        <div class="habit-label ${done ? 'done' : ''}">${habit}</div>
      </div>`;
  });
  document.getElementById('life-habits').innerHTML = html;
}

function toggleHabit(idx) {
  const k = dayKey(state.lifeSelectedDay);
  if (!data.lifeDays[k]) data.lifeDays[k] = new Array(10).fill(false);
  data.lifeDays[k][idx] = !data.lifeDays[k][idx];
  save();
  renderLife();
}

// ─── SCORES ───────────────────────────────────────────────────────────────────

function renderScores() {
  const cats = allCategories();
  let totalScore = 0, totalExp = 0;

  let html = '';
  cats.forEach(cat => {
    const score = calcCategoryTotal(cat);
    const exp = categoryExpected(cat);
    totalScore += score;
    totalExp += exp;
    const p = pct(score, exp);
    const color = gradeColor(p);
    html += `
      <div class="score-row">
        <div class="score-cat">${cat.label}</div>
        <div class="score-bar-wrap">
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${p}%;background:${color}"></div></div>
        </div>
        <div class="score-pct" style="color:${color}">${p}%</div>
      </div>`;
  });

  const overallPct = pct(totalScore, totalExp);
  const color = gradeColor(overallPct);

  document.getElementById('scores-overall-pct').textContent = `${overallPct}%`;
  document.getElementById('scores-overall-pct').style.color = color;
  document.getElementById('scores-overall-grade').textContent = gradeLabel(overallPct);
  document.getElementById('scores-overall-grade').style.color = color;
  document.getElementById('scores-breakdown').innerHTML = html;
}

// ─── VICES ────────────────────────────────────────────────────────────────────

function renderVices() {
  const today = dayKey(state.selectedDay);
  if (!data.viceDays[today]) data.viceDays[today] = {};

  let html = '';
  allVices().forEach(v => {
    const count = data.viceDays[today][v.id] || 0;
    html += `
      <div class="vice-card">
        <div class="vice-header">
          <span class="vice-icon">${v.icon}</span>
          <span class="vice-name">${v.name}</span>
          <span class="vice-count">${count}</span>
        </div>
        <div class="vice-actions">
          <button class="vice-btn vice-btn-sub" onclick="adjustVice('${v.id}',-1)">−</button>
          <button class="vice-btn vice-btn-add" onclick="adjustVice('${v.id}',1)">+</button>
        </div>
        ${v.tip ? `<div class="vice-tip">💡 ${v.tip}</div>` : ''}
      </div>`;
  });

  document.getElementById('vices-list').innerHTML = html;
}

function adjustVice(id, delta) {
  const today = dayKey(state.selectedDay);
  if (!data.viceDays[today]) data.viceDays[today] = {};
  data.viceDays[today][id] = Math.max(0, (data.viceDays[today][id] || 0) + delta);
  save();
  renderVices();
}

// ─── TO-DO ────────────────────────────────────────────────────────────────────

function setTodoFilter(f) {
  state.todoFilter = f;
  renderTodos();
}

function renderTodos() {
  // Update filter buttons
  ['all','active','done'].forEach(f => {
    const btn = document.getElementById(`filter-${f}`);
    if (btn) btn.style.opacity = state.todoFilter === f ? '1' : '0.5';
  });

  let todos = data.todos;
  if (state.todoFilter === 'active') todos = todos.filter(t => !t.done);
  if (state.todoFilter === 'done')   todos = todos.filter(t => t.done);

  const total = data.todos.length;
  const done  = data.todos.filter(t => t.done).length;
  const p = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('todos-progress-label').textContent = `${done} / ${total} done`;
  document.getElementById('todos-progress-bar').style.width = `${p}%`;

  let html = '';
  if (todos.length === 0) {
    html = `<div style="padding:20px;text-align:center;color:var(--muted)">No tasks here</div>`;
  } else {
    todos.forEach(t => {
      const priorityClass = `priority-${t.priority}`;
      const priorityLabel = t.priority === 'high' ? 'High' : t.priority === 'medium' ? 'Medium' : 'Low';
      html += `
        <div class="todo-item">
          <div class="todo-check ${t.done ? 'done' : ''}" onclick="toggleTodo('${t.id}')">${t.done ? '✓' : ''}</div>
          <div class="todo-text ${t.done ? 'done' : ''}">${t.text}</div>
          <span class="priority-badge ${priorityClass}">${priorityLabel}</span>
          <button class="todo-delete" onclick="deleteTodo('${t.id}')">🗑</button>
        </div>`;
    });
  }
  document.getElementById('todos-list').innerHTML = html;
}

function openAddTodo() {
  document.getElementById('todo-input').value = '';
  document.getElementById('todo-priority').value = 'medium';
  showModal('modal-todo');
}

function saveTodo() {
  const text = document.getElementById('todo-input').value.trim();
  if (!text) return;
  const priority = document.getElementById('todo-priority').value;
  data.todos.push({ id: uid(), text, priority, done: false });
  save();
  closeModal('modal-todo');
  renderTodos();
}

function toggleTodo(id) {
  const t = data.todos.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); renderTodos(); }
}

function deleteTodo(id) {
  data.todos = data.todos.filter(t => t.id !== id);
  save();
  renderTodos();
}

// ─── REMINDERS ────────────────────────────────────────────────────────────────

function renderReminders() {
  let html = '';
  data.reminders.forEach(r => {
    html += `
      <div class="reminder-row">
        <span class="reminder-icon">${r.icon}</span>
        <div class="reminder-body">
          <div class="reminder-name">${r.name}</div>
          <input type="time" class="reminder-time" value="${r.time}" onchange="updateReminderTime('${r.id}',this.value)">
        </div>
        <label class="toggle">
          <input type="checkbox" ${r.on ? 'checked' : ''} onchange="toggleReminder('${r.id}',this.checked)">
          <div class="toggle-track"></div>
        </label>
      </div>`;
  });
  document.getElementById('reminders-list').innerHTML = html;
}

function toggleReminder(id, val) {
  const r = data.reminders.find(r => r.id === id);
  if (r) { r.on = val; save(); }
}

function updateReminderTime(id, val) {
  const r = data.reminders.find(r => r.id === id);
  if (r) { r.time = val; save(); }
}

// ─── 30-DAY GRID ──────────────────────────────────────────────────────────────

function renderGrid() {
  const cats = allCategories();
  let html = '<table class="grid-table"><thead><tr><th>Day</th>';
  cats.forEach(cat => { html += `<th>${cat.label}</th>`; });
  html += '</tr></thead><tbody>';

  for (let d = 1; d <= 30; d++) {
    const dayData = data.days[dayKey(d)] || {};
    html += `<tr><td>Day ${d}</td>`;
    cats.forEach(cat => {
      const score = calcDayScore(dayData, cat);
      const maxPerDay = cat.type === 'prayers' ? 5
        : cat.type === 'morning_evening' ? 2
        : cat.type === 'quran' ? 3
        : 1;
      const hasAny = Object.keys(dayData).length > 0;
      let cls = '';
      if (!hasAny) cls = '';
      else if (score > 0) cls = 'grid-cell-done';
      else cls = 'grid-cell-miss';
      const label = score > 0 ? (score >= maxPerDay ? '✓' : `${score}/${maxPerDay}`) : (hasAny ? '✗' : '–');
      html += `<td class="${cls}">${label}</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody></table>';
  document.getElementById('grid-container').innerHTML = html;
}

// ─── CUSTOM IBADAH ────────────────────────────────────────────────────────────

function renderCustomIbadah() {
  let html = '';
  if (data.customIbadah.length === 0) {
    html = `<div style="padding:20px;text-align:center;color:var(--muted)">No custom ibadah yet. Tap "+ Add Category" to create one.</div>`;
  } else {
    data.customIbadah.forEach(item => {
      html += `
        <div class="custom-item">
          <span class="custom-item-icon">🕌</span>
          <div class="custom-item-body">
            <div class="custom-item-name">${item.label}</div>
            <div class="custom-item-sub">${item.group || 'Custom'}</div>
          </div>
          <div class="custom-item-actions">
            <button class="icon-btn" onclick="editIbadah('${item.id}')">✏️</button>
            <button class="icon-btn" onclick="deleteIbadah('${item.id}')">🗑</button>
          </div>
        </div>`;
    });
  }
  document.getElementById('custom-ibadah-list').innerHTML = html;
}

function openAddIbadah() {
  state.editingIbadahId = null;
  document.getElementById('ibadah-name-input').value = '';
  document.getElementById('ibadah-group-input').value = '';
  document.getElementById('modal-ibadah-title').textContent = 'Add Custom Ibadah';
  showModal('modal-ibadah');
}

function editIbadah(id) {
  const item = data.customIbadah.find(i => i.id === id);
  if (!item) return;
  state.editingIbadahId = id;
  document.getElementById('ibadah-name-input').value = item.label;
  document.getElementById('ibadah-group-input').value = item.group || '';
  document.getElementById('modal-ibadah-title').textContent = 'Edit Custom Ibadah';
  showModal('modal-ibadah');
}

function saveIbadah() {
  const label = document.getElementById('ibadah-name-input').value.trim();
  const group = document.getElementById('ibadah-group-input').value.trim() || 'Custom';
  if (!label) return;

  if (state.editingIbadahId) {
    const item = data.customIbadah.find(i => i.id === state.editingIbadahId);
    if (item) { item.label = label; item.group = group; }
  } else {
    data.customIbadah.push({ id: uid(), label, group });
  }
  save();
  closeModal('modal-ibadah');
  renderCustomIbadah();
}

function deleteIbadah(id) {
  data.customIbadah = data.customIbadah.filter(i => i.id !== id);
  save();
  renderCustomIbadah();
}

// ─── CUSTOM VICES ─────────────────────────────────────────────────────────────

function renderCustomVices() {
  let html = '';
  if (data.customVices.length === 0) {
    html = `<div style="padding:20px;text-align:center;color:var(--muted)">No custom vices yet. Tap "+ Add Vice" to create one.</div>`;
  } else {
    data.customVices.forEach(item => {
      html += `
        <div class="custom-item">
          <span class="custom-item-icon">${item.icon || '❓'}</span>
          <div class="custom-item-body">
            <div class="custom-item-name">${item.name}</div>
            <div class="custom-item-sub">${item.tip || 'No tip set'}</div>
          </div>
          <div class="custom-item-actions">
            <button class="icon-btn" onclick="editVice('${item.id}')">✏️</button>
            <button class="icon-btn" onclick="deleteVice('${item.id}')">🗑</button>
          </div>
        </div>`;
    });
  }
  document.getElementById('custom-vices-list').innerHTML = html;
}

function openAddVice() {
  state.editingViceId = null;
  document.getElementById('vice-name-input').value = '';
  document.getElementById('vice-icon-input').value = '';
  document.getElementById('vice-tip-input').value = '';
  document.getElementById('modal-vice-title').textContent = 'Add Custom Vice';
  showModal('modal-vice');
}

function editVice(id) {
  const item = data.customVices.find(i => i.id === id);
  if (!item) return;
  state.editingViceId = id;
  document.getElementById('vice-name-input').value = item.name;
  document.getElementById('vice-icon-input').value = item.icon || '';
  document.getElementById('vice-tip-input').value = item.tip || '';
  document.getElementById('modal-vice-title').textContent = 'Edit Custom Vice';
  showModal('modal-vice');
}

function saveVice() {
  const name = document.getElementById('vice-name-input').value.trim();
  const icon = document.getElementById('vice-icon-input').value.trim() || '❓';
  const tip  = document.getElementById('vice-tip-input').value.trim();
  if (!name) return;

  if (state.editingViceId) {
    const item = data.customVices.find(i => i.id === state.editingViceId);
    if (item) { item.name = name; item.icon = icon; item.tip = tip; }
  } else {
    data.customVices.push({ id: uid(), name, icon, tip });
  }
  save();
  closeModal('modal-vice');
  renderCustomVices();
}

function deleteVice(id) {
  data.customVices = data.customVices.filter(i => i.id !== id);
  save();
  renderCustomVices();
}

// ─── THEME PICKER ─────────────────────────────────────────────────────────────

function renderThemePicker() {
  let html = '';
  THEMES.forEach(theme => {
    const isActive = data.theme === theme.id;
    const swatchHtml = theme.swatches.map(c =>
      `<div class="theme-swatch" style="background:${c}"></div>`
    ).join('');
    html += `
      <div class="theme-card ${isActive ? 'active' : ''}">
        <div class="theme-card-header">
          <span class="theme-emoji">${theme.emoji}</span>
          <div>
            <div class="theme-name">${theme.name}${isActive ? ' <span style="color:var(--primary)">✓ Active</span>' : ''}</div>
            <div class="theme-desc">${theme.description}</div>
          </div>
        </div>
        <div class="theme-swatches">${swatchHtml}</div>
        <button class="theme-apply-btn" 
          style="background:${isActive ? 'var(--dim)' : theme.swatches[2]};
                 color:${isActive ? 'var(--primary)' : '#fff'};
                 border-color:${theme.swatches[2]}"
          onclick="applyTheme('${theme.id}')">
          ${isActive ? '✓ Selected' : 'Apply Theme'}
        </button>
      </div>`;
  });
  document.getElementById('theme-picker-list').innerHTML = html;
}

// ─── USER GUIDE ───────────────────────────────────────────────────────────────

function toggleGuide(id) {
  const el = document.getElementById(`guide-section-${id}`);
  if (el) el.classList.toggle('open');
}

function renderUserGuide() {
  let html = '';
  GUIDE_SECTIONS.forEach(section => {
    const stepsHtml = section.steps.map(s => `
      <div class="guide-step">
        <div class="guide-bullet" style="background:${section.color}"></div>
        <div class="guide-step-text">${s}</div>
      </div>`).join('');

    const tipHtml = section.tip ? `
      <div class="guide-tip" style="border-left-color:${section.color}">
        <div class="guide-tip-label" style="color:${section.color}">Pro Tip</div>
        <div class="guide-tip-text">${section.tip}</div>
      </div>` : '';

    html += `
      <div class="guide-section" id="guide-section-${section.id}">
        <div class="guide-header" onclick="toggleGuide('${section.id}')">
          <span class="guide-icon">${section.icon}</span>
          <div style="flex:1">
            <div class="guide-title">${section.title}</div>
            <div class="guide-sub">${section.subtitle}</div>
          </div>
          <span class="guide-chevron">▼</span>
        </div>
        <div class="guide-body">
          ${stepsHtml}
          ${tipHtml}
        </div>
      </div>`;
  });
  document.getElementById('guide-list').innerHTML = html;

  // Open the first section by default
  const first = document.getElementById(`guide-section-${GUIDE_SECTIONS[0].id}`);
  if (first) first.classList.add('open');
}

// ─── DHIKR REMINDERS SCREEN ──────────────────────────────────────────────────

function renderDhikrReminders() {
  const container = document.getElementById('dhikr-reminders-content');
  if (!container) return;

  const enabled = state.dhikrReminderEnabled;
  const interval = state.dhikrReminderInterval;
  const activeIdx = state.dhikrReminderIndex;

  let html = `
    <!-- Enable toggle -->
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:16px;font-weight:700;color:var(--fg)">🎙️ Dhikr Voice Reminders</div>
        <div style="font-size:13px;color:var(--muted);margin-top:2px">Plays each dhikr in sequence using your voice recordings</div>
      </div>
      <label class="toggle">
        <input type="checkbox" ${enabled ? 'checked' : ''} onchange="toggleDhikrReminder(this.checked)">
        <div class="toggle-track"></div>
      </label>
    </div>

    <!-- Interval picker -->
    <div class="card" style="margin-bottom:12px">
      <div style="font-size:14px;font-weight:700;color:var(--fg);margin-bottom:10px">⏱️ Interval between dhikr</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${DHIKR_INTERVAL_OPTIONS.map(opt => `
          <button onclick="setDhikrInterval(${opt})" style="border:1px solid var(--border);border-radius:8px;padding:6px 12px;background:${opt === interval ? 'var(--primary)' : 'var(--surface)'};color:${opt === interval ? 'var(--bg)' : 'var(--fg)'};font-size:13px;font-weight:600;cursor:pointer">${opt} min</button>
        `).join('')}
      </div>
    </div>

    <!-- Dhikr list -->
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);padding:0 4px;margin-bottom:8px">Dhikr Rotation</div>`;

  DEFAULT_DHIKR.forEach((item, idx) => {
    const isActive = enabled && idx === activeIdx;
    html += `
      <div class="card" style="margin-bottom:8px;border-color:${isActive ? 'var(--success)' : 'var(--border)'}">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:36px;height:36px;border-radius:18px;background:${isActive ? 'var(--success)' : 'var(--surface)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border)">
            <span style="font-size:14px;font-weight:800;color:${isActive ? '#fff' : 'var(--muted)'}">${idx + 1}</span>
          </div>
          <div style="flex:1">
            <div style="font-size:18px;font-weight:700;color:var(--fg);direction:rtl;text-align:right">${item.arabic}</div>
            <div style="font-size:12px;font-style:italic;color:var(--muted)">${item.transliteration}</div>
            <div style="font-size:11px;color:var(--muted)">${item.label}</div>
          </div>
          ${isActive ? `<div style="background:var(--success);color:#fff;font-size:11px;font-weight:700;border-radius:8px;padding:3px 10px;align-self:flex-start">▶ Playing</div>` : ''}
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button onclick="dhikrPreviewPlay(${idx})" style="flex:1;border:1px solid var(--primary);border-radius:8px;padding:8px;background:transparent;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer">▶ Preview</button>
        </div>
      </div>`;
  });

  html += `
    <div class="card" style="text-align:center;margin-top:8px;background:var(--surface)">
      <div style="font-size:13px;color:var(--muted);line-height:1.6">
        This feature plays your recorded dhikr audio at the chosen interval.<br>
        Keep this page open for reminders to continue.
      </div>
    </div>`;

  container.innerHTML = html;
}

function toggleDhikrReminder(enabled) {
  state.dhikrReminderEnabled = enabled;
  if (enabled) {
    startDhikrReminderTimer();
  } else {
    stopDhikrReminderTimer();
  }
  renderDhikrReminders();
}

function setDhikrInterval(minutes) {
  state.dhikrReminderInterval = minutes;
  if (state.dhikrReminderEnabled) {
    stopDhikrReminderTimer();
    startDhikrReminderTimer();
  }
  renderDhikrReminders();
}

function startDhikrReminderTimer() {
  stopDhikrReminderTimer();
  // Play immediately
  playDhikrReminder();
  state.dhikrReminderTimer = setInterval(() => {
    playDhikrReminder();
  }, state.dhikrReminderInterval * 60 * 1000);
}

function stopDhikrReminderTimer() {
  if (state.dhikrReminderTimer) {
    clearInterval(state.dhikrReminderTimer);
    state.dhikrReminderTimer = null;
  }
  if (_dhikrAudio) {
    _dhikrAudio.pause();
    _dhikrAudio.src = '';
    _dhikrAudio = null;
  }
}

// Shared audio player for dhikr
let _dhikrAudio = null;

function playDhikrAudio(audioFile, onEnded) {
  if (_dhikrAudio) {
    _dhikrAudio.pause();
    _dhikrAudio.src = '';
    _dhikrAudio = null;
  }
  const audio = new Audio('audio/' + audioFile + '.m4a');
  _dhikrAudio = audio;
  audio.play().catch(() => {});
  if (onEnded) audio.addEventListener('ended', onEnded, { once: true });
}

function playDhikrReminder() {
  const item = DEFAULT_DHIKR[state.dhikrReminderIndex];
  if (!item) return;

  playDhikrAudio(item.id);

  // Advance to next dhikr
  state.dhikrReminderIndex = (state.dhikrReminderIndex + 1) % DEFAULT_DHIKR.length;

  // Re-render if on dhikr reminders screen
  if (state.activeSubScreen === 'dhikr-reminders') {
    renderDhikrReminders();
  }
}

function dhikrPreviewPlay(idx) {
  const item = DEFAULT_DHIKR[idx];
  if (!item) return;
  playDhikrAudio(item.id);
}

// ─── MODALS ───────────────────────────────────────────────────────────────────

function showModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
});

// ─── INSTALL PROMPT ───────────────────────────────────────────────────────────

let deferredPrompt = null;
const banner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Only show if not dismissed before
  if (!localStorage.getItem('rt_install_dismissed')) {
    banner.classList.add('show');
  }
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  banner.classList.remove('show');
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    localStorage.setItem('rt_installed', '1');
  }
  deferredPrompt = null;
});

dismissBtn.addEventListener('click', () => {
  banner.classList.remove('show');
  localStorage.setItem('rt_install_dismissed', '1');
});

window.addEventListener('appinstalled', () => {
  banner.classList.remove('show');
  deferredPrompt = null;
});

// ─── SERVICE WORKER ───────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function init() {
  load();

  // Apply saved theme
  document.documentElement.setAttribute('data-theme', data.theme || 'forest_green');

  // Set initial log day to today's Ramadan day
  const todayDay = getTodayRamadanDay();
  state.logSelectedDay = todayDay;
  state.lifeSelectedDay = todayDay;
  state.selectedDay = todayDay;

  // Set Hijri calendar year to current Hijri year
  try {
    const todayH = gregorianToHijri(new Date(), data.hijriOffset || 0);
    hijriCalYear = todayH.year;
    hijriCalExpandedMonth = todayH.month;
  } catch(e) {
    hijriCalYear = 1447;
    hijriCalExpandedMonth = 9;
  }

  // Handle URL shortcut params
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  if (screen === 'log') {
    switchTab('log');
  } else if (screen === 'scores') {
    switchTab('scores');
  } else {
    switchTab('home');
  }
}

// ─── HIJRI DATE UTILITIES ────────────────────────────────────────────────────

init();
// Ensure dates always render — call immediately after init and again after first paint
try { updateHomeDates(); } catch(e) {}
requestAnimationFrame(() => { try { updateHomeDates(); } catch(e) {} });

const ISLAMIC_DATES = {
  '1-1':  'Islamic New Year',
  '1-10': 'Day of Ashura',
  '3-12': 'Mawlid al-Nabi ﷺ',
  '7-27': "Isra' wal Mi'raj",
  '8-15': "Laylat al-Bara'ah",
  '9-1':  'Start of Ramadan',
  '9-17': 'Battle of Badr',
  '9-21': 'Laylat al-Qadr (21st)',
  '9-23': 'Laylat al-Qadr (23rd)',
  '9-25': 'Laylat al-Qadr (25th)',
  '9-27': 'Laylat al-Qadr (27th)',
  '9-29': 'Laylat al-Qadr (29th)',
  '9-30': 'Last Day of Ramadan',
  '10-1': 'Eid al-Fitr 🎉',
  '12-8': 'Start of Hajj',
  '12-9': 'Day of Arafah',
  '12-10':'Eid al-Adha 🐑',
  '12-11':'Ayyam al-Tashreeq (1)',
  '12-12':'Ayyam al-Tashreeq (2)',
  '12-13':'Ayyam al-Tashreeq (3)',
};

const MONTH_COLORS = [
  '#C0392B','#E67E22','#F1C40F','#27AE60',
  '#1ABC9C','#2980B9','#8E44AD','#2C3E50',
  '#16A085','#D35400','#7F8C8D','#2ECC71',
];

// ─── VERIFIED KUWAITI/FOURMILAB TABULAR HIJRI ALGORITHM ──────────────────────
// This algorithm produces sequential day counts (no skipping) and is the same
// algorithm used in the Expo app (hijri.ts).

function gregorianToJdn(y, m, d) {
  return (
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
    d - 32075
  );
}

function jdnToHijri(jdn) {
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year, monthName: HIJRI_MONTHS[month - 1], monthNameAr: HIJRI_MONTHS_AR[month - 1] };
}

function gregorianToHijri(date, offset) {
  offset = offset || 0;
  const shifted = new Date(date.getTime() + offset * 86400000);
  const y = shifted.getFullYear(), m = shifted.getMonth() + 1, d = shifted.getDate();
  return jdnToHijri(gregorianToJdn(y, m, d));
}

function hijriToGregorian(hYear, hMonth, hDay) {
  const jdn =
    Math.floor((11 * hYear + 3) / 30) +
    354 * hYear + 30 * hMonth -
    Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  return new Date(year, month - 1, day);
}

function hijriMonthLength(hYear, hMonth) {
  if (hMonth % 2 === 1) return 30;
  if (hMonth === 12 && (11 * hYear + 14) % 30 < 11) return 30;
  return 29;
}

function formatGreg(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatGregShort(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ─── HOME DATE DISPLAY ───────────────────────────────────────────────────────

function updateHomeDates() {
  const now = new Date();
  const h = gregorianToHijri(now, data.hijriOffset || 0);
  const hijriStr = `${h.day} ${h.monthName} ${h.year} AH`;
  const gregStr = formatGreg(now);

  const hijriEl = document.getElementById('home-hijri-date');
  const gregEl = document.getElementById('home-gregorian-date');
  const noteEl = document.getElementById('home-offset-note');

  if (hijriEl) hijriEl.textContent = hijriStr;
  if (gregEl) gregEl.textContent = gregStr;
  if (noteEl) {
    const off = data.hijriOffset || 0;
    if (off !== 0) {
      noteEl.textContent = `Offset applied: ${off > 0 ? '+' : ''}${off} day${Math.abs(off) !== 1 ? 's' : ''}`;
      noteEl.style.display = 'block';
    } else {
      noteEl.style.display = 'none';
    }
  }
}

// ─── HIJRI ADJUST MODAL ──────────────────────────────────────────────────────

let hijriTempOffset = 0;

function openHijriAdjust() {
  hijriTempOffset = data.hijriOffset || 0;
  renderHijriAdjustModal();
  showModal('modal-hijri-adjust');
}

function hijriAdjustChange(delta) {
  hijriTempOffset += delta;
  renderHijriAdjustModal();
}

function renderHijriAdjustModal() {
  const previewEl = document.getElementById('hijri-adjust-preview');
  const valEl = document.getElementById('hijri-adjust-value');
  if (valEl) valEl.textContent = (hijriTempOffset > 0 ? '+' : '') + hijriTempOffset;
  if (previewEl) {
    const h = gregorianToHijri(new Date(), hijriTempOffset);
    previewEl.textContent = `${h.day} ${h.monthName} ${h.year} AH`;
  }
}

function saveHijriOffset() {
  data.hijriOffset = hijriTempOffset;
  save();
  closeModal('modal-hijri-adjust');
  updateHomeDates();
}

// ─── HIJRI CALENDAR STATE ────────────────────────────────────────────────────

let hijriCalYear = 1447;

function hijriCalPrevYear() {
  hijriCalYear--;
  renderHijriCalendar();
}

function hijriCalNextYear() {
  hijriCalYear++;
  renderHijriCalendar();
}

let hijriCalExpandedMonth = null;

function toggleHijriMonth(m) {
  hijriCalExpandedMonth = hijriCalExpandedMonth === m ? null : m;
  renderHijriCalendar();
}

// ─── HIJRI CALENDAR RENDERER ─────────────────────────────────────────────────

function renderHijriCalendar() {
  const now = new Date();
  const todayH = gregorianToHijri(now, data.hijriOffset || 0);

  // Set default expanded month to current month if in current year
  if (hijriCalExpandedMonth === null && hijriCalYear === todayH.year) {
    hijriCalExpandedMonth = todayH.month;
  }

  // Year display
  const yearEl = document.getElementById('hijri-cal-year');
  const yearLabelEl = document.getElementById('hijri-cal-year-label');
  if (yearEl) yearEl.textContent = `${hijriCalYear} AH`;
  if (yearLabelEl) yearLabelEl.textContent = `${hijriCalYear} AH`;

  // Build all 12 months
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const len = hijriMonthLength(hijriCalYear, m);
    const days = [];
    for (let d = 1; d <= len; d++) {
      days.push({ hijriDay: d, gregorian: hijriToGregorian(hijriCalYear, m, d) });
    }
    months.push({ monthIndex: m, days, start: days[0].gregorian, end: days[days.length - 1].gregorian });
  }

  // Greg range
  const gregRangeEl = document.getElementById('hijri-cal-greg-range');
  if (gregRangeEl) {
    gregRangeEl.textContent = `${months[0].start.getFullYear()} – ${months[11].end.getFullYear()}`;
  }

  // Today banner
  const bannerEl = document.getElementById('hijri-cal-today-banner');
  if (bannerEl) {
    bannerEl.innerHTML = `<span style="color:var(--primary);font-weight:600;font-size:14px">
      ☪️ Today: ${todayH.day} ${todayH.monthName} ${todayH.year} AH &nbsp;·&nbsp; 📅 ${formatGreg(now)}
    </span>`;
  }

  // Months
  const monthsEl = document.getElementById('hijri-cal-months');
  if (!monthsEl) return;

  const html = months.map(month => {
    const isExpanded = hijriCalExpandedMonth === month.monthIndex;
    const isCurrent = hijriCalYear === todayH.year && month.monthIndex === todayH.month;
    const isRam = month.monthIndex === 9;
    const color = MONTH_COLORS[month.monthIndex - 1];

    let daysHtml = '';
    if (isExpanded) {
      daysHtml = `
        <div style="display:flex;padding:6px 12px;background:var(--surface);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--primary)">
          <div style="width:40px">Hijri</div>
          <div style="flex:1">Gregorian</div>
          <div style="width:60px">Event</div>
        </div>
        ${month.days.map(d => {
          const key = `${month.monthIndex}-${d.hijriDay}`;
          const special = ISLAMIC_DATES[key];
          const isT = hijriCalYear === todayH.year && month.monthIndex === todayH.month && d.hijriDay === todayH.day;
          return `
            <div style="display:flex;align-items:center;padding:8px 12px;border-bottom:0.5px solid var(--border);gap:10px;${isT ? 'background:var(--primary-dim,rgba(46,125,50,0.1))' : ''}${special && !isT ? ';background:rgba(201,168,76,0.08)' : ''}">
              <div style="width:34px;height:34px;border-radius:17px;display:flex;align-items:center;justify-content:center;background:${isT ? 'var(--primary)' : (isRam ? 'var(--success)' : 'var(--surface)')};flex-shrink:0">
                <span style="font-size:13px;font-weight:700;color:${isT ? 'var(--bg)' : 'var(--fg)'}">${d.hijriDay}</span>
              </div>
              <div style="flex:1">
                <div style="font-size:14px;font-weight:500;color:var(--fg)">${formatGreg(d.gregorian)}</div>
                ${special ? `<div style="font-size:12px;font-weight:600;color:var(--primary);margin-top:1px">✦ ${special}</div>` : ''}
              </div>
              ${isT ? `<div style="background:var(--primary);color:var(--bg);font-size:11px;font-weight:700;border-radius:6px;padding:2px 8px">Today</div>` : ''}
            </div>`;
        }).join('')}`;
    }

    return `
      <div class="card" style="padding:0;overflow:hidden;margin-bottom:8px">
        <div onclick="toggleHijriMonth(${month.monthIndex})" style="display:flex;align-items:center;padding:14px;gap:12px;cursor:pointer;${isRam ? 'background:rgba(46,125,50,0.08)' : ''}">
          <div style="width:36px;height:36px;border-radius:18px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="color:#fff;font-size:14px;font-weight:800">${month.monthIndex}</span>
          </div>
          <div style="flex:1">
            <div style="font-size:16px;font-weight:700;color:var(--fg)">${HIJRI_MONTHS[month.monthIndex - 1]}${isRam ? ' 🌙' : ''}</div>
            <div style="font-size:13px;font-weight:600;color:var(--primary)">${HIJRI_MONTHS_AR[month.monthIndex - 1]}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:1px">${formatGregShort(month.start)} – ${formatGregShort(month.end)}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            ${isCurrent ? `<div style="background:var(--primary);color:var(--bg);font-size:11px;font-weight:700;border-radius:6px;padding:2px 8px">Current</div>` : ''}
            <span style="color:var(--muted);font-size:12px">${isExpanded ? '▲' : '▼'}</span>
          </div>
        </div>
        ${daysHtml}
      </div>`;
  }).join('');

  monthsEl.innerHTML = html;
}
