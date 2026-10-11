// Writes src/theme/icons/<look>.js: one icon set per look (its own glyphs and MUI style: filled, outlined, rounded,
// sharp or two-tone). Each set is a separate chunk, loaded only for the school's look. Run: npm run icons
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// Meaning → MUI glyph used by every look unless the look picks another.
const BASE = {
  today: 'Home',
  dashboard: 'Dashboard',
  attendance: 'FactCheck',
  students: 'People',
  syllabus: 'MenuBook',
  marks: 'Grading',
  classes: 'Class',
  staff: 'Badge',
  years: 'CalendarMonth',
  holidays: 'Event',
  school: 'Settings',
  audit: 'History',
  me: 'Person',
  menu: 'Menu',
  more: 'Apps',
  offline: 'CloudOff',
  add: 'Add',
  back: 'ArrowBack',
  up: 'ArrowUpward',
  down: 'ArrowDownward',
  rollover: 'Autorenew',
  call: 'Call',
  done: 'CheckCircle',
  todo: 'RadioButtonUnchecked',
  copy: 'ContentCopy',
  delete: 'Delete',
  certificate: 'Description',
  download: 'Download',
  edit: 'Edit',
  note: 'EditNote',
  expand: 'ExpandMore',
  help: 'HelpOutline',
  health: 'LocalHospital',
  logout: 'Logout',
  addPerson: 'PersonAdd',
  camera: 'PhotoCamera',
  print: 'Print',
  save: 'Save',
  search: 'Search',
  register: 'TableView',
  upload: 'UploadFile',
  show: 'Visibility',
  hide: 'VisibilityOff',
  lock: 'Lock',
  look: 'Palette',
  meals: 'Restaurant',
  absent: 'PersonOff',
  present: 'HowToReg',
  birthday: 'Cake',
  trend: 'InsertChart',
  chevron: 'ChevronRight',
  language: 'Translate',
  textSize: 'FormatSize',
  date: 'Today',
  star: 'Star',
  child: 'Face',
  teacher: 'CoPresent',
  info: 'Info',
  success: 'CheckCircle',
  warning: 'Warning',
  error: 'Error',
  close: 'Close',
};

const LOOKS = {
  // Signal Shala: soft rounded glyphs, playful choices.
  signal: {
    variant: 'Rounded',
    glyphs: {
      today: 'WbSunny',
      dashboard: 'SpaceDashboard',
      attendance: 'HowToReg',
      present: 'HowToReg',
      students: 'Diversity3',
      syllabus: 'AutoStories',
      marks: 'EmojiEvents',
      classes: 'MeetingRoom',
      years: 'EventRepeat',
      holidays: 'Celebration',
      school: 'Tune',
      audit: 'ManageHistory',
      me: 'Face',
      more: 'GridView',
      note: 'EditNote',
      health: 'HealthAndSafety',
      info: 'Lightbulb',
      success: 'ThumbUp',
      warning: 'NotificationImportant',
      error: 'ReportProblem',
    },
  },
  // Blackboard: outlined, classroom glyphs.
  chalkboard: {
    variant: 'Outlined',
    glyphs: {
      attendance: 'Checklist',
      students: 'Groups',
      dashboard: 'Insights',
      staff: 'CoPresent',
      marks: 'Grading',
      me: 'AccountCircle',
      holidays: 'BeachAccess',
      note: 'Draw',
      more: 'Widgets',
      info: 'Info',
      success: 'TaskAlt',
      warning: 'WarningAmber',
      error: 'ErrorOutline',
    },
  },
  // Notebook: crisp sharp glyphs, stationery choices.
  notebook: {
    variant: 'Sharp',
    glyphs: {
      today: 'Today',
      date: 'Today',
      syllabus: 'LibraryBooks',
      marks: 'Assignment',
      classes: 'ViewModule',
      years: 'DateRange',
      note: 'Create',
      edit: 'Create',
      certificate: 'Article',
      register: 'ListAlt',
      more: 'MoreHoriz',
      info: 'Info',
      success: 'Done',
      warning: 'PriorityHigh',
      error: 'Block',
    },
  },
  // Marigold: two-tone, festive glyphs.
  marigold: {
    variant: 'TwoTone',
    glyphs: {
      today: 'LocalFlorist',
      dashboard: 'DonutLarge',
      attendance: 'AssignmentTurnedIn',
      students: 'Groups',
      syllabus: 'ImportContacts',
      marks: 'MilitaryTech',
      classes: 'MeetingRoom',
      staff: 'SupervisorAccount',
      years: 'EventNote',
      holidays: 'Celebration',
      school: 'Tune',
      audit: 'Restore',
      me: 'Face',
      more: 'Apps',
      health: 'Healing',
      info: 'EmojiObjects',
      success: 'Verified',
      warning: 'NewReleases',
      error: 'Report',
    },
  },
  // Calm teal: the original filled set.
  classic: { variant: '', glyphs: {} },
  // High contrast: filled, the plainest glyphs.
  clear: { variant: '', glyphs: { help: 'Help', more: 'MoreHoriz' } },
};

const ONLY_FILLED = new Set(['WhatsApp']); // brand marks exist in one style only
const dir = new URL('../src/theme/icons/', import.meta.url);
mkdirSync(dir, { recursive: true });
const exists = (name) => existsSync(new URL(`../node_modules/@mui/icons-material/${name}.mjs`, import.meta.url));

for (const [look, { variant, glyphs }] of Object.entries(LOOKS)) {
  const map = { ...BASE, ...glyphs };
  const lines = [];
  const used = new Map();
  for (const [key, glyph] of Object.entries(map)) {
    // A few glyphs lack one style (e.g. HelpOutline has no filled file): take the nearest style that exists.
    const name = [`${glyph}${variant}`, glyph, `${glyph}Outlined`, `${glyph}Rounded`].find(exists);
    if (!name) throw new Error(`${look}: no icon ${glyph}`);
    if (!used.has(name)) used.set(name, `I${used.size}`);
    lines.push(`  ${key}: ${used.get(name)},`);
  }
  for (const b of ONLY_FILLED) used.set(b, b);
  const imports = [...used].map(([name, id]) => `import ${id} from '@mui/icons-material/${name}';`);
  writeFileSync(
    new URL(`${look}.js`, dir),
    `// Generated by scripts/icons.mjs — edit that file, then run \`npm run icons\`.\n${imports.join('\n')}\n\nexport default {\n${lines.join('\n')}\n${[...ONLY_FILLED].map((b) => `  ${b[0].toLowerCase() + b.slice(1)}: ${b},`).join('\n')}\n};\n`,
  );
}
console.log('icons written for', Object.keys(LOOKS).join(', '));
