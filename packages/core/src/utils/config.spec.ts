import { extendConfig } from './config';

describe('extendConfig()', () => {
  it('should work with just designTokens', () => {
    const newConfig = extendConfig({ designTokens: { logo: 'new-logo' } });

    expect(newConfig.designTokens.logo).toBe('new-logo');
    expect(newConfig.designTokens.spacingBase).toBe(4);
    expect(newConfig.config.videoFit).toBe('cover');
  });

  it('should work with root property', () => {
    const newConfig = extendConfig({
      root: {
        'rtk-name-tag.someState': ['rtk-avatar'],
      },
    });

    expect(newConfig.designTokens.spacingBase).toBe(4);
    expect(newConfig.root['rtk-name-tag.someState'][0]).toBe('rtk-avatar');
  });
});
