```html
<dyte-livestream-toggle size="sm" class="dyte-el"></dyte-livestream-toggle>
<dyte-livestream-toggle size="lg" class="dyte-el"></dyte-livestream-toggle>
<dyte-livestream-toggle
  variant="horizontal"
  class="dyte-el"
></dyte-livestream-toggle>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
