```html
<rtk-mute-all-button size="sm" class="rtk-el"></rtk-mute-all-button>
<rtk-mute-all-button size="lg" class="rtk-el"></rtk-mute-all-button>
<rtk-mute-all-button
  variant="horizontal"
  class="rtk-el"
></rtk-mute-all-button>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>
```
