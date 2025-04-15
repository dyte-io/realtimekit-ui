Template

```html
<rtk-audio-visualizer #myid></rtk-audio-visualizer>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myid') component: RtkAudioVisualizer;

  rtkMeeting: RealtimeKitClient; // meeting instance

  async ngAfterViewInit() {
    const participant = this.rtkMeeting.self; // local user's audio
    // OR get a participant from `meeting.participants.joined`
    // const participant = this.rtkMeeting.participants.joined.get('{participant-id}');

    if (this.component) {
      this.component.participant = participant;
    }
  }
}
```
