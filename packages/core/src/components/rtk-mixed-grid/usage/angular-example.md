```html
<dyte-mixed-grid #dyteEl></dyte-mixed-grid>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dyteEl') dyteEl: DyteMixedGrid;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.dyteEl.participants = [this.dyteMeeting.self];
    this.dyteEl.pinnedParticipants = [this.dyteMeeting.self];
    this.dyteEl.screenShareParticipants = [this.dyteMeeting.self];
    this.dyteEl.plugins = [];
  }
}
```
