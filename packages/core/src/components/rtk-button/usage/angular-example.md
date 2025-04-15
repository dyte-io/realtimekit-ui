Template

```html
<rtk-button #one>Primary</rtk-button>
<rtk-button #two>Secondary</rtk-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkButton;

  @ViewChild('two') componentTwo: RtkButton;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    this.componentTwo.variant = 'secondary';
  }
}
```
