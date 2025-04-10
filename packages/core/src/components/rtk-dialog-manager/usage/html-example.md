```html
<dyte-button onclick="showSettings()">Show Settings</dyte-button>
<dyte-button onclick="showLeaveConfirmation()">Show Settings</dyte-button>

<dyte-dialog-manager id="dyte-el"></dyte-dialog-manager>

<script>
  const dialog = document.getElementById('dyte-el');
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

  dialog.addEventListener('dyteStateUpdate', (e) => {
    stateUpdate(e.detail);
  });

  updateStates();
</script>
```
