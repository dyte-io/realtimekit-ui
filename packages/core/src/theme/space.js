const spacingScale = require('./spacing-scale.json');

/**
 * Get spacing config for tailwindcss from a base
 * @param {number} [base=4] Base for spacing, default is 4
 */
const getSpacingConfig = (base = 4) => {
  const spacing = {};
  spacingScale.forEach((multiplier) => {
    spacing[multiplier] = `var(--rtk-space-${multiplier.toString().replace('.', '\\.')}, ${
      multiplier * base
    }px)`;
  });
  return spacing;
};

module.exports = { spacingScale, getSpacingConfig };
