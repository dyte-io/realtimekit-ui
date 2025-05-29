```html
<rtk-livestream-indicator #rtkEl></rtk-livestream-indicator>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('rtkEl') rtkEl: RtkLivestreamIndicator;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.rtkEl.meeting = rtkMeeting;
  }
}
```
