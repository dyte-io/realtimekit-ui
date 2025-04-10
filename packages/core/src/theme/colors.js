/**
 * Converts Hex color codes to RGB strings for use in the design system
 * @param {string} hex The hex code of the color
 * @returns Space separated RGB values
 */
const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r} ${g} ${b}`;
};

const defaultColors = {
  brand: {
    300: '#497CFD',
    400: '#356EFD',
    500: '#2160FD',
    600: '#0D51FD',
    700: '#0246FD',
  },
  background: {
    1000: '#080808',
    900: '#1A1A1A',
    800: '#1E1E1E',
    700: '#2C2C2C',
    600: '#3C3C3C',
  },
  'video-bg': '#181818',
  success: '#62A504',
  danger: '#FF2D2D',
  warning: '#FFCD07',
};

/**
 * Function which adds support for adding any opacity value to colors from CSS Variables
 * @param {string} varName The CSS variable name of the color
 * @param {string} color The color code in Hex
 * @param {number} opacityValue The opacity value - [0,100]
 * @returns Parsed string to be used in Tailwind CSS config
 */
const getColorWithOpacity = (varName, color, opacityValue) => {
  if (opacityValue !== undefined) {
    return `rgba(var(${varName}, ${hexToRGB(color)}) / ${opacityValue})`;
  }
  return `rgb(var(${varName}, ${hexToRGB(color)}))`;
};

module.exports = ({ colors }) => ({
  inherit: colors.inherit,
  current: colors.current,
  transparent: colors.transparent,
  brand: {
    DEFAULT: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-500', defaultColors.brand[500], opacityValue),
    300: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-300', defaultColors.brand[300], opacityValue),
    400: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-400', defaultColors.brand[400], opacityValue),
    500: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-500', defaultColors.brand[500], opacityValue),
    600: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-600', defaultColors.brand[600], opacityValue),
    700: ({ opacityValue }) =>
      getColorWithOpacity('--rtk-colors-brand-700', defaultColors.brand[700], opacityValue),
  },
  background: {
    DEFAULT: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-1000',
        defaultColors.background[1000],
        opacityValue
      ),
    1000: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-1000',
        defaultColors.background[1000],
        opacityValue
      ),
    900: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-900',
        defaultColors.background[900],
        opacityValue
      ),
    800: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-800',
        defaultColors.background[800],
        opacityValue
      ),
    700: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-700',
        defaultColors.background[700],
        opacityValue
      ),
    600: ({ opacityValue }) =>
      getColorWithOpacity(
        '--rtk-colors-background-600',
        defaultColors.background[600],
        opacityValue
      ),
  },
  text: {
    DEFAULT: 'rgb(var(--rtk-colors-text-1000, 255 255 255))',
    1000: 'rgb(var(--rtk-colors-text-1000, 255 255 255))',
    900: 'rgb(var(--rtk-colors-text-900, 255 255 255 / 0.88))',
    800: 'rgb(var(--rtk-colors-text-800, 255 255 255 / 0.76))',
    700: 'rgb(var(--rtk-colors-text-700, 255 255 255 / 0.64))',
    600: 'rgb(var(--rtk-colors-text-600, 255 255 255 / 0.52))',
  },
  'text-on-brand': {
    DEFAULT:
      'rgb(var(--rtk-colors-text-on-brand-1000, var(--rtk-colors-text-1000, 255 255 255)))',
    1000: 'rgb(var(--rtk-colors-text-on-brand-1000, var(--rtk-colors-text-1000, 255 255 255)))',
    900: 'rgb(var(--rtk-colors-text-on-brand-900, var(--rtk-colors-text-900, 255 255 255 / 0.88)))',
    800: 'rgb(var(--rtk-colors-text-on-brand-800, var(--rtk-colors-text-800, 255 255 255 / 0.76)))',
    700: 'rgb(var(--rtk-colors-text-on-brand-700, var(--rtk-colors-text-700, 255 255 255 / 0.64)))',
    600: 'rgb(var(--rtk-colors-text-on-brand-600, var(--rtk-colors-text-600, 255 255 255 / 0.52)))',
  },
  'video-bg': ({ opacityValue }) =>
    getColorWithOpacity('--rtk-colors-video-bg', defaultColors['video-bg'], opacityValue),
  danger: ({ opacityValue }) =>
    getColorWithOpacity('--rtk-colors-danger', defaultColors.danger, opacityValue),
  success: ({ opacityValue }) =>
    getColorWithOpacity('--rtk-colors-success', defaultColors.success, opacityValue),
  warning: ({ opacityValue }) =>
    getColorWithOpacity('--rtk-colors-warning', defaultColors.warning, opacityValue),
});
