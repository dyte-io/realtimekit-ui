import {
  BorderRadius,
  BorderWidth,
  DesignTokens,
  UIColors,
} from '../types/ui-config/design-tokens';
import spacingScale from '../theme/spacing-scale.json';
import { THEMES } from '../theme/presets/themes';
import { BORDER_WIDTHS, BORDER_RADII } from '../theme/presets/border';
import { hexToRGB } from './color';

const DEFAULT_CSS_TOKEN_PREFIX = '--rtk-';

function getToken(token: string, tokenPrefix: string = DEFAULT_CSS_TOKEN_PREFIX) {
  return tokenPrefix + token;
}

const provideGoogleFont = (fontFamily: string) => {
  const weights = [400, 500, 700];

  const links = [];

  if (document.querySelector('link[data-rtk-font]') == null) {
    /**
     * Adds the following preconnect link tags for faster google font loading
     * <link rel="preconnect" href="https://fonts.googleapis.com">
     * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     */

    const p1 = document.createElement('link');

    p1.rel = 'preconnect';
    p1.setAttribute('data-rtk-font', 'true');
    p1.href = 'https://fonts.googleapis.com';

    const p2 = p1.cloneNode(true) as HTMLLinkElement;
    p2.href = 'https://fonts.gstatic.com';
    p2.crossOrigin = '';

    links.push(p1, p2);
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-rtk-font', fontFamily);
  link.href = encodeURI(
    `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights.join(';')}&display=swap`
  );

  links.push(link);

  document.head.append(...links);
};

const provideSpacing = (
  el: HTMLElement,
  spacingBase: number,
  tokenPrefix: string = DEFAULT_CSS_TOKEN_PREFIX
) => {
  spacingScale.forEach((space) => {
    el.style.setProperty(getToken(`space-${space}`, tokenPrefix), `${space * spacingBase}px`);
  });
};

const provideBorderWidth = (
  el: HTMLElement,
  borderWidth: BorderWidth,
  tokenPrefix: string = DEFAULT_CSS_TOKEN_PREFIX
) => {
  if (borderWidth in BORDER_WIDTHS) {
    const widths = BORDER_WIDTHS[borderWidth];
    Object.keys(widths).forEach((type) => {
      el.style.setProperty(getToken(`border-width-${type}`, tokenPrefix), `${widths[type]}px`);
    });
  }
};

const provideBorderRadius = (
  el: HTMLElement,
  borderRadius: BorderRadius,
  tokenPrefix: string = DEFAULT_CSS_TOKEN_PREFIX
) => {
  if (borderRadius in BORDER_RADII) {
    const radii = BORDER_RADII[borderRadius];
    Object.keys(radii).forEach((type) => {
      el.style.setProperty(getToken(`border-radius-${type}`, tokenPrefix), `${radii[type]}px`);
    });
  }
};

const provideColors = (
  el: HTMLElement,
  colors: UIColors,
  tokenPrefix: string = DEFAULT_CSS_TOKEN_PREFIX
) => {
  Object.keys(colors).forEach((color: keyof UIColors) => {
    const colorValue = colors[color];
    if (typeof colorValue === 'string') {
      if (color === 'text' || color === 'text-on-brand') {
        const rgb = hexToRGB(colorValue).join(' ');
        el.style.setProperty(getToken(`colors-${color}-1000`, tokenPrefix), `${rgb}`);
        el.style.setProperty(getToken(`colors-${color}-900`, tokenPrefix), `${rgb} / 0.88`);
        el.style.setProperty(getToken(`colors-${color}-800`, tokenPrefix), `${rgb} / 0.76`);
        el.style.setProperty(getToken(`colors-${color}-700`, tokenPrefix), `${rgb} / 0.64`);
        el.style.setProperty(getToken(`colors-${color}-600`, tokenPrefix), `${rgb} / 0.52`);
      } else {
        const rgb = hexToRGB(colorValue).join(' ');
        el.style.setProperty(getToken(`colors-${color}`, tokenPrefix), rgb);
      }
    } else if (typeof colorValue === 'object') {
      Object.keys(colorValue).forEach((shade) => {
        const shadeValue = colorValue[shade];
        const rgb = hexToRGB(shadeValue).join(' ');
        el.style.setProperty(getToken(`colors-${color}-${shade}`, tokenPrefix), rgb);
      });
    }
  });
};

/**
 * Provides the design system new tokens to consume values from for styling the RealtimeKit UI components.
 * @param el The element/node you want to _provide_ RTK Design system.
 * @param tokens The design tokens you want to updated.
 */
export const provideRtkDesignSystem = (
  el: HTMLElement,
  {
    spacingBase,
    borderRadius,
    borderWidth,
    colors,
    fontFamily,
    googleFont,
    theme,
    tokenPrefix = DEFAULT_CSS_TOKEN_PREFIX,
  }: Omit<DesignTokens, 'logo'>
) => {
  if (typeof el !== 'object') {
    throw new Error(
      '[rtk-ui-kit] (provideRtkDesignSystem): Passed element is not a valid HTML Element'
    );
  }

  if (typeof googleFont === 'string') {
    provideGoogleFont(googleFont);
    el.style.setProperty(getToken('font-family', tokenPrefix), googleFont);
  }

  if (typeof fontFamily === 'string') {
    el.style.setProperty(getToken('font-family', tokenPrefix), fontFamily);
  }

  if (typeof spacingBase === 'number') {
    provideSpacing(el, spacingBase, tokenPrefix);
  }

  if (typeof borderWidth === 'string') {
    provideBorderWidth(el, borderWidth, tokenPrefix);
  }

  if (typeof borderRadius === 'string') {
    provideBorderRadius(el, borderRadius, tokenPrefix);
  }

  if (typeof theme === 'string') {
    const colors = THEMES[theme];
    if (colors != null) provideColors(el, colors, tokenPrefix);
  }

  if (typeof colors === 'object') {
    provideColors(el, colors, tokenPrefix);
  }
};
