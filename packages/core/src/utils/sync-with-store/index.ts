import { getElement, ComponentInterface } from '@stencil/core';
import { uiStore as store, appendElement, removeElement, type RtkUiStore } from './ui-store';

export function SyncWithStore() {
  return function (proto: ComponentInterface, propName: keyof RtkUiStore) {
    const { connectedCallback, disconnectedCallback } = proto;

    proto.connectedCallback = function () {
      const host = getElement(this);
      const value = host[propName as string];

      if (!value) {
        const storeValue = store.state[propName];
        host[propName as string] = storeValue;
        appendElement(propName, host);
      }

      return connectedCallback?.call(this);
    };

    proto.disconnectedCallback = function () {
      removeElement(propName, getElement(this));
      return disconnectedCallback?.call(this);
    };
  };
}
