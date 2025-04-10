```jsx live
<DyteParticipantTile participant={meeting.self}>
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="start" />
  </DyteNameTag>
</DyteParticipantTile>
```

You can change the `name-tag-position` to any of the supported values
and change the placement of audio-visualizer in name-tag as well.

```jsx live
<DyteParticipantTile participant={meeting.self} nameTagPosition="bottom-center">
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="end" />
  </DyteNameTag>
</DyteParticipantTile>
```

It also has a few variants.

```jsx live
<DyteParticipantTile
  participant={meeting.self}
  nameTagPosition="bottom-center"
  variant="gradient"
>
  <DyteNameTag participant={meeting.self}>
    <DyteAudioVisualizer slot="start" />
  </DyteNameTag>
</DyteParticipantTile>
```
