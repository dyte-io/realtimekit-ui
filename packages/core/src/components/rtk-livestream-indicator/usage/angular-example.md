```html
<dyte-livestream-indicator #dyteEl></dyte-livestream-indicator>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dyteEl') dyteEl: DyteLivestreamIndicator;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.dyteEl.meeting = dyteMeeting;
  }
}
```
