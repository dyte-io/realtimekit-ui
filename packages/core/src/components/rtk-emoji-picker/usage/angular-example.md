```html
<div
  #emojiSelected
  style="height: 200px; width: 200px; margin: 0 auto; margin-bottom: 20px;"
>
  Select an emoji
</div>
<dyte-emoji-picker
  #emojiPicker
  (dyteEmojiClicked)="selectEmoji"
></dyte-emoji-picker>
```

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('emojiPicker') componentEmojiPicker: DyteEmojiPicker;

  @ViewChild('emojiSelected') componentSelected: HTMLDivElement;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {}

  selectEmoji(s) {
    console.log(s);
    this.emojiPicker.innerHTML = s;
  }
}
```
