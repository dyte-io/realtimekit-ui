```html
<rtk-draft-attachment-view id="rtk-el" />

<script>
  const el = document.getElementById('rtk-el');
  el.attachment = { type: 'image', file: new File() };
  el.addEventListener('deleteAttachment', () => {
    el.attachment = null;
  });
</script>
```
