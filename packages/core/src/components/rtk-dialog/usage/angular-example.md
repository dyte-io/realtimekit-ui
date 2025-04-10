Template

```html
<div>
  <dyte-button (click)="showDialog()">Show dialog</dyte-button>
  <dyte-dialog #dialog :open="false" (dyteDialogClose)="onDialogClose()">
    <div
      style="width: 512px; background-color: #000; color: #fff; padding: 12px; border-radius: 8px;"
    >
      <h3>Hello!</h3>
      <p style="margin-bottom: 0;">This is some text inside dialog!</p>
    </div>
  </dyte-dialog>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dialog') componentDialog: DyteDialog;

  dyteMeeting: DyteClient; // meeting instance

  showDialog() {
    this.componentDialog.open = true;
  }

  onDialogClose() {
    console.log('dialog closed');
  }
}
```
