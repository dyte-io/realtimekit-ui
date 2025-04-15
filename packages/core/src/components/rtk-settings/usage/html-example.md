```html
Desktop View:
<rtk-settings class="rtk-el"></rtk-settings>

Mobile View:
<rtk-settings size="sm" class="rtk-el"></rtk-settings>

<script>
  const elements = document.getElementsByClassName('rtk-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>

<style>
  rtk-settings {
    height: 480px;
    width: '100%';
    max-width: 720px;
  }
  rtk-settings[size='sm'] {
    max-width: 360px;
  }
</style>
```
