```html
<dyte-switch id="dyte-el"></dyte-switch>

<script>
  const el = document.getElementById('dyte-el');
  el.addEventListener('dyteChange', (e) => {
    alert('New switch value: ' + e.detail);
  });
</script>
```
