Template

```html
<rtk-mute-all-button #one></rtk-mute-all-button>
<rtk-mute-all-button #two></rtk-mute-all-button>
<rtk-mute-all-button #three></rtk-mute-all-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkMuteAllButton;

  @ViewChild('two') componentTwo: RtkMuteAllButton;

  @ViewChild('three') componentTree: RtkMuteAllButton;

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
