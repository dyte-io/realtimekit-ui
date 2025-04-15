```html
<div style="width: 360px">
  <rtk-leave-meeting #leaveMeeting></rtk-leave-meeting>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('leaveMeeting') componentLeaveMeeting: RtkLeaveMeeting;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentLeaveMeeting.meeting = rtkMeeting;
  }
}
```
