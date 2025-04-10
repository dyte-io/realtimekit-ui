```html
<dyte-button (click)="showSettings()">Show Settings</dyte-button>
<dyte-button (click)="showLeaveConfirmation()">Show Settings</dyte-button>

<dyte-dialog-manager
  #dialogManager
  (dyteStateUpdate)="stateUpdate"
></dyte-dialog-manager>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dialogManager') componentDialogManager: DyteDialogManager;

  dyteMeeting: DyteClient; // meeting instance

  states = { activeSettings: false, activeLeaveConfirmation: false };

  async ngAfterViewInit() {
    this.componentDialogManager.meeting = this.dyteMeeting;
    this.setComponentState();
  }

  setComponentState() {
    componentDialogManager.states = this.states;
  }

  stateUpdate(s) {
    this.states = { ...this.states, ...s };
    this.setComponentState();
  }

  showSettings() {
    this.stateUpdate({ activeSettings: true });
  }

  showLeaveConfirmation() {
    this.stateUpdate({ activeLeaveConfirmation: true });
  }
}
```
