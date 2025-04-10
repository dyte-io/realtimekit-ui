```html
<dyte-emoji-picker-button
  [isActive]="isActive"
  (click)="onClick()"
></dyte-emoji-picker-button>
```

Component

```js
class MyComponent {
  isActive = false;
  onClick() {
    this.isActive = !this.isActive;
  }
}
```
