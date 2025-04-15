```jsx live
<RtkNotification
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
  onRtkNotificationDismiss={(e) => {
    e.target.remove();
  }}
/>
```
