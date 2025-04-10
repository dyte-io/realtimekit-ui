```html
<dyte-ended-screen #endedScreen style="height: 360px"></dyte-ended-screen>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('endedScreen') componentEndedScreen: DyteEndedScreen;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    const config = {
      designTokens: { logo: 'https://docs.dyte.io/logo/dark.svg' },
    };
    this.componentEndedScreen.config = config;
  }
}
```
