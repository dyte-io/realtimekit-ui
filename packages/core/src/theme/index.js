/**
 * Reference
 * https://github.dev/tailwindlabs/tailwindcss/blob/master/defaultTheme.js
 */

const colors = require('./colors');
const breakpoints = require('./breakpoints.json');
const { getSpacingConfig } = require('./space');

const spacing = getSpacingConfig();

module.exports = {
  spacing,
  colors,
  fontFamily: {
    sans: ['var(--rtk-font-family, sans-serif)'],
  },
  screens: Object.fromEntries(
    Object.entries(breakpoints).map(([screen, width]) => [screen, `${width}px`])
  ),
  fontSize: {
    'heading-lg': ['28px'],
    'heading-md': ['24px'],
    'heading-sm': ['20px'],
    'button-lg': ['16px'],
    'button-md': ['14px'],
    'button-sm': ['12px'],
    'text-lg': ['16px'],
    'text-md': ['14px'],
    'text-sm': ['12px'],
    'text-xs': ['10px'],
  },
  borderWidth: {
    none: 'var(--rtk-border-width-none, 0)',
    sm: 'var(--rtk-border-width-sm, 1px)',
    md: 'var(--rtk-border-width-md, 2px)',
    lg: 'var(--rtk-border-width-lg, 4px)',
  },
  borderRadius: {
    none: 'var(--rtk-border-radius-none, 0)',
    sm: 'var(--rtk-border-radius-sm, 4px)',
    md: 'var(--rtk-border-radius-md, 8px)',
    lg: 'var(--rtk-border-radius-lg, 12px)',
    xl: 'var(--rtk-border-radius-xl, 40px)',
    full: '9999px',
  },
  maxWidth: (theme, { breakpoints }) => ({
    ...spacing,
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    prose: '65ch',
    ...breakpoints(theme('screens')),
  }),
  minWidth: (theme, { breakpoints }) => ({
    ...spacing,
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    prose: '65ch',
    ...breakpoints(theme('screens')),
  }),
};
