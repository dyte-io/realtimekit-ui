```html
<dyte-screenshare-view class="dyte-el" style="height: 480px">
  <dyte-name-tag class="dyte-el">
    <dyte-audio-visualizer class="dyte-el" slot="start"></dyte-audio-visualizer>
  </dyte-name-tag>
</dyte-screenshare-view>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```
