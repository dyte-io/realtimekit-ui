```html
<dyte-emoji-picker id="dyte-el"></dyte-emoji-picker>
<script>
  const el = document.getElementById('dyte-el');

  el.addEventListener('dyteEmojiClicked', (e) => {
    console.log('selected:', e.detail);
  });
</script>
```
