```html
<rtk-button onclick="showDialog()">Show dialog</rtk-button>
<rtk-dialog id="rtk-el" open="false">
  <div>
    <h3>Hello!</h3>
    <p>This is some text inside dialog!</p>
  </div>
</rtk-dialog>

<script>
  const dialog = document.getElementById('rtk-el');

  dialog.addEventListener('rtkDialogClose', (open) => {
    console.log('dialog closed');
  });

  function showDialog() {
    dialog.open = true;
  }
</script>
<style>
  rtk-dialog > div {
    width: 512px;
    backgroundcolor: #000;
    color: #fff;
    padding: 12px;
    borderradius: 8px;
  }
  p {
    margin-bottom: 0;
  }
</style>
```
