Template

```html
<dyte-clock #clock></dyte-clock>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('clock') componentClock: DyteClock;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentClock.meeting = this.dyteMeeting;
  }
}
```
