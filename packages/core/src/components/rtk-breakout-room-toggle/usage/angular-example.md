Template

```html
<dyte-breakout-rooms-toggle #myId></dyte-breakout-rooms-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: DyteBreakoutRoomsToggle;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.dyteMeeting;
  }
}
```
