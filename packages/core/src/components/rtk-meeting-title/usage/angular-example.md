```html
<dyte-meeting-title #dyteEl></dyte-meeting-title>
```

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dyteEl') dyteEl: DyteMeetingTitle;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.dyteEl.meeting = dyteMeeting;
  }
}
```
