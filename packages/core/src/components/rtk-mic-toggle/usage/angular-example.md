Template

```html
<dyte-mic-toggle #one></dyte-mic-toggle>
<dyte-mic-toggle #two></dyte-mic-toggle>
<dyte-mic-toggle #three></dyte-mic-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteMicToggle;

  @ViewChild('two') componentTwo: DyteMicToggle;

  @ViewChild('three') componentTree: DyteMicToggle;

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
