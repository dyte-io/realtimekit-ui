```html
<rtk-meeting
  #myId
  mode="fill"
  style="height: 480px; width: 100%"
></rtk-meeting>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: RtkMeeting;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.rtkMeeting;
  }
}
```
