```html
<rtk-button onclick="showSettings()">Show Settings</rtk-button>
<rtk-button onclick="showLeaveConfirmation()">Show Settings</rtk-button>

<rtk-dialog-manager id="rtk-el"></rtk-dialog-manager>

<script>
  const dialog = document.getElementById('rtk-el');
  dialog.meeting = meeting;
  let states = {};

  function updateStates() {
    dialog.states = states;
  }

  function stateUpdate(s) {
    states = { ...states, ...s };
    updateStates();
  }

  function showSettings() {
    stateUpdate({ activeSettings: true });
  }

  function showLeaveConfirmation() {
    stateUpdate({ activeLeaveConfirmation: true });
  }

  dialog.addEventListener('rtkStateUpdate', (e) => {
    stateUpdate(e.detail);
  });

  updateStates();
</script>
```
