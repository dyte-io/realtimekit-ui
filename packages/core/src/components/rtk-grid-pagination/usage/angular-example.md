```html
<rtk-grid-pagination #gridPagination></rtk-grid-pagination>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('gridPagination') componentGridPagination: RtkGridPagination;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentGridPagination.message = this.rtkMeeting;
  }
}
```
