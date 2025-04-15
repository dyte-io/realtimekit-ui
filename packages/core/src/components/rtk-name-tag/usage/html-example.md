```html
<rtk-name-tag class="rtk-el"></rtk-meeting-title>
<rtk-name-tag class="rtk-el-self"></rtk-meeting-title>

<script>
  const participant = document.getElementById('rtk-el');
  const selfParticipant = document.getElementById('rtk-el-self');

  participant.participant = meeting.self;

  /* pass `meeting` to it to differentiate `you`. */
  selfParticipant.participant = meeting.self;
  selfParticipant.meeting = meeting;
</script>
```
