```html
<dyte-poll-form id="dyte-el"></dyte-poll-form>

<script>
  document.getElementById('dyte-el').addEventListener('dyteCreatePoll', (e) => {
    console.log('create poll', e.detail);
  });
</script>
```
