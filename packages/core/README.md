<!-- PROJECT LOGO -->
<p align="center">
  <h2 align="center">RealtimeKit UI by Cloudflare</h3>

  <p align="center">
    A set of UI components to truly customize your meeting UI
    <br />
    <a href="https://docs.dyte.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://community.dyte.io">Report Bug</a>
    ·
    <a href="https://community.dyte.io">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [About](#about)

<!-- GETTING STARTED -->

## Getting Started

> There are separate UI Kit packages for React and Angular because they don't fully support Web Components natively yet. Check out the links to the packages below

> [React UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-react-ui) · [Angular UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-angular-ui)

First, you will need to install the ui-kit along with the [web-core](https://npmjs.com/package/@dytesdk/web-core) package:

```sh
npm i @cloudflare/realtimekit-ui @dytesdk/web-core
```

The `web-core` package is the package which handles all the low level logic required for a meeting by interating with our servers. Use it to create a meeting object, which you can pass along to the UI Kit components.

## Usage

You'll need to initialize a meeting object first.

```js
const meeting = await DyteClient.init({
  roomName: '<room-name>',
  authToken: '<auth-token>',
  defaults: {
    video: true,
    audio: true,
  },
});
```

You can now pass this object to most of the components, like so (with Vanilla JS, HTML):

```html
<!-- Load the component -->
<rtk-meeting id="my-meeting"></rtk-meeting>

<script>
  const init = async () => {
    const meeting = await DyteClient.init({
      authToken: '<auth-token>',
      roomName: '<room-name>',
      defaults: {
        video: true,
        audio: true,
      },
    });

    const meetingEl = document.getElementById('my-meeting');
    meetingEl.meeting = meeting;
  };

  init();
</script>
```

## About

`realtimekit-ui` is created & maintained by Cloudflare.
