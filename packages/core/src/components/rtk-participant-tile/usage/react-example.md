```jsx live
<RTKParticipantTile participant={meeting.self}>
  <RtkNameTag participant={meeting.self}>
    <RtkAudioVisualizer slot="start" />
  </RtkNameTag>
</RTKParticipantTile>
```

You can change the `name-tag-position` to any of the supported values
and change the placement of audio-visualizer in name-tag as well.

```jsx live
<RTKParticipantTile participant={meeting.self} nameTagPosition="bottom-center">
  <RtkNameTag participant={meeting.self}>
    <RtkAudioVisualizer slot="end" />
  </RtkNameTag>
</RTKParticipantTile>
```

It also has a few variants.

```jsx live
<RTKParticipantTile
  participant={meeting.self}
  nameTagPosition="bottom-center"
  variant="gradient"
>
  <RtkNameTag participant={meeting.self}>
    <RtkAudioVisualizer slot="start" />
  </RtkNameTag>
</RTKParticipantTile>
```
