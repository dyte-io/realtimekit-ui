Template

```html
<rtk-breakout-rooms-toggle #myId></rtk-breakout-rooms-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: RtkBreakoutRoomsToggle;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.rtkMeeting;
  }
}
```
