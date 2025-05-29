Template

```html
<rtk-mic-toggle #one></rtk-mic-toggle>
<rtk-mic-toggle #two></rtk-mic-toggle>
<rtk-mic-toggle #three></rtk-mic-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkMicToggle;

  @ViewChild('two') componentTwo: RtkMicToggle;

  @ViewChild('three') componentTree: RtkMicToggle;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    // Change the size to small
    this.componentOne.meeting = this.rtkMeeting;
    this.componentOne.size = 'sm';

    // Change the size to large
    this.componentTwo.meeting = this.rtkMeeting;
    this.componentTwo.size = 'lg';

    // Render as a horizontal button
    this.componentThree.meeting = this.rtkMeeting;
    this.componentThree.variant = 'horizontal';
  }
}
```
