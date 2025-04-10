```html
<dyte-emoji-picker-button id="dyte-el" />

<script>
  let isActive = false;
  const el = document.getElementById('dyte-el');
  el.isActive = isActive;
  el.addEventListener('click', () => {
    el.isActive = !isActive;
  });
</script>
```
