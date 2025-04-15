```html
<rtk-emoji-picker-button
  [isActive]="isActive"
  (click)="onClick()"
></rtk-emoji-picker-button>
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
