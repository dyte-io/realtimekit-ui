import { UIConfig } from '../../exports';
import { UIRoot, Element as E, StyleProps } from '../../types/ui-config/root';
import { defaultConfig } from '../default-ui-config';

type UIElem = UIRoot['string'];
type FullUIElem = Exclude<UIElem, E[]>;
type KeyValuePair = { [key: string]: string };
/* eslint-disable no-console */
/*
    Elements can be of two types
    'rtk-mic-toggle' or ['rtk-mic-toggle', {prop: 1}]
    Custom findByName function to check for both
*/
function getFinder(query: string) {
  return (value: E) => {
    if (Array.isArray(value)) {
      return value[0] === query;
    }
    return value === query;
  };
}

/*
    Elements can be of two types
    'rtk-mic-toggle' or ['rtk-mic-toggle', {prop: 1}]
    Custom filterByName function to check for both
*/
function getFilter(query: string) {
  return (value: E) => {
    if (Array.isArray(value)) {
      return value[0] !== query;
    }
    return value !== query;
  };
}

/*
    transform JSX Component Name -> web component format
    eg. RtkMicToggle -> rtk-mic-toggle
*/
function convertComponentName(jsxName: string) {
  return jsxName.replace(/([a-z])([A-Z])/g, (g) => `${g[0]}-${g[1]}`.toLowerCase());
}

export class UIElemEditor {
  private elem: UIElem;
  private config: UIConfig;
  private keyString: string;

  constructor(elem: UIElem, config: UIConfig, keyString: string) {
    this.elem = elem;
    this.config = config;
    this.keyString = keyString;
  }

  /**
   * Adds an element to the chilren
   * @param el :Name of the element - `rtk-mic-toggle`
   * @param props :Optional props for the element `{variant: 'solid'}`
   */
  add(el: string, props: KeyValuePair = {}) {
    el = convertComponentName(el);
    let composedElem: string | [string, KeyValuePair] = el;
    if (Object.keys(props).length > 0) {
      composedElem = [el, props];
    }
    if (Array.isArray(this.elem)) {
      this.elem.push(composedElem);
    } else if ('children' in this.elem && Array.isArray(this.elem.children)) {
      this.elem.children = [...this.elem.children, composedElem];
    } else if (
      'remove' in this.elem &&
      Array.isArray(this.elem.remove) &&
      this.elem.remove.find(getFinder(el))
    ) {
      this.elem.remove = this.elem.remove.filter(getFilter(el));
    } else {
      if (!('add' in this.elem)) {
        this.elem.add = [];
      }
      this.elem.add?.push(composedElem);
    }
    return this;
  }

  /**
   * Removes an element from the chilren
   * @param el :Name of the element to remove - `rtk-mic-toggle`
   */
  remove(el: string) {
    el = convertComponentName(el);
    if (Array.isArray(this.elem)) {
      const idx = this.elem.findIndex(getFinder(el));
      if (idx > -1) {
        this.elem.splice(idx, 1);
      }
    } else if ('children' in this.elem && Array.isArray(this.elem.children)) {
      this.elem.children = this.elem.children.filter(getFilter(el));
    } else if (
      'add' in this.elem &&
      Array.isArray(this.elem.add) &&
      this.elem.add.find((e) => e === el)
    ) {
      this.elem.add = this.elem.add.filter(getFilter(el));
    } else {
      if (!('remove' in this.elem)) {
        this.elem.remove = [];
      }
      this.elem.remove?.push(el);
    }
    return this;
  }

  set style(s: StyleProps) {
    console.log(s);
    // TODO: Not Implemented
  }

  setChildrenProps(childElem: string, props: KeyValuePair) {
    console.log(this.keyString, childElem, props);
    // TODO: Not Implemented
  }

  getChildrenProps(childElem: string): KeyValuePair {
    console.log(this.keyString, childElem);
    // TODO: Not Implemented
    return {};
  }

  replace(e: HTMLElement) {
    console.log(this.config, e);
    // TODO: Not Implemented
  }
}
/* eslint-enable no-console */

export class RtkUiBuilder {
  private config: UIConfig;

  constructor(config?: UIConfig) {
    this.config = config || defaultConfig;
  }

  /**
   * Find an element anywhere in the hierarachy and returns an editor object
   * @param elem = 'rtk-participant-tile'
   * @param states = { activeSidebar: true, activeSettings: true, meeting: 'joined'}
   * @returns `UIElemEditor`
   */
  find(elem: string, states: { [key: string]: string | boolean } = {}): UIElemEditor | undefined {
    elem = convertComponentName(elem);
    // eg. [activeSidebar, activeSettings]
    const booleanStates: string[] = [];
    // eg. [[meeting,joined]]
    const nonBooleanStates: [string, string][] = [];

    Object.keys(states || {}).forEach((key) => {
      if (typeof states[key] === 'boolean') {
        booleanStates.push(key);
      } else {
        nonBooleanStates.push([key, states[key] as string]);
      }
    });
    booleanStates.sort();
    const root = this.config.root;
    if (root === undefined) return;

    let keyString = elem;
    let booleanStateString = '';

    if (booleanStates.length > 0) {
      // eg. '.activeSettings.activeSidebar'
      booleanStateString = `.${booleanStates.join('.')}`;
      // eg. 'rtk-participant-tile.activeSettings.activeSidebar'
      keyString = `${elem}${booleanStateString}`;

      // An element will only re-render when a state described in its `states` key changes
      // If the element has no states defined, ie. just array of children
      // convert to a complex element type
      if (Array.isArray(root[elem])) {
        root[elem] = {
          states: [],
          children: root[elem] as E[],
        };
      }
      if ((root[elem] as FullUIElem).states === undefined) {
        (root[elem] as FullUIElem).states = [];
      }
      // Add each boolean state if it is not there already
      booleanStates.forEach((e) => {
        if ((root[elem] as FullUIElem).states?.indexOf(e) === -1) {
          (root[elem] as FullUIElem).states?.push(e);
        }
      });
    }
    if (nonBooleanStates.length > 0) {
      nonBooleanStates.forEach((k) => {
        // eg. '[meeting=joined]'
        const v = `[${k[0]}=${k[1]}]`;
        // eg. 'rtk-participant-tile[meeting=joined].activeSettings.activeSidebar'
        keyString = `${elem}${v}${booleanStateString}`;

        // An element will only re-render when a state described in its `states` key changes
        // If the element has no states defined, ie. just array of children
        // convert to a complex element type
        if (Array.isArray(root[elem])) {
          root[elem] = {
            state: k[0],
            children: root[elem] as E[],
          };
        }
      });
    }

    let target = root[keyString];

    if (target === undefined) {
      root[keyString] = {};
      target = root[keyString];
    }

    return new UIElemEditor(target, this.config, keyString);
  }

  build() {
    return this.config;
  }
}
