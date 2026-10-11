// The looks a principal can choose for the school (School settings → Look). There is no dark look: phones are used
// outdoors and printed pages must match the screen. Every look keeps text ≥ 4.5:1 against its background
// (checked in looks.test.js), 44 px touch targets and the same layout; looks differ in colour, fonts, shapes, surfaces
// and icons. Ids are stored by the API (Signal-School-Backend src/modules/schools/themes.js); the first is the default.
//
// Fields: palette (MUI), font/headingFont (CSS stacks), radius (cards), buttonRadius, surface ('soft' shadow, 'outlined',
// 'ruled' left margin line, 'bold' 2 px borders), bar (app bar colours; `stripe` is a decorative line under it),
// nav ('pill' | 'bar' | 'tab'), background (page backdrop CSS), icons (lazy icon set, src/theme/icons/<id>.js).

const INDIC = '"Noto Sans Devanagari", "Noto Sans Gujarati"';
const stack = (...fonts) => [...fonts, INDIC, 'system-ui', 'sans-serif'].join(', ');

export const LOOKS = {
  // The Signal Shala website: its red with the traffic-light colours, DM Sans and Radio Canada Big, soft rounded cards.
  signal: {
    swatch: ['#ED1427', '#FF910B', '#23BC14'],
    palette: {
      primary: { main: '#C8102E', light: '#FDE7E9', dark: '#9E0B22', contrastText: '#FFFFFF' },
      secondary: { main: '#13803A', light: '#E3F5E8', contrastText: '#FFFFFF' },
      success: { main: '#13803A', contrastText: '#FFFFFF' },
      warning: { main: '#9A5B00', contrastText: '#FFFFFF' },
      error: { main: '#B3261E', contrastText: '#FFFFFF' },
      info: { main: '#0B5394', contrastText: '#FFFFFF' },
      background: { default: '#FFF7F3', paper: '#FFFFFF' },
      text: { primary: '#2B1B1B', secondary: '#6B5452' },
      divider: '#F0DEDA',
    },
    font: stack('"DM Sans"'),
    headingFont: stack('"Radio Canada Big"', '"DM Sans"'),
    radius: 18,
    buttonRadius: 999,
    surface: 'soft',
    bar: { bg: '#FFFFFF', fg: '#2B1B1B', stripe: 'linear-gradient(90deg, #ED1427 0 33.3%, #FF910B 33.3% 66.6%, #23BC14 66.6%)' },
    nav: 'pill',
    background: 'radial-gradient(circle at 100% 0, #FFE9E4 0, transparent 420px), #FFF7F3',
    icons: () => import('./icons/signal.js'),
  },
  // A classroom blackboard: deep green bar with chalk-yellow accents, handwritten headings, crisp outlined cards.
  chalkboard: {
    swatch: ['#1F4A3A', '#F4D35E', '#FFFDF7'],
    palette: {
      primary: { main: '#22684D', light: '#E2EFE8', dark: '#1F4A3A', contrastText: '#FFFFFF' },
      secondary: { main: '#8A5A00', light: '#FBF1D3', contrastText: '#FFFFFF' },
      success: { main: '#22684D', contrastText: '#FFFFFF' },
      warning: { main: '#8A5A00', contrastText: '#FFFFFF' },
      error: { main: '#B3261E', contrastText: '#FFFFFF' },
      info: { main: '#0B5394', contrastText: '#FFFFFF' },
      background: { default: '#F3EFE4', paper: '#FFFDF7' },
      text: { primary: '#1E2A24', secondary: '#55625A' },
      divider: '#DDD6C3',
    },
    font: stack('"Noto Sans"'),
    headingFont: stack('Kalam', '"Noto Sans"'),
    radius: 6,
    buttonRadius: 6,
    surface: 'outlined',
    bar: { bg: '#1F4A3A', fg: '#FFFFFF', accent: '#F4D35E', stripe: 'repeating-linear-gradient(90deg, #8B5E34 0 18px, #A0703F 18px 36px)' },
    nav: 'bar',
    background: '#F3EFE4',
    icons: () => import('./icons/chalkboard.js'),
  },
  // An exercise book: blue ink on ruled paper with the red margin line, Hind, sharp corners.
  notebook: {
    swatch: ['#1D4ED8', '#BE185D', '#F5F8FF'],
    palette: {
      primary: { main: '#1D4ED8', light: '#E3EAFD', dark: '#1E3A8A', contrastText: '#FFFFFF' },
      secondary: { main: '#BE185D', light: '#FCE7F1', contrastText: '#FFFFFF' },
      success: { main: '#15803D', contrastText: '#FFFFFF' },
      warning: { main: '#9A5B00', contrastText: '#FFFFFF' },
      error: { main: '#B91C1C', contrastText: '#FFFFFF' },
      info: { main: '#1E40AF', contrastText: '#FFFFFF' },
      background: { default: '#F5F8FF', paper: '#FFFFFF' },
      text: { primary: '#1E293B', secondary: '#475569' },
      divider: '#D7E0F5',
    },
    font: stack('Hind', '"Hind Vadodara"'),
    headingFont: stack('Hind', '"Hind Vadodara"'),
    radius: 4,
    buttonRadius: 4,
    surface: 'ruled',
    bar: { bg: '#1D4ED8', fg: '#FFFFFF', stripe: 'linear-gradient(#F472B6, #F472B6)' },
    nav: 'tab',
    background: 'repeating-linear-gradient(180deg, #F5F8FF 0 31px, #E3EAFB 31px 32px)',
    icons: () => import('./icons/notebook.js'),
  },
  // Festive marigold: saffron to maroon, rounded Baloo letters, warm cards, two-tone icons.
  marigold: {
    swatch: ['#E8730C', '#8E1B47', '#FFF6EA'],
    palette: {
      primary: { main: '#B23A0B', light: '#FDEBDC', dark: '#8A2C08', contrastText: '#FFFFFF' },
      secondary: { main: '#8E1B47', light: '#F9E1EA', contrastText: '#FFFFFF' },
      success: { main: '#2F7D32', contrastText: '#FFFFFF' },
      warning: { main: '#A15C00', contrastText: '#FFFFFF' },
      error: { main: '#B3261E', contrastText: '#FFFFFF' },
      info: { main: '#0B5394', contrastText: '#FFFFFF' },
      background: { default: '#FFF6EA', paper: '#FFFFFF' },
      text: { primary: '#3B1D0F', secondary: '#6E4B36' },
      divider: '#F2DCC4',
    },
    font: stack('"Baloo 2"', '"Baloo Bhai 2"'),
    headingFont: stack('"Baloo 2"', '"Baloo Bhai 2"'),
    radius: 22,
    buttonRadius: 999,
    surface: 'soft',
    bar: {
      bg: 'linear-gradient(100deg, #C2410C, #8E1B47)',
      fg: '#FFFFFF',
      stripe: 'repeating-linear-gradient(90deg, #F59E0B 0 10px, #FDE68A 10px 14px, #DC2626 14px 24px, #FDE68A 24px 28px)',
    },
    nav: 'pill',
    background: '#FFF6EA',
    icons: () => import('./icons/marigold.js'),
  },
  // The original calm teal look.
  classic: {
    swatch: ['#0B5F72', '#8A4B0F', '#F4F7F7'],
    palette: {
      primary: { main: '#0B5F72', light: '#D3E6EA', dark: '#0B3F4B', contrastText: '#FFFFFF' },
      secondary: { main: '#8A4B0F', light: '#F6E7D8', contrastText: '#FFFFFF' },
      success: { main: '#1E7A3C', contrastText: '#FFFFFF' },
      warning: { main: '#9A5B00', contrastText: '#FFFFFF' },
      error: { main: '#B3261E', contrastText: '#FFFFFF' },
      info: { main: '#0B5394', contrastText: '#FFFFFF' },
      background: { default: '#F4F7F7', paper: '#FFFFFF' },
      text: { primary: '#14262B', secondary: '#4A5F64' },
      divider: '#DCE5E6',
    },
    font: stack('"Noto Sans"'),
    headingFont: stack('"Noto Sans"'),
    radius: 10,
    buttonRadius: 10,
    surface: 'outlined',
    bar: { bg: '#FFFFFF', fg: '#14262B' },
    nav: 'pill',
    background: '#F4F7F7',
    icons: () => import('./icons/classic.js'),
  },
  // For weak eyesight and bright sunlight: black on white, thick borders, larger letters, yellow focus ring.
  clear: {
    swatch: ['#000000', '#FFD400', '#0038A8'],
    palette: {
      primary: { main: '#0038A8', light: '#E0E8FF', dark: '#002270', contrastText: '#FFFFFF' },
      secondary: { main: '#000000', light: '#EEEEEE', contrastText: '#FFFFFF' },
      success: { main: '#00602B', contrastText: '#FFFFFF' },
      warning: { main: '#7A4500', contrastText: '#FFFFFF' },
      error: { main: '#A50E0E', contrastText: '#FFFFFF' },
      info: { main: '#0038A8', contrastText: '#FFFFFF' },
      background: { default: '#FFFFFF', paper: '#FFFFFF' },
      text: { primary: '#000000', secondary: '#262626' },
      divider: '#000000',
    },
    font: stack('"Atkinson Hyperlegible"', '"Noto Sans"'),
    headingFont: stack('"Atkinson Hyperlegible"', '"Noto Sans"'),
    fontSize: 16.5,
    radius: 8,
    buttonRadius: 8,
    surface: 'bold',
    bar: { bg: '#FFFFFF', fg: '#000000', stripe: 'linear-gradient(#000, #000)' },
    nav: 'bar',
    background: '#FFFFFF',
    focus: '#FFD400',
    icons: () => import('./icons/clear.js'),
  },
};

export const LOOK_IDS = Object.keys(LOOKS);
export const DEFAULT_LOOK = 'signal';
export const lookOf = (id) => (id in LOOKS ? id : DEFAULT_LOOK);
