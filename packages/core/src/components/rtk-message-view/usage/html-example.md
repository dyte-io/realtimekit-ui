```html
<rtk-message-view id="message"> Hello NY! </rtk-message-view>
```

```js
const $message = document.getElementById("message");
$message.authorName = "Peter";
$message.avatarUrl = "https://peter.jpg";
$message.time= new Date();
$message.actions= [{ id: 'delete', label: 'Delete' }];
$message.onAction= (actionId) => void;
```
