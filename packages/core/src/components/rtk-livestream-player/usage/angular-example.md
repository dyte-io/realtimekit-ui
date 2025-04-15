```html
<rtk-livestream-player #rtkEl></rtk-livestream-player>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('rtkEl') rtkEl: RtkLivestreamPlayer;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.rtkEl.meeting = rtkMeeting;
  }
}
```
