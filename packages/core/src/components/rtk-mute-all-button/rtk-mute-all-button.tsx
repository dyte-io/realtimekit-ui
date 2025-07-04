import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { defaultIconPack, IconPack, Size, States } from '../../exports';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';

@Component({
  tag: 'rtk-mute-all-button',
  styleUrl: 'rtk-mute-all-button.css',
  shadow: true,
})
export class RtkMuteAllButton {
  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

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

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  @State() canDisable = false;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    this.meeting?.self?.permissions?.removeListener(
      'permissionsUpdate',
      this.permissionsUpdateListener
    );
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (!meeting) return;
    this.canDisable = !!meeting?.self.permissions.canDisableParticipantAudio;
    meeting.self.permissions.addListener('permissionsUpdate', this.permissionsUpdateListener);
  }

  private permissionsUpdateListener = () => {
    this.canDisable = !!this.meeting?.self.permissions.canDisableParticipantAudio;
  };

  private onMuteAll = () => {
    this.stateUpdate.emit({ activeMuteAllConfirmation: true });
  };

  render() {
    if (!this.meeting) return null;
    if (!this.canDisable) {
      return null;
    }

    const label = this.t('mute_all');

    return (
      <Host title={label}>
        <rtk-tooltip kind="block" label={label} part="tooltip">
          <rtk-controlbar-button
            part="controlbar-button"
            icon={this.iconPack.speaker_off}
            label={label}
            size={this.size}
            iconPack={this.iconPack}
            variant={this.variant}
            onClick={this.onMuteAll}
          />
        </rtk-tooltip>
      </Host>
    );
  }
}
