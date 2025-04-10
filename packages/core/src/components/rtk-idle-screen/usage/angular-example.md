```html
<dyte-idle-screen #idleScreen style="height: 360px"></dyte-idle-screen>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('idleScreen') componentIdleScreen: DyteIdleScreen;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    const config = {
      designTokens: { logo: 'https://docs.dyte.io/logo/dark.svg' },
    };
    this.componentIdleScreen.config = config;
  }
}
```
