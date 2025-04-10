Template

```html
<div>
  <dyte-mute-all-confirmation #myId></dyte-mute-all-confirmation>
</div>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myId') component: DyteMuteAllConfirmation;

  dyteMeeting: DyteClient; // meeting instance

  showDialog() {
    this.component.meeting = this.dyteMeeting;
  }
}
```
