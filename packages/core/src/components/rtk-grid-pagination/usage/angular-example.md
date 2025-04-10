```html
<dyte-grid-pagination #gridPagination></dyte-grid-pagination>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('gridPagination') componentGridPagination: DyteGridPagination;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentGridPagination.message = this.dyteMeeting;
  }
}
```
