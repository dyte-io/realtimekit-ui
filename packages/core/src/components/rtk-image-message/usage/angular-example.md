```html
<rtk-image-message #message />
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: RtkImageMessage;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentMessage.message = this.rtkMeeting.chat.messages[0]; // pick an image message
  }
}
```
