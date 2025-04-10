Template

```html
<dyte-button #one>Primary</dyte-button>
<dyte-button #two>Secondary</dyte-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteButton;

  @ViewChild('two') componentTwo: DyteButton;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentTwo.variant = 'secondary';
  }
}
```
