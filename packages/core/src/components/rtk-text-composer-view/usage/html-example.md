```html
<dyte-text-composer-view id="dyte-el" />

<script>
  const el = document.getElementById('dyte-el');
  el.placeholder = 'Write something...';
  el.addEventListener('textChange', (event) => {
    console.log('text: ', event.detail);
  });
</script>
```
