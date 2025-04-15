```html
<rtk-screenshare-view class="rtk-el" style="height: 480px">
  <rtk-name-tag class="rtk-el">
    <rtk-audio-visualizer class="rtk-el" slot="start"></rtk-audio-visualizer>
  </rtk-name-tag>
</rtk-screenshare-view>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.participant = meeting.self;
  }
</script>
```
