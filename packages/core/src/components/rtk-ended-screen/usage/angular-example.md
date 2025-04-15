```html
<rtk-ended-screen #endedScreen style="height: 360px"></rtk-ended-screen>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('endedScreen') componentEndedScreen: RtkEndedScreen;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    const config = {
      designTokens: { logo: 'https://docs.rtk.io/logo/dark.svg' },
    };
    this.componentEndedScreen.config = config;
  }
}
```
