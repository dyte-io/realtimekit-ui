```html
<dyte-message-view #message>Hello NY!</dyte-message-view>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('message') componentMessage: DyteMessageView;

  async ngAfterViewInit() {
    this.componentMessage.authorName = "Peter";
    this.componentMessage.avatarUrl = "https://peter.jpg";
    this.componentMessage.time= new Date();
    this.componentMessage.actions= [{ id: 'delete', label: 'Delete' }];
    this.componentMessage.onAction= (actionId) => void;
  }
}
```
