```html
<dyte-spotlight-grid class="dyte-el"></dyte-spotlight-grid>
<dyte-spotlight-grid layout="column" class="dyte-el"></dyte-spotlight-grid>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.participants = [meeting.self];
    el.pinnedParticipants = [meeting.self];
  }
</script>

<style>
  dyte-spotlight-grid {
    height: 360px;
    width: 100%;
  }
</style>
```
