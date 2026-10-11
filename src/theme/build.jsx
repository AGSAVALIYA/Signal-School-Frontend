import { createTheme, alpha } from '@mui/material/styles';
import { LOOKS, lookOf } from './looks';

// MUI theme for a look. Shared by every look: larger base text, ≥ 44 px touch targets, no capitals on buttons (they
// break Indian scripts), dialogs full width. `theme.look` carries the look's own tokens and icons for the app shell.
export function buildTheme(id, icons) {
  const look = LOOKS[lookOf(id)];
  const p = look.palette;
  const r = look.radius;
  const inputRadius = Math.min(r, 12);
  const bold = look.surface === 'bold';
  const soft = look.surface === 'soft';
  const shadow = `0 1px 2px ${alpha(p.text.primary, 0.06)}, 0 6px 20px ${alpha(p.text.primary, 0.06)}`;
  const card = {
    soft: { border: 'none', boxShadow: shadow },
    outlined: { border: `1px solid ${p.divider}` },
    ruled: { border: `1px solid ${p.divider}`, borderLeft: `4px solid ${alpha(p.secondary.main, 0.55)}` },
    bold: { border: '2px solid #000' },
  }[look.surface];
  const A = icons || {};

  return createTheme({
    look: { id: lookOf(id), ...look, icons: A },
    palette: { mode: 'light', ...p },
    shape: { borderRadius: inputRadius },
    typography: {
      fontFamily: look.font,
      fontSize: look.fontSize || 15,
      h1: { fontFamily: look.headingFont, fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h2: { fontFamily: look.headingFont, fontSize: '1.3rem', fontWeight: 700 },
      h3: { fontFamily: look.headingFont, fontSize: '1.12rem', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: bold ? 700 : 600, fontSize: '1rem' },
      body1: { lineHeight: 1.6 },
      overline: { fontWeight: 700, letterSpacing: '0.08em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: look.background, backgroundAttachment: 'scroll' },
          '::selection': { background: alpha(p.primary.main, 0.2) },
          ...(look.focus && {
            '*:focus-visible': { outline: '3px solid #000 !important', boxShadow: `0 0 0 6px ${look.focus} !important` },
            a: { textDecorationThickness: 2 },
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { minHeight: 44, borderRadius: look.buttonRadius, paddingInline: 18 },
          sizeLarge: { minHeight: 52, fontSize: '1.05rem' },
          sizeSmall: { minHeight: 36 },
          outlined: bold ? { borderWidth: 2, borderColor: '#000', '&:hover': { borderWidth: 2 } } : { borderColor: alpha(p.primary.main, 0.45) },
          contained: soft ? { boxShadow: `0 4px 14px ${alpha(p.primary.main, 0.25)}` } : {},
        },
      },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiFab: { styleOverrides: { root: { borderRadius: look.buttonRadius === 999 ? '50%' : look.buttonRadius * 2 } } },
      MuiTextField: { defaultProps: { fullWidth: true } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: inputRadius,
            backgroundColor: p.background.paper,
            ...(bold && { '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: '#000' } }),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: look.buttonRadius === 999 ? 999 : Math.max(4, r / 2), ...(bold && { border: '2px solid #000' }) },
          label: { fontWeight: 600 },
        },
      },
      MuiToggleButton: {
        // Unselected choices in the secondary text colour (the default grey is too faint on tinted rows).
        styleOverrides: {
          root: {
            borderRadius: Math.min(r, 12),
            color: p.text.secondary,
            ...(bold && { border: '2px solid #000' }),
            '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: p.primary.light, color: p.primary.dark, fontWeight: 700 },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: { colorDefault: { backgroundColor: p.primary.light, color: p.primary.dark, fontWeight: 700 } },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: r, ...card } },
      },
      MuiPaper: {
        styleOverrides: { outlined: { borderRadius: Math.min(r, 16), ...card }, rounded: { borderRadius: Math.min(r, 16) } },
      },
      MuiDialog: {
        defaultProps: { fullWidth: true, maxWidth: 'sm' },
        styleOverrides: { paper: { borderRadius: Math.max(r, 8), ...(bold && { border: '2px solid #000' }) } },
      },
      MuiDialogTitle: { styleOverrides: { root: { fontFamily: look.headingFont, fontWeight: 700 } } },
      MuiAlert: {
        defaultProps: {
          iconMapping: {
            success: <A.success fontSize="inherit" />,
            info: <A.info fontSize="inherit" />,
            warning: <A.warning fontSize="inherit" />,
            error: <A.error fontSize="inherit" />,
          },
        },
        styleOverrides: { root: { borderRadius: Math.min(r, 14), ...(bold && { border: '2px solid currentColor' }) } },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: p.text.secondary, backgroundColor: alpha(p.primary.main, 0.05) },
          root: bold ? { borderBottom: '1px solid #000' } : {},
        },
      },
      MuiTab: { styleOverrides: { root: { minHeight: 48, fontWeight: 600 } } },
      MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 } } },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: { minWidth: 0, padding: '6px 4px', '&.Mui-selected': { color: p.primary.main } },
          label: { fontSize: '0.78rem', fontWeight: 600, '&.Mui-selected': { fontSize: '0.8rem' } },
        },
      },
      MuiListItemIcon: { styleOverrides: { root: { minWidth: 40 } } },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: '0.85rem' } } },
    },
  });
}
