Template

```html
<dyte-mute-all-button #one></dyte-mute-all-button>
<dyte-mute-all-button #two></dyte-mute-all-button>
<dyte-mute-all-button #three></dyte-mute-all-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteMuteAllButton;

  @ViewChild('two') componentTwo: DyteMuteAllButton;

  @ViewChild('three') componentTree: DyteMuteAllButton;

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
