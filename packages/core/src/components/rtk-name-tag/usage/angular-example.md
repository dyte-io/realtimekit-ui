```html
<rtk-name-tag #one></rtk-name-tag> <rtk-name-tag #two></rtk-name-tag>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkNameTag;

  @ViewChild('two') componentTwo: RtkNameTag;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.participant = this.rtkMeeting.self;

    /* pass `meeting` to it to differentiate `you`. */
    this.componentTwo.participant = this.rtkMeeting.self;
    this.componentTwo.meeting = this.rtkMeeting;
  }
}
```
