<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://dyte.io">
    <img src="https://assets.dyte.io/logo-outlined.png" alt="Logo" width="120" />
  </a>

  <h2 align="center">UI Kit by dyte</h3>

  <p align="center">
    A set of UI components to truly customize your meeting UI
    <br />
    <a href="https://docs.dyte.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://app.dyte.io">View Demo</a>
    ·
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
- [License](#license)
- [Contributing](#contributing)

<!-- GETTING STARTED -->

## Getting Started

> There are separate UI Kit packages for React and Angular because they don't fully support Web Components natively yet. Check out the links to the packages below

> [React UI Kit](https://npmjs.com/package/@dytesdk/react-ui-kit) · [Angular UI Kit](https://npmjs.com/package/@dytesdk/angular-ui-kit)

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
<dyte-meeting id="my-meeting"></dyte-meeting>

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

`ui-kit` is created & maintained by Dyte, Inc. You can find us on Twitter - [@dyte_io](https://twitter.com/dyte_io) or write to us at `dev [at] dyte.io`.

This is a monorepo for all of Dyte's UI Kit packages.

Here is a short description for all the packages:

| Path                                             | Description                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`packages/core`](./packages/core)               | The main source code for all Stencil components. You will write code primarily in this directory. |
| [`packages/react`](./packages/react-library)     | The React UI Kit wrapper package                                                                  |
| [`packages/angular`](./packages/angular-library) | The Angular UI Kit wrapper package                                                                |
| [`packages/vue`](./packages/vue-library)         | The Vue UI Kit wrapper package                                                                    |

## License

This package is licensed under Apache v2.0, for more details, check out [LICENSE](./LICENSE).

## Contributing

To get started, you need to first make changes in the `packages/core` directory.
You can find the code for each component in [packages/core/src/components](packages/core/src/components).

You need to `cd` into `packages/core` directory and run `npm start`.

After your changes are made, you need to `cd` to the root and then run `npm run build`, so that the wrapper code also gets updated.

Take a look at out [contributing guidelines](./CONTRIBUTING.md) before you start contributing!

The names and logos for Dyte are trademarks of Dyte, Inc.

We love open source software! See [our other projects](https://github.com/dyte-io) and [our products](https://dyte.io).
