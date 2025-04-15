Template

```html
<rtk-chat
  #chat
  style="height: '480px'; maxWidth: '320px'; backgroundColor: '#000';"
></rtk-chat>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('chat') componentChat: RtkChat;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentChat.meeting = this.rtkMeeting;
  }
}
```
