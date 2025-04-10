```html
<dyte-file-picker-button id="file-el" />
<dyte-file-picker-button id="image-el" />

<script>
  const imageEl = document.getElementById('file-el');
  fileEl.addEventListener('fileChange', (event) => {
    console.log('file: ', event.detail);
  });

  const imageEl = document.getElementById('image-el');
  imageEl.filter = 'image/*';
  imageEl.label = 'Upload Image';
  imageEl.icon = 'image';
  imageEl.addEventListener('fileChange', (event) => {
    console.log('image: ', event.detail);
  });
</script>
```
