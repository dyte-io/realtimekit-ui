Template

```html
<rtk-breakout-rooms-manager #myId></rtk-breakout-rooms-manager>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: RtkBreakoutRoomsManager;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.rtkMeeting;
  }
}
```
