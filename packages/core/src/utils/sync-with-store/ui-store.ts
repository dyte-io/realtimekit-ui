import { createStore } from '@stencil/store';
import { Meeting, RealtimeKitClient } from '../../types/rtk-client';
import { useLanguage, type RtkI18n } from '../../lib/lang';
import { defaultIconPack, type IconPack } from '../../lib/icons';
import { type States } from '../../types/props';
import { getUserPreferences } from '../user-prefs';
import { createDefaultConfig, UIConfig } from '../../exports';
import { Size } from '../../exports';

export const getInitialStates = (peerId?: string): States => ({
  meeting: 'idle',
  prefs: getUserPreferences(),
  peerId: peerId || 'LEGACY_GLOBAL_PEER',
});

export interface RtkUiStore {
  meeting: Meeting | undefined;
  t: RtkI18n;
  iconPack: IconPack;
  states: States;
  config: UIConfig;
  size: Size | undefined;
  peerId: string | null;
}

// Extended type for stores that have elementsMap attached
export type RtkUiStoreExtended = ReturnType<typeof createStore<RtkUiStore>> & {
  elementsMap: Map<string, HTMLElement[]>;
};

const uiStore = createStore<RtkUiStore>({
  meeting: undefined,
  t: useLanguage(),
  iconPack: defaultIconPack,
  states: getInitialStates(),
  config: createDefaultConfig(),
  size: undefined,
  peerId: null,
});

const elementsMap = new Map<string, any[]>();

// Attach elementsMap to global store for consistency
(uiStore as any).elementsMap = elementsMap;

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

const uiState = uiStore.state;

export { uiStore, uiState };

// Function to create a new store instance for peer-specific stores
export function createPeerStore({meeting, config}: {meeting: RealtimeKitClient, config?: UIConfig}): RtkUiStoreExtended {
  console.log(`Creating peer store for: ${meeting.self.id}`);
  const store = createStore<RtkUiStore>({
    meeting: meeting,
    t: useLanguage(),
    iconPack: defaultIconPack,
    states: getInitialStates(meeting.self.peerId),
    config: config || createDefaultConfig(),
    size: undefined,
    peerId: meeting.self.id,
  });

  const peerElementsMap = new Map<string, any[]>();
  
  // Attach elementsMap to store so appendElement/removeElement can access it
  (store as RtkUiStoreExtended).elementsMap = peerElementsMap;

  store.use({
    set: (propName, newValue, oldValue) => {
      const elements = peerElementsMap.get(propName as string);
      if (elements) {
        peerElementsMap.set(
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

  console.log(`Created peer store for: ${meeting.self.id}`, store);
  return store as RtkUiStoreExtended;
}

function appendElement(propName: string, element: HTMLElement, targetStore: RtkUiStoreExtended = uiStore as RtkUiStoreExtended) {
  console.log(`appendElement called: propName=${propName}, element=${element.tagName}`);
  console.log(`appendElement: targetStore type:`, typeof targetStore);
  console.log(`appendElement: targetStore keys:`, Object.keys(targetStore));
  console.log(`appendElement: targetStore.elementsMap exists:`, !!targetStore.elementsMap);
  console.log(`appendElement: targetStore === uiStore:`, targetStore === uiStore);
  
  // All stores now have elementsMap attached
  let elementsMapToUse = targetStore.elementsMap;
  
  // Fallback: if elementsMap is not directly attached, try to find it
  if (!elementsMapToUse) {
    console.log(`appendElement: No direct elementsMap, checking alternatives...`);
    
    // Check if it's the global store
    if (targetStore === uiStore) {
      console.log(`appendElement: Using global elementsMap as fallback`);
      elementsMapToUse = elementsMap;
    } else {
      // For peer stores, try to access the elementsMap that should be attached
      console.log(`appendElement: Peer store without elementsMap, checking store structure:`, targetStore);
      console.error(`appendElement: No elementsMap found on peer store`, targetStore);
      return;
    }
  }
  
  if (!elementsMapToUse) {
    console.error(`appendElement: No elementsMap found on store`, targetStore);
    return;
  }
  
  console.log(`appendElement: About to get elements for propName: ${propName}`);
  const elements = elementsMapToUse.get(propName);
  console.log(`appendElement: Got elements:`, elements);
  
  if (!elements) {
    console.log(`appendElement: Creating new elements array for ${propName}`);
    try {
      elementsMapToUse.set(propName, [element]);
      console.log(`appendElement: Successfully set new array for ${propName}`);
    } catch (error) {
      console.error(`appendElement: Error setting new array:`, error);
    }
  } else {
    console.log(`appendElement: Adding element to existing array for ${propName}, current count: ${elements.length}`);
    try {
      elements.push(element);
      console.log(`appendElement: Successfully added element, new count: ${elements.length}`);
    } catch (error) {
      console.error(`appendElement: Error adding element:`, error);
    }
  }
  
  console.log(`appendElement: Completed for ${propName}`);
}

function removeElement(propName: string, element: HTMLElement, targetStore: RtkUiStoreExtended = uiStore as RtkUiStoreExtended) {
  console.log(`removeElement called: propName=${propName}, element=${element.tagName}`);
  
  // All stores now have elementsMap attached
  let elementsMapToUse = targetStore.elementsMap;
  
  // Fallback: if elementsMap is not directly attached, try to find it
  if (!elementsMapToUse) {
    console.log(`removeElement: No direct elementsMap, using fallback...`);
    
    // Check if it's the global store
    if (targetStore === uiStore) {
      elementsMapToUse = elementsMap;
    } else {
      console.error(`removeElement: No elementsMap found on peer store`, targetStore);
      return;
    }
  }

  const elements = elementsMapToUse.get(propName);
  if (elements) {
    const index = elements.indexOf(element);
    if (index > -1) {
      elements.splice(index, 1);
      console.log(`removeElement: Removed element from ${propName}, remaining count: ${elements.length}`);
    }
  }
}

export { appendElement, removeElement };
