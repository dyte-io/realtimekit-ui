```html
<dyte-file-picker-button
  label="Upload File"
  (fileChange)="onFileChange($event)"
></dyte-file-picker-button>
<dyte-file-picker-button
  filter="image/*"
  label="Upload Image"
  icon="image"
  (fileChange)="onImageChange($event)"
></dyte-file-picker-button>
```

Component

```js
class MyComponent {
  onFileChange(event) {
    console.log(event.detail);
  }
  onImageChange(event) {
    console.log(event.detail);
  }
}
```
