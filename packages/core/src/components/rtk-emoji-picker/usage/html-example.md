```html
<rtk-emoji-picker id="rtk-el"></rtk-emoji-picker>
<script>
  const el = document.getElementById('rtk-el');

  el.addEventListener('rtkEmojiClicked', (e) => {
    console.log('selected:', e.detail);
  });
</script>
```
