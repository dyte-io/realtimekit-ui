import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';
import { States } from '../../types/props';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { SyncWithStore } from '../../utils/sync-with-store';

@Component({
  tag: 'rtk-mute-all-confirmation',
  styleUrl: 'rtk-mute-all-confirmation.css',
  shadow: true,
})
export class RtkMuteAllConfirmation {
  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() allowUnmute = true;

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  private onClose = () => {
    this.stateUpdate.emit({ activeMuteAllConfirmation: false });
  };

  private onMuteAll = () => {
    this.meeting?.participants.disableAllAudio(this.allowUnmute);
    this.onClose();
  };

  render() {
    return (
      <Host>
        <div class="leave-modal">
          <div class="header">
            <h2 class="title">{this.t('mute_all.header')}</h2>
          </div>
          <p class="message">{this.t('mute_all.description')}</p>
          <div class="content">
            <div class="leave-meeting">
              <rtk-button variant="secondary" title={this.t('close')} onClick={this.onClose}>
                {this.t('cancel')}
              </rtk-button>
              <rtk-button variant="danger" title={this.t('mute_all')} onClick={this.onMuteAll}>
                {this.t('mute_all')}
              </rtk-button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
