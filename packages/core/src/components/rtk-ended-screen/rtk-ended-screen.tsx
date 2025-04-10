import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { RtkI18n, defaultLanguage, useLanguage } from '../../lib/lang';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { defaultConfig } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Meeting } from '../../types/rtk-client';

/**
 * A screen which shows a meeting has ended.
 */
@Component({
  tag: 'rtk-ended-screen',
  styleUrl: 'rtk-ended-screen.css',
  shadow: true,
})
export class RtkEndedScreen {
  /** Config object */
  @Prop() config: UIConfig = defaultConfig;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Icon */
  @State() icon: IconPack = defaultIconPack;

  /** Global states */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  @State() message: string = '';

  /** Global states */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  connectedCallback() {
    this.statesChanged(this.states);
  }

  private getBreakoutRoomsMessage(states: States) {
    let message: keyof typeof defaultLanguage;
    if (states?.roomLeftState === 'connected-meeting') {
      if (
        this.states.activeBreakoutRoomsManager?.destinationMeetingId ===
        this.meeting.connectedMeetings.parentMeeting.id
      ) {
        message = 'breakout_rooms.move_reason.switch_main_room';
      } else {
        message = 'breakout_rooms.move_reason.switch_room';
      }
    }

    return message;
  }

  @Watch('states')
  statesChanged(states: States) {
    if (states != null) {
      switch (states?.roomLeftState) {
        case 'left':
          this.message = 'ended.left';
          break;
        case 'kicked':
          this.message = 'ended.kicked';
          break;
        case 'disconnected':
          this.message = 'ended.disconnected';
          break;
        case 'rejected':
          this.message = 'ended.rejected';
          break;
        case 'connected-meeting':
          this.message = this.getBreakoutRoomsMessage(states);
          break;
        case 'unauthorized':
          this.message = 'ended.unauthorized';
          break;
        default:
          this.message = 'ended';
      }
    }
  }

  private renderBreakoutRoomScreen() {
    return (
      <Host>
        <div class="ctr" part="container">
          <rtk-icon icon={this.iconPack.breakout_rooms} />
          <p part="message" class="breakout">
            {this.t(this.message)}
          </p>
        </div>
      </Host>
    );
  }

  render() {
    const states = this.states;
    if (states.roomLeftState === 'connected-meeting') {
      return this.renderBreakoutRoomScreen();
    }

    return (
      <Host>
        <div class="ctr" part="container">
          <rtk-logo meeting={this.meeting} config={this.config} part="logo" t={this.t} />
          <p part="message">{this.t(this.message)}</p>
          {states?.roomLeftState === 'disconnected' && (
            <span part="description">{this.t('ended.network')}</span>
          )}
        </div>
      </Host>
    );
  }
}
