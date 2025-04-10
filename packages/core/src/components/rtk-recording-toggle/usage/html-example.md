Note that the toggle button won't be rendered if you do not have the
necessary permission.

```html
<dyte-recording-toggle size="sm" class="dyte-el"></dyte-recording-toggle>
<dyte-recording-toggle size="lg" class="dyte-el"></dyte-recording-toggle>
<dyte-recording-toggle
  variant="horizontal"
  class="dyte-el"
></dyte-recording-toggle>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
