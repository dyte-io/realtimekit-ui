```html
<dyte-text-composer-view
  [value]="defaultText"
  [placeholder]="defaultText"
  (textChange)="onTextChange($event)"
></dyte-text-composer-view>
```

Component

```js
class MyComponent {
  defaultText = 'Hello, How are you?';
  placeholder = 'Write something...';

  onTextChange(event) {
    console.log(event.detail);
  }
}
```
