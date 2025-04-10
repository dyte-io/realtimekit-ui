```html
<dyte-meeting
  #myId
  mode="fill"
  style="height: 480px; width: 100%"
></dyte-meeting>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: DyteMeeting;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.component.meeting = this.dyteMeeting;
  }
}
```
