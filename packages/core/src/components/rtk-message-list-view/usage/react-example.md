```jsx live
<RtkMessageListView
  messages={messages}
  renderer={(message, index) => {
    return <div>{message.text}</div>;
  }}
  loadMore={(lastMessage) => {
    const oldMessages = fetchOlderMessages(lastMessage);
    return oldMessages;
  }}
></RtkMessageListView>
```
