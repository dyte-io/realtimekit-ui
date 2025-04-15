Template

```html
<div>
  <rtk-button (click)="showDialog()">Show dialog</rtk-button>
  <rtk-dialog #dialog :open="false" (rtkDialogClose)="onDialogClose()">
    <div
      style="width: 512px; background-color: #000; color: #fff; padding: 12px; border-radius: 8px;"
    >
      <h3>Hello!</h3>
      <p style="margin-bottom: 0;">This is some text inside dialog!</p>
    </div>
  </rtk-dialog>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('dialog') componentDialog: RtkDialog;

  rtkMeeting: RealtimeKitClient; // meeting instance

  showDialog() {
    this.componentDialog.open = true;
  }

  onDialogClose() {
    console.log('dialog closed');
  }
}
```
