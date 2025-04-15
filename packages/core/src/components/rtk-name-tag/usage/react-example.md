```jsx live
<Row>
  <RtkNameTag participant={meeting.self} />
  {/* pass `meeting` to it to differentiate `you`. */}
  <RtkNameTag participant={meeting.self} meeting={meeting} />
</Row>
```
