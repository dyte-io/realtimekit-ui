import { getElement, ComponentInterface } from '@stencil/core';
import { uiStore as store, appendElement, removeElement, type RtkUiStore, type RtkUiStoreExtended } from './ui-store';

// Cache to remember which elements should use global store (after timeout)
const useGlobalStoreCache = new WeakSet<HTMLElement>();

export function SyncWithStore() {
  // Provider availability tracking per decorator instance (per component type)
  let providerAvailable: boolean | null = null; // null = unknown, true = available, false = not available

  return function (proto: ComponentInterface, propName: keyof RtkUiStore) {
    const { connectedCallback, disconnectedCallback } = proto;

    proto.connectedCallback = function () {
      const host = getElement(this);
      const value = host[propName as string];

      // If we've already determined this element should use global store, use it directly
      if (useGlobalStoreCache.has(host) || providerAvailable === false) {
        if (!value) {
          const storeValue = store.state[propName];
          host[propName as string] = storeValue;
          appendElement(propName, host, store as RtkUiStoreExtended);
        }
        return connectedCallback?.call(this);
      }

      // Try to get store from provider
      let receivedStore: RtkUiStoreExtended | null = null;
      let responseReceived = false;

      // Listen for provider response
      const storeResponseListener = (event: CustomEvent<{store: RtkUiStoreExtended, requestId: string}>) => {
        const requestId = (host as any)._storeRequestId;
        if (event.detail.requestId === requestId) {
          console.info(`Received store for ${host.tagName}:${propName}`, event.detail.store);
          receivedStore = event.detail.store;
          responseReceived = true;
          providerAvailable = true; // Mark provider as available for this decorator instance
          document.removeEventListener('rtkProvideStore', storeResponseListener);
        }
      };

      document.addEventListener('rtkProvideStore', storeResponseListener);

      // Generate unique request ID
      const requestId = `${host.tagName}-${Date.now()}-${Math.random()}`;
      (host as any)._storeRequestId = requestId;

      // Request store from provider
      const requestEvent = new CustomEvent('rtkRequestStore', {
        detail: { element: host, propName, requestId },
        bubbles: true,
        composed: true // Allow event to cross shadow DOM boundaries
      });
      console.info(`Requesting store for ${host.tagName}:${propName}`);
      host.dispatchEvent(requestEvent);

      // Wait 100ms for response only if we haven't determined provider availability yet
      const waitTime = providerAvailable === null ? 100 : 0;
      
      setTimeout(() => {
        document.removeEventListener('rtkProvideStore', storeResponseListener);
        
        const targetStore = receivedStore || store;
        
        // If no response received and this was our first attempt, mark provider as unavailable
        if (!responseReceived && providerAvailable === null) {
          providerAvailable = false;
          console.info(`No Store response received for ${host.tagName}:${propName}. Using global store.`);
          useGlobalStoreCache.add(host);
        }

        if (!value) {
          const storeValue = targetStore.state[propName];
          host[propName as string] = storeValue;
          appendElement(propName, host, targetStore as RtkUiStoreExtended);
        }
      }, waitTime);

      return connectedCallback?.call(this);
    };

    proto.disconnectedCallback = function () {
      const host = getElement(this);
      
      // Try to determine which store was used
      let targetStore = store; // default fallback
      
      // If we have a cached decision to use global store, use it
      if (useGlobalStoreCache.has(host)) {
        targetStore = store;
      } else {
        // Try to get current store (this might not work reliably, but we'll try)
        // In most cases, removeElement with global store should handle cleanup
        targetStore = store;
      }
      
      removeElement(propName, host, targetStore as RtkUiStoreExtended);
      
      // Clean up cache entry
      useGlobalStoreCache.delete(host);
      
      return disconnectedCallback?.call(this);
    };
  };
}
