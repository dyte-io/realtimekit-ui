Template

```html
<dyte-avatar #one></dyte-avatar>
<dyte-avatar #two></dyte-avatar>
<dyte-avatar #three></dyte-avatar>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteAvatar;

  @ViewChild('two') componentTwo: DyteAvatar;

  @ViewChild('three') componentTree: DyteAvatar;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.participant = this.dyteMeeting.self;
    this.componentOne.size = 'sm';

    this.componentTwo.participant = this.dyteMeeting.self;
    this.componentTwo.size = 'md';

    this.componentThree.participant = this.dyteMeeting.self;
    this.componentThree.size = 'lg';
    this.componentThree.variant = 'hexagon';
  }
}
```
