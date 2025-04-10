import { createStore } from '@stencil/store';
import { Meeting } from '../../types/rtk-client';
import { useLanguage, type RtkI18n } from '../../lib/lang';
import { defaultIconPack, type IconPack } from '../../lib/icons';
import { type States } from '../../types/props';
import { getUserPreferences } from '../user-prefs';
import { defaultConfig, UIConfig } from '../../exports';
import { Size } from '../../exports';

export const getInitialStates = (): States => ({
  meeting: 'idle',
  prefs: getUserPreferences(),
});

export interface DyteUIStore {
  meeting: Meeting | undefined;
  t: RtkI18n;
  iconPack: IconPack;
  states: States;
  config: UIConfig;
  size: Size | undefined;
}

const uiStore = createStore<DyteUIStore>({
  meeting: undefined,
  t: useLanguage(),
  iconPack: defaultIconPack,
  states: getInitialStates(),
  config: defaultConfig,
  size: undefined,
});

const elementsMap = new Map<string, any[]>();

uiStore.use({
  set: (propName, newValue, oldValue) => {
    const elements = elementsMap.get(propName as string);
    if (elements) {
      elementsMap.set(
        propName as string,
        elements.filter((element) => {
          const currentValue = element[propName];
          if (currentValue === oldValue) {
            element[propName] = newValue;
            return true;
          } else {
            return false;
          }
        })
      );
    }
  },
});

function appendElement(propName: string, element: any) {
  const elements = elementsMap.get(propName);
  if (!elements) {
    elementsMap.set(propName, [element]);
  } else {
    elements.push(element);
  }
}

function removeElement(propName: string, element: any) {
  const elements = elementsMap.get(propName);
  if (elements && elements.length > 0) {
    const index = elements.indexOf(element);
    if (index !== -1) {
      elements.splice(index, 1);
      elementsMap.set(propName, elements);
    }
  }
}

const uiState = uiStore.state;

export { uiStore, uiState, appendElement, removeElement };
