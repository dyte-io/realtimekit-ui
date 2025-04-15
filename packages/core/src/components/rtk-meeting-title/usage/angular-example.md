```html
<rtk-meeting-title #rtkEl></rtk-meeting-title>
```

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('rtkEl') rtkEl: RtkMeetingTitle;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.rtkEl.meeting = rtkMeeting;
  }
}
```
