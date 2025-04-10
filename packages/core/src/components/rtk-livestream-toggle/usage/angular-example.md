Template

```html
<dyte-livestream-toggle #one></dyte-livestream-toggle>
<dyte-livestream-toggle #two></dyte-livestream-toggle>
<dyte-livestream-toggle #three></dyte-livestream-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteLivestreamToggle;

  @ViewChild('two') componentTwo: DyteLivestreamToggle;

  @ViewChild('three') componentTree: DyteLivestreamToggle;

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
