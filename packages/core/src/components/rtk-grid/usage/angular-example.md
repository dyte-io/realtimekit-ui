```html
<rtk-grid #grid style="height: 360px;"></rtk-grid>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('grid') componentGrid: RtkGrid;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentGrid.message = this.rtkMeeting;
  }
}
```
