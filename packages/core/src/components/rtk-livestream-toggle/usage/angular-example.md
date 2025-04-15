Template

```html
<rtk-livestream-toggle #one></rtk-livestream-toggle>
<rtk-livestream-toggle #two></rtk-livestream-toggle>
<rtk-livestream-toggle #three></rtk-livestream-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkLivestreamToggle;

  @ViewChild('two') componentTwo: RtkLivestreamToggle;

  @ViewChild('three') componentTree: RtkLivestreamToggle;

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
