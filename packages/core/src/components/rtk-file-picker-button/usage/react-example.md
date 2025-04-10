```jsx live
<DyteFilePickerButton
  label="Upload File"
  onFileChange={(event) => console.log(event.detail)}
/>
<DyteFilePickerButton
  filter="image/*"
  label="Upload Image"
  icon="image"
  onFileChange={(event) => console.log(event.detail)}
/>
```
