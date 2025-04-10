```html
<dyte-livestream-player #dyteEl></dyte-livestream-player>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dyteEl') dyteEl: DyteLivestreamPlayer;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.dyteEl.meeting = dyteMeeting;
  }
}
```
