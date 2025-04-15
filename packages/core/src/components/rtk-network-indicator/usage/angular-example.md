```html
<rtk-network-indicator #myEl></rtk-network-indicator>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myEl') component: RtkNetworkIndicator;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.component.participant = this.rtkMeeting.self;
    this.component.meeting = this.rtkMeeting;
  }
}
```
