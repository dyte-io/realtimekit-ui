```html
<dyte-network-indicator #myEl></dyte-network-indicator>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myEl') component: DyteNetworkIndicator;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.component.participant = this.dyteMeeting.self;
    this.component.meeting = this.dyteMeeting;
  }
}
```
