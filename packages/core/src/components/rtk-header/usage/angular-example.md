```html
<dyte-header #header></dyte-header>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('header') componentHeader: DyteHeader;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentHeader.message = this.dyteMeeting;
  }
}
```
