<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://dyte.io">
    <img src="https://assets.dyte.io/logo-outlined.png" alt="Logo" width="120" />
  </a>

  <h2 align="center">RealtimeKit UI for Vue</h3>

  <p align="center">
    A set of UI components to truly customize your meeting UI, in Vue
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

<!-- GETTING STARTED -->

## Getting Started

> There are separate UI Kit packages for VanillaJS and React. Check out the links to the packages below

> [UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-ui) · [React UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-react-ui)

First, you will need to install the RealtimeKit UI along with [RealtimeKit](https://npmjs.com/package/@cloudflare/realtimekit) package:

```sh
npm i @cloudflare/realtimekit-vue-ui @cloudflare/realtimekit
```

The `realtimekit` package is the package which handles all the low level logic required for a meeting by interating with our servers. Use it to create a meeting object, which you can pass along to the UI Kit components.
