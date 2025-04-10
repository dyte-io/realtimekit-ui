```html
<dyte-channel-selector-view
  [channels]="channels"
  (channelChange)="onChannelChange($event)"
></dyte-channel-selector-view>
```

Component

```js
class MyComponent {
  channels = [
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
  ];
  onChannelChange(event) {
    console.log('selected channel:', event.detail);
  }
}
```
