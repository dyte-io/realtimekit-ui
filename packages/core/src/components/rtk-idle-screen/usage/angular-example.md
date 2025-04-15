```html
<rtk-idle-screen #idleScreen style="height: 360px"></rtk-idle-screen>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('idleScreen') componentIdleScreen: RtkIdleScreen;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    const config = {
      designTokens: { logo: 'https://docs.rtk.io/logo/dark.svg' },
    };
    this.componentIdleScreen.config = config;
  }
}
```
