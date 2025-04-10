```jsx live
<DytePoll
  poll={{
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
  }}
  onDyteVotePoll={(e) => {
    console.log('Voted', e.detail);
  }}
/>
```
