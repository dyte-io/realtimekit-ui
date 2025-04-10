```html
<dyte-image-message-view #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: DyteImageMessageView;

  async ngAfterViewInit() {
    this.componentMessage.url = 'https://image.net/peter/jpg';
  }
}
```
