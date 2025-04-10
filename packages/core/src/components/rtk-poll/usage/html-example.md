```html
<dyte-poll id="dyte-el"></dyte-poll>

<script>
  const el = document.getElementById('dyte-el');

  el.addEventListener('dyteVotePoll', (e) => {
    console.log('Voted', e.detail);
  });

  el.poll = {
    id: 'poll-id',
    question: 'Have you started using dyte yet?',
    options: [
      {
        text: 'Yes',
        votes: [{ id: 'vaibhavs-user-id', name: 'Vaibhav' }],
        count: 0,
      },
      {
        text: 'Nope',
        votes: [],
        count: 0,
      },
    ],
    anonymous: false,
    hideVotes: false,
    createdBy: 'Vaibhav',
    createdByUserId: 'vaibhavs-user-id',
    voted: [],
  };
</script>
```
