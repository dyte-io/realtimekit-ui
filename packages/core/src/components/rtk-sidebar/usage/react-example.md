```jsx live
<Center>
  <RtkSidebar
    defaultSection="participants"
    meeting={meeting}
    style={{ height: '480px' }}
  />
</Center>
```

To see a mobile sidebar:

```jsx live
<div style={{ position: 'relative', height: '600px' }}>
  <RtkSidebar
    view="full-screen"
    defaultSection="participants"
    meeting={meeting}
    style={{ maxWidth: '360px', margin: 'auto' }}
  />
</div>
```
