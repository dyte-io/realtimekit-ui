```html
<div style="width: 360px">
  <dyte-leave-meeting #leaveMeeting></dyte-leave-meeting>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('leaveMeeting') componentLeaveMeeting: DyteLeaveMeeting;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentLeaveMeeting.meeting = dyteMeeting;
  }
}
```
