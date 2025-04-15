Template

```html
<rtk-clock #clock></rtk-clock>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('clock') componentClock: RtkClock;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentClock.meeting = this.rtkMeeting;
  }
}
```
