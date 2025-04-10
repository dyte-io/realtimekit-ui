import { Plugin } from 'vue';
import { defineCustomElements } from '@cloudflare/realtimekit-ui/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements();
  },
};
