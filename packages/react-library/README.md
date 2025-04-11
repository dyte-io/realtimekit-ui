<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://dyte.io">
    <img src="https://assets.dyte.io/logo-outlined.png" alt="Logo" width="120" />
  </a>

  <h2 align="center">RealtimeKit UI for React</h3>

  <p align="center">
    A set of UI components to truly customize your meeting UI, in React
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

> There are separate UI Kit packages for VanillaJS and Angular. Check out the links to the packages below

> [UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-ui) · [Angular UI Kit](https://npmjs.com/package/@cloudflare/realtimekit-angular-ui)

First, you will need to install the RealtimeKit UI along with the [RealtimeKit](https://npmjs.com/package/@cloudflare/realtimekit) package:

```sh
npm i @cloudflare/realtimekit-react-ui @cloudflare/realtimekit
```

## Usage

Use the `useDyteClient()` hook to initialize a client

```jsx
function App() {
  const [client, initClient] = useDyteClient();

  useEffect(() => {
    initClient({
      authToken: '<auth-token>',
      roomName: '<room-name>',
      defaults: {
        audio: true,
        video: true,
      },
    });
  }, []);

  return <RtkMeeting meeting={client} />;
}
```
