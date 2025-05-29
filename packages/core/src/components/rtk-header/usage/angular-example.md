```html
<rtk-header #header></rtk-header>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('header') componentHeader: RtkHeader;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentHeader.message = this.rtkMeeting;
  }
}
```
