Template

```html
<rtk-controlbar-button #one></rtk-controlbar-button>
<rtk-controlbar-button #two></rtk-controlbar-button>
<rtk-controlbar-button #three></rtk-controlbar-button>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('one') componentOne: RtkControlbarButton;

  @ViewChild('two') componentTwo: RtkControlbarButton;

  @ViewChild('three') componentTree: RtkControlbarButton;

  rtkMeeting: RealtimeKitClient; // meeting instance

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
