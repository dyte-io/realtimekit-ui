```html
<dyte-file-message-view #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: DyteFileMessageView;

  async ngAfterViewInit() {
    this.componentMessage.name = 'bonus.pdf';
    this.componentMessage.size = 1024;
    this.componentMessage.url = 'https://company.co/peter/2023/bonus.pdf';
  }
}
```
