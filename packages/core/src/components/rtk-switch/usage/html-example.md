```html
<rtk-switch id="rtk-el"></rtk-switch>

<script>
  const el = document.getElementById('rtk-el');
  el.addEventListener('rtkChange', (e) => {
    alert('New switch value: ' + e.detail);
  });
</script>
```
