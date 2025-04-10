```html
<dyte-menu placement="top">
  <dyte-button slot="trigger">Top Menu</dyte-button>
  <dyte-menu-list>
    <dyte-menu-item (click)="showAlert()">alert()</dyte-button>
  </dyte-menu-list>
</dyte-menu>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  showAlert() {
    alert('You have clicked alert()');
  }
}
```
