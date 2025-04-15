```html
<rtk-livestream-toggle size="sm" class="rtk-el"></rtk-livestream-toggle>
<rtk-livestream-toggle size="lg" class="rtk-el"></rtk-livestream-toggle>
<rtk-livestream-toggle
  variant="horizontal"
  class="rtk-el"
></rtk-livestream-toggle>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
