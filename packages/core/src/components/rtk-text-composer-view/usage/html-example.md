```html
<rtk-text-composer-view id="rtk-el" />

<script>
  const el = document.getElementById('rtk-el');
  el.placeholder = 'Write something...';
  el.addEventListener('textChange', (event) => {
    console.log('text: ', event.detail);
  });
</script>
```
