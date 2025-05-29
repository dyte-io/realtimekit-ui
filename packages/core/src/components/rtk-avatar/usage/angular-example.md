Template

```html
<rtk-avatar #one></rtk-avatar>
<rtk-avatar #two></rtk-avatar>
<rtk-avatar #three></rtk-avatar>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkAvatar;

  @ViewChild('two') componentTwo: RtkAvatar;

  @ViewChild('three') componentTree: RtkAvatar;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.participant = this.rtkMeeting.self;
    this.componentOne.size = 'sm';

    this.componentTwo.participant = this.rtkMeeting.self;
    this.componentTwo.size = 'md';

    this.componentThree.participant = this.rtkMeeting.self;
    this.componentThree.size = 'lg';
    this.componentThree.variant = 'hexagon';
  }
}
```
