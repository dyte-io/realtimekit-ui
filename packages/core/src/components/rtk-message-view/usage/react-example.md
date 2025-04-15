```jsx live
<RtkMessageView
  authorName="Peter"
  avatarUrl="https://peter.jpg"
  time={new Date()}
  actions={[{ id: 'delete', label: 'Delete' }]}
  onAction={(actionId) => void}
>Hello NY!</RtkMessageView>
```
