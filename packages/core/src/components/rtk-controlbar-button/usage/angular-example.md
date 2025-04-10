Template

```html
<dyte-controlbar-button #one></dyte-controlbar-button>
<dyte-controlbar-button #two></dyte-controlbar-button>
<dyte-controlbar-button #three></dyte-controlbar-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: DyteControlbarButton;

  @ViewChild('two') componentTwo: DyteControlbarButton;

  @ViewChild('three') componentTree: DyteControlbarButton;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    this.componentOne.label = 'Flight Mode';
    this.componentOne.icon = '✈️';
    this.componentOne.size = 'sm';
    this.componentOne.onClick = () => {
      alert('Flight mode clicked');
    };

    this.componentTwo.label = 'Flight Mode';
    this.componentTwo.icon = '✈️';
    this.componentTwo.size = 'lg';
    this.componentTwo.onClick = () => {
      alert('Flight mode clicked');
    };

    this.componentTree.label = 'Flight Mode';
    this.componentTree.icon = '✈️';
    this.componentTree.variant = 'horizontal';
    this.componentTree.onClick = () => {
      alert('Flight mode clicked');
    };
  }
}
```
