```html
<dyte-sidebar default-section="participants" id="dyte-el"></dyte-sidebar>

<script>
  const el = document.getElementById('dyte-el');
  el.meeting = meeting;
</script>

<style>
  dyte-sidebar {
    height: 360px;
  }
</style>
```

To see a mobile sidebar:

```html
<div id="app">
  <dyte-sidebar
    view="full-screen"
    default-section="participants"
    id="dyte-el"
  ></dyte-sidebar>
</div>

<script>
  const el = document.getElementById('dyte-el');
  el.meeting = meeting;
</script>

<style>
  #app {
    position: relative;
    height: 600px;
  }

  dyte-sidebar {
    height: 360px;
    max-width: 360px;
    margin: auto;
  }
</style>
```
