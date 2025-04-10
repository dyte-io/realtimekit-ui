```html
<dyte-notification id="dyte-el"></dyte-notification>

<script>
  const el = document.getElementById('dyte-el');

  el.addEventListener('dyteNotificationDismiss', (e) => {
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
