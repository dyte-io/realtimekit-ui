```html
<dyte-name-tag class="dyte-el"></dyte-meeting-title>
<dyte-name-tag class="dyte-el-self"></dyte-meeting-title>

<script>
  const participant = document.getElementById('dyte-el');
  const selfParticipant = document.getElementById('dyte-el-self');

  participant.participant = meeting.self;

  /* pass `meeting` to it to differentiate `you`. */
  selfParticipant.participant = meeting.self;
  selfParticipant.meeting = meeting;
</script>
```
