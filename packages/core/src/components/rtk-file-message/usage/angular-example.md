```html
<dyte-file-message #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: DyteFileMessage;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentMessage.message = this.dyteMeeting.chat.messages[0]; // pick a file message
  }
}
```
