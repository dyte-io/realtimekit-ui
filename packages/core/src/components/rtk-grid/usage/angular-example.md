```html
<dyte-grid #grid style="height: 360px;"></dyte-grid>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('grid') componentGrid: DyteGrid;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentGrid.message = this.dyteMeeting;
  }
}
```
