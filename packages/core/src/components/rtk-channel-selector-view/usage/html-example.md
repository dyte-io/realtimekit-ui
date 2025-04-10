```html
<dyte-channel-selector-view id="dyte-el" />

<script>
  const el = document.getElementById('dyte-el');
  el.channels = [
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
  el.addEventListener('channelChanged', (event) => {
    console.log('selected channel:', event.detail);
  });
</script>
```
