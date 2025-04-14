# RealtimeKit Vue UI

**RealtimeKit Vue UI** provides pre-built, ready-to-use UI components for React for integrating with [Cloudflare RealtimeKit](https://npmjs.com/package/@cloudflare/realtimekit).

This package includes Web Components that work natively in HTML — so no framework required.

If you're using a different framework or no framework (see HTML), we also offer dedicated packages:

- [React](https://npmjs.com/package/@cloudflare/realtimekit-react-ui)
- [Angular](https://npmjs.com/package/@cloudflare/realtimekit-angular-ui)
- [HTML (Web Components)](https://npmjs.com/package/@cloudflare/realtimekit-ui)

## Usage

First, install RealtimeKit Vue UI along with [RealtimeKit](https://npmjs.com/package/@cloudflare/realtimekit):

> `@cloudflare/realtimekit` is the core package that offers APIs to handle meetings in the client side.
> You use it to access and perform actions in a meeting.

```sh
npm i @cloudflare/realtimekit-vue-ui @cloudflare/realtimekit
```

Then in your Vue app's entrypoint (`main.js`), use the component library plugin:

```js
// src/main.js
import { ComponentLibrary } from '@cloudflare/realtimekit-vue-ui';

createApp(App).use(ComponentLibrary).mount('#app');
```

Now all the UI components are available for use in your Vue app.

### Simple Usage

```vue
<!-- App.vue -->
<script setup>
import RealtimeKit from '@cloudflare/realtimekit';
import { RtkMeeting } from '@cloudflare/realtimekit-vue-ui';
import { onMounted, shallowRef } from 'vue';

// NOTE: Use shallowRef, not ref
const meetingRef = shallowRef();

onMounted(() => {
  RealtimeKit.init({
    authToken,
  }).then((meeting) => {
    meetingRef.value = meeting;
  });
});
</script>

<template>
  <RtkMeeting :meeting="meetingRef" />
</template>
```

### Using RtkUiProvider

If you wish to use individual UI components to build your desired UI, you can use the `RtkUiProvider` component to provide the meeting instance to all child components to make development easier:

```vue
<!-- App.vue -->
<script setup>
import RealtimeKit from '@cloudflare/realtimekit';
import { RtkMeeting, RtkSimpleGrid } from '@cloudflare/realtimekit-vue-ui';
import { onMounted, shallowRef } from 'vue';

// NOTE: Use shallowRef, not ref
const meetingRef = shallowRef();

onMounted(() => {
  RealtimeKit.init({
    authToken,
  }).then((meeting) => {
    meetingRef.value = meeting;
  });
});
</script>

<template>
  <RtkUiProvider :meeting="meetingRef">
    <RtkSimpleGrid />
  </RtkUiProvider>
</template>
```
