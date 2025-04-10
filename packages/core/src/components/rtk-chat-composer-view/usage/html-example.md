```html
<rtk-chat-composer-view id="dyte-el" />

<script>
  const el = document.getElementById('dyte-el');
  el.addEventListener('newMessage', (event) => {
    console.log('message: ', event.detail);
  });
</script>
```
