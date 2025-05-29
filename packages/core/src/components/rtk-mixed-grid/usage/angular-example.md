```html
<rtk-mixed-grid #rtkEl></rtk-mixed-grid>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('rtkEl') rtkEl: RtkMixedGrid;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.rtkEl.participants = [this.rtkMeeting.self];
    this.rtkEl.pinnedParticipants = [this.rtkMeeting.self];
    this.rtkEl.screenShareParticipants = [this.rtkMeeting.self];
    this.rtkEl.plugins = [];
  }
}
```
