```html
<rtk-file-picker-button
  label="Upload File"
  (fileChange)="onFileChange($event)"
></rtk-file-picker-button>
<rtk-file-picker-button
  filter="image/*"
  label="Upload Image"
  icon="image"
  (fileChange)="onImageChange($event)"
></rtk-file-picker-button>
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
