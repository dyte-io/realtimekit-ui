```html
<rtk-menu placement="top">
  <rtk-button slot="trigger">Top Menu</rtk-button>
  <rtk-menu-list>
    <rtk-menu-item (click)="showAlert()">alert()</rtk-button>
  </rtk-menu-list>
</rtk-menu>
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
