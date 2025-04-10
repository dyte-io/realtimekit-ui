```jsx live
<Row>
  <DyteNameTag participant={meeting.self} />
  {/* pass `meeting` to it to differentiate `you`. */}
  <DyteNameTag participant={meeting.self} meeting={meeting} />
</Row>
```
