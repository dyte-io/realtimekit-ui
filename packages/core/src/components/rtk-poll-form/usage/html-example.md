```html
<rtk-poll-form id="rtk-el"></rtk-poll-form>

<script>
  document.getElementById('rtk-el').addEventListener('rtkCreatePoll', (e) => {
    console.log('create poll', e.detail);
  });
</script>
```
