```html
<dyte-avatar class="dyte-el" size="sm"></dyte-avatar>
<dyte-avatar class="" size="md"></dyte-avatar>
<dyte-avatar class="dyte-el" size="lg"></dyte-avatar>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```
