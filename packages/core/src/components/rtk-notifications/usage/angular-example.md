This is an example which passes the default configuration for notifications.

```html
<rtk-notifications #notifications></rtk-notifications>
```

```js
class NotificationComponent {
  title = 'NotificationComponent';

  @ViewChild('notifications') notificationsComponent: RtkNotifications;
  async ngAfterViewInit() {
    if (!this.notificationsComponent) return;

    const config = {
      notifications: {
        participant_left: false,
      },
      notification_sounds: {
        participant_left: false,
      },
      notification_duration: {
        participant_left: 1000,
      },
      participant_joined_sound_notification_limit: 10,
      participant_chat_message_sound_notification_limit: 10,
    };

    this.notificationsComponent.meeting = meeting;
    this.notificationsComponent.config = { config };
  }
}
```

The configurations take a specific category of notifications.
Available categories are `participant_joined`, `participant_left`,
`participant_joined_waitlist`, `chat`, `polls`, `webinar`,
`tab_sync`, `recording_started`, `recording_stopped`.

## Notifications Popup

It is possible to customize which activity needs to show a notification alert.
Use the `notifications` configuration to update individual category of
notifications.

All categories are enabled by default.

To disable specific category of notifications set the value of the category to
`false` like below.

```js
const config = {
  notifications: {
    participant_joined: false,
    participant_left: false,
    participant_joined_waitlist: false,
    chat: false,
    polls: false,
    webinar: false,
    tab_sync: false,
    recording_started: false,
    recording_stopped: false,
  },
};
```

## Notification duration

Similar to notification popup, it is possible to customize the duration of the
notification popup displayed on screen. By using the `notification_duration`
configuration, it is possible to change the duration for individual category of
notifications.

Here are the default display durations (in milliseconds)

    participant_joined: 2000
    participant_left: 2000
    participant_joined_waitlist: 4000
    chat: 2000
    polls: 2000
    webinar: 2000
    tab_sync: 2000
    recording_started: 2000
    recording_stopped: 2000

To change the duration for a specific category of notifications set the value of
the category to the milliseconds.

```js
const config = {
  notification_duration: {
    participant_joined: 5000, // Show participant joined notification for 5 seconds
    participant_left: 1000, // Show participant left notification for 1 second only
    chat: 5000, // Show chat for 1 second only
    tab_sync: 1000, // Show tab sync changes for 1 second only
    recording_started: 60 * 1000, // Show recording started notification for 1 minute
    recording_stopped: 3 * 1000, // Show recording stopped notification for 3 seconds
  },
};
```

## Notification Sound

It is possible to turn off the notification sound for specific category of
notifications.

To disable sound for a specific category of notifications set the value of the
category to `false` like below.

```js
const config = {
  notification_sounds: {
    participant_left: false,
    chat: false,
    polls: false,
  },
};
```

## Controlling sound once participants count

It is possible to disable notification / sound automatically once the number of
participants cross a certain limit.

Turn off the notification sound for new chat messages after 10 participants

```js
const config = {
  participant_chat_message_sound_notification_limit: 10,
};
```

Turn off the notification sound for participant joined notifications after 10
participants

```js
const config = {
  participant_joined_sound_notification_limit: 10,
};
```

Currently the number of configurations are limited, we are adding it for more
categories soon.
