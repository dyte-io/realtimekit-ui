```html
<dyte-draft-attachment-view id="dyte-el" />

<script>
  const el = document.getElementById('dyte-el');
  el.attachment = { type: 'image', file: new File() };
  el.addEventListener('deleteAttachment', () => {
    el.attachment = null;
  });
</script>
```
