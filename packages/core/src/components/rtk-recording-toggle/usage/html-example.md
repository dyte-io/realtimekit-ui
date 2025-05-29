Note that the toggle button won't be rendered if you do not have the
necessary permission.

```html
<rtk-recording-toggle size="sm" class="rtk-el"></rtk-recording-toggle>
<rtk-recording-toggle size="lg" class="rtk-el"></rtk-recording-toggle>
<rtk-recording-toggle
  variant="horizontal"
  class="rtk-el"
></rtk-recording-toggle>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
