```html
<dyte-name-tag #one></dyte-name-tag> <dyte-name-tag #two></dyte-name-tag>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteNameTag;

  @ViewChild('two') componentTwo: DyteNameTag;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.participant = this.dyteMeeting.self;

    /* pass `meeting` to it to differentiate `you`. */
    this.componentTwo.participant = this.dyteMeeting.self;
    this.componentTwo.meeting = this.dyteMeeting;
  }
}
```
