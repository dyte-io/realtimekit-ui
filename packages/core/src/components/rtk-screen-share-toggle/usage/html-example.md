```html
<rtk-screen-share-toggle size="sm" class="rtk-el"></rtk-screen-share-toggle>
<rtk-screen-share-toggle size="lg" class="rtk-el"></rtk-screen-share-toggle>
<rtk-screen-share-toggle variant="horizontal" class="rtk-el"></rtk-screen-share-toggle>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
