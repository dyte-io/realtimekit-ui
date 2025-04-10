```html
Desktop View:
<dyte-settings class="dyte-el"></dyte-settings>

Mobile View:
<dyte-settings size="sm" class="dyte-el"></dyte-settings>

<script>
  const elements = document.getElementsByClassName('dyte-el');
  for (const el of elements) {
    el.meeting = meeting;
  }
</script>

<style>
  dyte-settings {
    height: 480px;
    width: '100%';
    max-width: 720px;
  }
  dyte-settings[size='sm'] {
    max-width: 360px;
  }
</style>
```
