Template

```html
<dyte-breakout-rooms-manager #myId></dyte-breakout-rooms-manager>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: DyteBreakoutRoomsManager;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.dyteMeeting;
  }
}
```
