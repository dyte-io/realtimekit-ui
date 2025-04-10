```jsx live
<Center>
  <DyteSidebar
    defaultSection="participants"
    meeting={meeting}
    style={{ height: '480px' }}
  />
</Center>
```

To see a mobile sidebar:

```jsx live
<div style={{ position: 'relative', height: '600px' }}>
  <DyteSidebar
    view="full-screen"
    defaultSection="participants"
    meeting={meeting}
    style={{ maxWidth: '360px', margin: 'auto' }}
  />
</div>
```
