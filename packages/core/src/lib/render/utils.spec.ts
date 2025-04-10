import { computeSelectors } from './utils';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';

const arraysAreEqual = (result: any, expected: any) => {
  expect(result.length).toBe(expected.length);
  expected.forEach((value, index) => {
    expect(result[index]).toBe(value);
  });
};

describe('computeSelectors()', () => {
  const element = 'rtk-meeting';
  let size: Size = 'sm';

  it('should work with simple arrays', () => {
    const states: States = { meeting: 'joined' };
    const config: UIConfig = {
      root: {
        'rtk-meeting': ['rtk-header'],
      },
    };
    const selectors = computeSelectors({ element, states, config, size });
    const expected = ['rtk-meeting', 'rtk-meeting.sm'];

    arraysAreEqual(selectors, expected);
  });

  it('should work with key value pairs', () => {
    size = 'md';
    const states: States = { meeting: 'joined' };
    const config: UIConfig = {
      root: {
        'rtk-meeting': { state: 'meeting' },
      },
    };

    const selectors = computeSelectors({ element, states, config, size });
    const expected = [
      'rtk-meeting',
      'rtk-meeting.md',
      'rtk-meeting[meeting=joined]',
      'rtk-meeting[meeting=joined].md',
    ];

    arraysAreEqual(selectors, expected);
  });

  it('should work with just boolean states', () => {
    size = 'lg';
    const states: States = { activeSettings: true };
    const config: UIConfig = {
      root: {
        'rtk-meeting': { states: ['activeSettings'] },
      },
    };

    const selectors = computeSelectors({ element, states, config, size });
    const expected = [
      'rtk-meeting',
      'rtk-meeting.lg',
      'rtk-meeting.activeSettings',
      'rtk-meeting.activeSettings.lg',
    ];

    arraysAreEqual(selectors, expected);
  });

  it('should work with both key-value and boolean states', () => {
    size = 'lg';
    const states: States = { meeting: 'joined', activeSettings: true };
    const config: UIConfig = {
      root: {
        'rtk-meeting': { states: ['activeSettings'], state: 'meeting' },
      },
    };

    const selectors = computeSelectors({ element, states, config, size });
    const expected = [
      'rtk-meeting',
      'rtk-meeting.lg',
      'rtk-meeting.activeSettings',
      'rtk-meeting.activeSettings.lg',
      'rtk-meeting[meeting=joined]',
      'rtk-meeting[meeting=joined].lg',
      'rtk-meeting[meeting=joined].activeSettings',
      'rtk-meeting[meeting=joined].activeSettings.lg',
    ];

    arraysAreEqual(selectors, expected);
  });
});
