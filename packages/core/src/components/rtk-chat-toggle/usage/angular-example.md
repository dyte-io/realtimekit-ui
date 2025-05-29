Template

```html
<rtk-chat-toggle #one></rtk-chat-toggle>
<rtk-chat-toggle #two></rtk-chat-toggle>
<rtk-chat-toggle #three></rtk-chat-toggle>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkChatToggle;

  @ViewChild('two') componentTwo: RtkChatToggle;

  @ViewChild('three') componentTree: RtkChatToggle;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.meeting = this.rtkMeeting;
    this.componentOne.size = 'sm';

    this.componentTwo.meeting = this.rtkMeeting;
    this.componentTwo.size = 'lg';

    this.componentThree.meeting = this.rtkMeeting;
    this.componentThree.variant = 'horizontal';
  }
}
```
