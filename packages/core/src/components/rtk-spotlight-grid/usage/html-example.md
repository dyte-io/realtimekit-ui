```html
<rtk-spotlight-grid class="rtk-el"></rtk-spotlight-grid>
<rtk-spotlight-grid layout="column" class="rtk-el"></rtk-spotlight-grid>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participants = [meeting.self];
    el.pinnedParticipants = [meeting.self];
  }
</script>

<style>
  rtk-spotlight-grid {
    height: 360px;
    width: 100%;
  }
</style>
```
