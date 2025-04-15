```html
<rtk-participant-tile class="rtk-el">
  <rtk-name-tag class="rtk-el">
    <rtk-audio-visualizer class="rtk-el" slot="start"></rtk-audio-visualizer>
  </rtk-name-tag>
</rtk-participant-tile>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```

You can change the `name-tag-position` to any of the supported values
and change the placement of audio-visualizer in name-tag as well.

```html
<rtk-participant-tile class="rtk-el" name-tag-position="bottom-center">
  <rtk-name-tag class="rtk-el">
    <rtk-audio-visualizer class="rtk-el" slot="end"></rtk-audio-visualizer>
  </rtk-name-tag>
</rtk-participant-tile>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```

It also has a few variants.

```html
<rtk-participant-tile class="rtk-el" variant="gradient">
  <rtk-name-tag class="rtk-el">
    <rtk-audio-visualizer class="rtk-el" slot="start"></rtk-audio-visualizer>
  </rtk-name-tag>
</rtk-participant-tile>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```
