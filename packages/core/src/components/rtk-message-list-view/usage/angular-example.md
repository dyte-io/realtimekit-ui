```html
<dyte-message-list-view
  [messages]="messages"
  [renderer]="renderer"
  [loadMore]="loadMore"
  #list
></dyte-message-list-view>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('list') componentList: DyteMessageListView;

  async ngOnInit() {
    this.messages = [{ id: 'unique-123', text: 'Hello!!' }];
    this.renderer = (message, index) => {
      const $messageEl = document.createElement('div');
      $messageEl.innerHTML = `<span>${message.text}</span>`;
      return $messageEl;
    };
    this.loadMore = (lastMessage) => {
      const oldMessages = fetchOlderMessages(lastMessage);
      return oldMessages;
    };
  }
}
```
