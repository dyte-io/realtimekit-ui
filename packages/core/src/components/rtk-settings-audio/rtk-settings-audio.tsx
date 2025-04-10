import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Size, States } from '../../types/props';
import { getPreference, setPreference } from '../../utils/user-prefs';
import { SyncWithStore } from '../../utils/sync-with-store';

/**
 * A component which lets to manage your audio devices and audio preferences.
 *
 * Emits `rtkStateUpdate` event with data for muting notification sounds:
 * ```ts
 * {
 *  prefs: {
 *    muteNotificationSounds: boolean
 *  }
 * }
 * ```
 */
@Component({
  tag: 'rtk-settings-audio',
  styleUrl: 'rtk-settings-audio.css',
  shadow: true,
})
export class RtkSettingsAudio {
  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Event updated state */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  render() {
    if (this.meeting == null) return null;

    const defaults = {
      meeting: this.meeting,
      states: this.states,
      size: this.size,
      iconPack: this.iconPack,
      t: this.t,
    };

    const states = this.states;
    const initialNotificationSoundsPreference =
      states?.prefs?.muteNotificationSounds === true ||
      getPreference('mute-notification-sounds') === 'true';

    return (
      <Host>
        <rtk-microphone-selector {...defaults}>
          <rtk-audio-visualizer
            participant={this.meeting?.self}
            iconPack={this.iconPack}
            t={this.t}
            slot="indicator"
          />
        </rtk-microphone-selector>

        <rtk-speaker-selector {...defaults} />
        <div class="group" part="notification-toggle">
          <div class="row">
            <label htmlFor="notification-toggle">{this.t('settings.notification_sound')}</label>
            <rtk-switch
              id="notification-toggle"
              checked={!initialNotificationSoundsPreference}
              onRtkChange={(e: CustomEvent<boolean>) => {
                const { checked } = e.target as HTMLRtkSwitchElement;
                const muteNotificationSounds = !checked;
                this.stateUpdate.emit({ prefs: { muteNotificationSounds } });
                setPreference('mute-notification-sounds', muteNotificationSounds);
              }}
              iconPack={this.iconPack}
              t={this.t}
            />
          </div>
        </div>
      </Host>
    );
  }
}
