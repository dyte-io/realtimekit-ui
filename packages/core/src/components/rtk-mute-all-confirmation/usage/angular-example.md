Template

```html
<div>
  <rtk-mute-all-confirmation #myId></rtk-mute-all-confirmation>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: RtkMuteAllConfirmation;

  rtkMeeting: RealtimeKitClient; // meeting instance

  showDialog() {
    this.component.meeting = this.rtkMeeting;
  }
}
```
