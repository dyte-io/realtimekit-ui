```html
<dyte-message-view id="message"> Hello NY! </dyte-message-view>
```

```js
const $message = document.getElementById("message");
$message.authorName = "Peter";
$message.avatarUrl = "https://peter.jpg";
$message.time= new Date();
$message.actions= [{ id: 'delete', label: 'Delete' }];
$message.onAction= (actionId) => void;
```
