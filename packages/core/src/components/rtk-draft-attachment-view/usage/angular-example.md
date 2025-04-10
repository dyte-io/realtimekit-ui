```html
<dyte-draft-attachment-view
  [attachment]="attachmentToUpload"
  (deleteAttachment)="onAttachmentDismissed()"
></dyte-draft-attachment-view>
```

Component

```js
class MyComponent {
  attachmentToUpload = { type: 'image', file: new File() };
  onAttachmentDismissed() {
    this.attachmentToUpload = null;
  }
}
```
