```jsx live
<DyteNotification
  notification={{
    id: 'your-id',
    message: 'Vaibhav says hi!',
    image: 'https://github.com/vaibhavshn.png',
    button: {
      text: 'Say Hi back',
      variant: 'ghost',
      onClick: () => alert('Hey'),
    },
  }}
  onDyteNotificationDismiss={(e) => {
    e.target.remove();
  }}
/>
```
