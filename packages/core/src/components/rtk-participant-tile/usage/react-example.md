```jsx live
<RTKParticipantTile participant={meeting.self}>
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="start" />
  </DyteNameTag>
</RTKParticipantTile>
```

You can change the `name-tag-position` to any of the supported values
and change the placement of audio-visualizer in name-tag as well.

```jsx live
<RTKParticipantTile participant={meeting.self} nameTagPosition="bottom-center">
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="end" />
  </DyteNameTag>
</RTKParticipantTile>
```

It also has a few variants.

```jsx live
<RTKParticipantTile
  participant={meeting.self}
  nameTagPosition="bottom-center"
  variant="gradient"
>
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="start" />
  </DyteNameTag>
</RTKParticipantTile>
```
