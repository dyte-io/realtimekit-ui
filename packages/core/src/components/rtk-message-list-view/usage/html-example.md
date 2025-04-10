```html
<dyte-message-list-view id="list"></dyte-message-list-view>
```

```js
const $list = document.getElementById('list');
$list.messages = [{ id: 'unique-123', text: 'Hello!!' }];
$list.renderer = (message, index) => {
  const $messageEl = document.createElement('div');
  $messageEl.innerHTML = `<span>${message.text}</span>`;
  return $messageEl;
};
$list.loadMore = (lastMessage) => {
  const oldMessages = fetchOlderMessages(lastMessage);
  return oldMessages;
};
```
