```html
<rtk-sidebar default-section="participants" id="rtk-el"></rtk-sidebar>

<script>
  const el = document.getElementById('rtk-el');
  el.meeting = meeting;
</script>

<style>
  rtk-sidebar {
    height: 360px;
  }
</style>
```

To see a mobile sidebar:

```html
<div id="app">
  <rtk-sidebar
    view="full-screen"
    default-section="participants"
    id="rtk-el"
  ></rtk-sidebar>
</div>

<script>
  const el = document.getElementById('rtk-el');
  el.meeting = meeting;
</script>

<style>
  #app {
    position: relative;
    height: 600px;
  }

  rtk-sidebar {
    height: 360px;
    max-width: 360px;
    margin: auto;
  }
</style>
```
