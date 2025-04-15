```html
<rtk-emoji-picker-button id="rtk-el" />

<script>
  let isActive = false;
  const el = document.getElementById('rtk-el');
  el.isActive = isActive;
  el.addEventListener('click', () => {
    el.isActive = !isActive;
  });
</script>
```
