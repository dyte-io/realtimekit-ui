```html
<rtk-image-message-view #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: RtkImageMessageView;

  async ngAfterViewInit() {
    this.componentMessage.url = 'https://image.net/peter/jpg';
  }
}
```
