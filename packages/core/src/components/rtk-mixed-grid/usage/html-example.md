```html
<rtk-mixed-grid id="rtk-el"></rtk-mixed-grid>

<script>
  const el = document.getElementBydId('rtk-el');
  el.participants = [meeting.self];
  el.pinnedParticipants = [meeting.self];
  el.screenShareParticipants = [meeting.self];
  el.plugins = [];
</script>

<style>
  rtk-mixed-grid {
    height: 360px;
    width: 100%;
  }
</style>
```
