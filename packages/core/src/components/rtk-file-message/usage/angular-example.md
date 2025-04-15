```html
<rtk-file-message #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: RtkFileMessage;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentMessage.message = this.rtkMeeting.chat.messages[0]; // pick a file message
  }
}
```
