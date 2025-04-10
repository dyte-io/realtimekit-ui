```html
<rtk-chat-composer-view
  (newMessage)="onNewMessage($event)"
></rtk-chat-composer-view>
```

Component

```js
class MyComponent {
  onNewMessage(event) {
    console.log(event.detail);
  }
}
```
