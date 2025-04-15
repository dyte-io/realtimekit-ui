```html
<rtk-notification id="rtk-el"></rtk-notification>

<script>
  const el = document.getElementById('rtk-el');

  el.addEventListener('rtkNotificationDismiss', (e) => {
    e.target.remove();
  });

  el.notification = {
    id: 'your-id',
    message: 'Vaibhav says hi!',
    image: 'https://github.com/vaibhavshn.png',
    button: {
      text: 'Say Hi back',
      variant: 'ghost',
      onClick: () => alert('Hey'),
    },
  };
</script>
```
