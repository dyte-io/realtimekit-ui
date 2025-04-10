Template

```html
<dyte-camera-toggle #one></dyte-camera-toggle>
<dyte-camera-toggle #two></dyte-camera-toggle>
<dyte-camera-toggle #three></dyte-camera-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteCameraToggle;

  @ViewChild('two') componentTwo: DyteCameraToggle;

  @ViewChild('three') componentTree: DyteCameraToggle;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    // Change the size to small
    this.componentOne.meeting = this.dyteMeeting;
    this.componentOne.size = 'sm';

    // Change the size to large
    this.componentTwo.meeting = this.dyteMeeting;
    this.componentTwo.size = 'lg';

    // Render as a horizontal button
    this.componentThree.meeting = this.dyteMeeting;
    this.componentThree.variant = 'horizontal';
  }
}
```
