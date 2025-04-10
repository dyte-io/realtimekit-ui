```html
<dyte-image-message #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: DyteImageMessage;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentMessage.message = this.dyteMeeting.chat.messages[0]; // pick an image message
  }
}
```
