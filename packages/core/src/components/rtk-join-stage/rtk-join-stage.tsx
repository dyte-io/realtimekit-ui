import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { createDefaultConfig } from '../../lib/default-ui-config';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Render } from '../../lib/render';
import { Meeting } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { SyncWithStore } from '../../utils/sync-with-store';

export interface ModalDataConfig {
  title: string;
  label: {
    accept: string;
    reject: string;
  };
  description: string;
}

@Component({
  tag: 'rtk-join-stage',
  styleUrl: 'rtk-join-stage.css',
  shadow: true,
})
export class RtkJoinStage {
  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** UI Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

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

  /** Content Config */
  @Prop() dataConfig: ModalDataConfig = {
    title: this.t('stage.join_title'),
    label: {
      accept: this.t('stage.join_confirm'),
      reject: this.t('stage.join_cancel'),
    },
    description: this.t('stage.join_summary'),
  };

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  /** Event which is emitted when user confirms joining stage */
  @Event({ eventName: 'rtkJoinStage' }) joinStage: EventEmitter<void>;

  /** Event which is emitted when user cancel joining stage */
  @Event({ eventName: 'rtkLeaveStage' }) leaveStage: EventEmitter<void>;

  @State() isLoading: boolean = false;

  render() {
    const defaults = {
      meeting: this.meeting,
      size: this.size,
      states: this.states,
      config: this.config,
      iconPack: this.iconPack,
      t: this.t,
    };

    return (
      <Host class={{ stage: true }}>
        <header>
          <h2>{this.dataConfig.title}</h2>
        </header>
        <Render
          element="rtk-participant-setup"
          defaults={defaults}
          props={{ participant: this.meeting?.self, size: 'md' }}
          childProps={{ participant: this.meeting?.self, size: 'md' }}
          deepProps
        />
        <div class="summary">{this.dataConfig.description}</div>
        <div class="container">
          <rtk-button
            variant="secondary"
            onClick={() => this.leaveStage.emit()}
            title={this.dataConfig.label.reject}
          >
            {this.dataConfig.label.reject}
          </rtk-button>
          <rtk-button
            onClick={() => {
              if (this.isLoading) return;
              this.isLoading = true;
              this.joinStage.emit();
            }}
            title={this.dataConfig.label.accept}
          >
            {this.isLoading ? (
              <rtk-icon icon={this.iconPack.spinner} />
            ) : (
              this.dataConfig.label.accept
            )}
          </rtk-button>
        </div>
      </Host>
    );
  }
}
