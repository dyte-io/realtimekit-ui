Template

```html
<dyte-audio-visualizer #myid></dyte-audio-visualizer>
```

Component

```js
class MyComponent {
  title = 'MyComponent';

  @ViewChild('myid') component: DyteAudioVisualizer;

  dyteMeeting: DyteClient; // meeting instance

  async ngAfterViewInit() {
    const participant = this.dyteMeeting.self; // local user's audio
    // OR get a participant from `meeting.participants.joined`
    // const participant = this.dyteMeeting.participants.joined.get('{participant-id}');

    if (this.component) {
      this.component.participant = participant;
    }
  }
}
```
