```html
<rtk-button (click)="showSettings()">Show Settings</rtk-button>
<rtk-button (click)="showLeaveConfirmation()">Show Settings</rtk-button>

<rtk-dialog-manager
  #dialogManager
  (rtkStateUpdate)="stateUpdate"
></rtk-dialog-manager>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dialogManager') componentDialogManager: RtkDialogManager;

  rtkMeeting: RealtimeKitClient; // meeting instance

  states = { activeSettings: false, activeLeaveConfirmation: false };

  async ngAfterViewInit() {
    this.componentDialogManager.meeting = this.rtkMeeting;
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
