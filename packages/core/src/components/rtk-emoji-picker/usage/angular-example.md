```html
<div
  #emojiSelected
  style="height: 200px; width: 200px; margin: 0 auto; margin-bottom: 20px;"
>
  Select an emoji
</div>
<rtk-emoji-picker
  #emojiPicker
  (rtkEmojiClicked)="selectEmoji"
></rtk-emoji-picker>
```

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('emojiPicker') componentEmojiPicker: RtkEmojiPicker;

  @ViewChild('emojiSelected') componentSelected: HTMLDivElement;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {}

  selectEmoji(s) {
    console.log(s);
    this.emojiPicker.innerHTML = s;
  }
}
```
