```html
<rtk-chat-composer-view id="rtk-el" />

<script>
  const el = document.getElementById('rtk-el');
  el.addEventListener('newMessage', (event) => {
    console.log('message: ', event.detail);
  });
</script>
```
