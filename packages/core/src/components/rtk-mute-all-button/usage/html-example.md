```html
<dyte-mute-all-button size="sm" class="dyte-el"></dyte-mute-all-button>
<dyte-mute-all-button size="lg" class="dyte-el"></dyte-mute-all-button>
<dyte-mute-all-button
  variant="horizontal"
  class="dyte-el"
></dyte-mute-all-button>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
