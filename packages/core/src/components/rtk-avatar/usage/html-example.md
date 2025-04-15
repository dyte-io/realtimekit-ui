```html
<rtk-avatar class="rtk-el" size="sm"></rtk-avatar>
<rtk-avatar class="" size="md"></rtk-avatar>
<rtk-avatar class="rtk-el" size="lg"></rtk-avatar>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```
