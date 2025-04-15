```jsx live
<RtkFilePickerButton
  label="Upload File"
  onFileChange={(event) => console.log(event.detail)}
/>
<RtkFilePickerButton
  filter="image/*"
  label="Upload Image"
  icon="image"
  onFileChange={(event) => console.log(event.detail)}
/>
```
