```html
<dyte-mixed-grid id="dyte-el"></dyte-mixed-grid>

<script>
  const el = document.getElementBydId('dyte-el');
  el.participants = [meeting.self];
  el.pinnedParticipants = [meeting.self];
  el.screenShareParticipants = [meeting.self];
  el.plugins = [];
</script>

<style>
  dyte-mixed-grid {
    height: 360px;
    width: 100%;
  }
</style>
```
