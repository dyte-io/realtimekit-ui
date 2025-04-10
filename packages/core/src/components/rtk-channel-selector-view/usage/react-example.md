```jsx live
<DyteDraftAttachmentView
  channels={[
    {
      id: '123',
      name: 'general',
      latestMessage: 'Good morning!',
      latestMessageTime: new Date(),
      unreadCount: 1,
    },
    {
      id: '321',
      name: 'alerts',
      unreadCount: 420,
    },
  ]}
  onChannelChanged={(event) => console.log('selected channel:', event.detail)}
/>
```
