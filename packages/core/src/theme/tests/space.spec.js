const { getSpacingConfig } = require('../space.js');

describe('spacing config for tailwindcss', () => {
  it('normal scale values are generated with default base: 4', () => {
    const spacing = getSpacingConfig();
    expect(spacing[0]).toBe('var(--rtk-space-0, 0px)');
    expect(spacing[10]).toBe('var(--rtk-space-10, 40px)');
    expect(spacing[0.5]).toBe('var(--rtk-space-0\\.5, 2px)');
  });

  it('normal scale values are generated with a custom base: 3', () => {
    const spacing = getSpacingConfig(3);
    expect(spacing[0]).toBe('var(--rtk-space-0, 0px)');
    expect(spacing[10]).toBe('var(--rtk-space-10, 30px)');
    expect(spacing[0.5]).toBe('var(--rtk-space-0\\.5, 1.5px)');
  });
});
