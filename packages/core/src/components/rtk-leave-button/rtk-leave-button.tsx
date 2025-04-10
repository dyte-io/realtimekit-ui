import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { States, Size } from '../../types/props';
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';
import { SyncWithStore } from '../../utils/sync-with-store';

/**
 * A button which toggles visilibility of the leave confirmation dialog.
 */
@Component({
  tag: 'rtk-leave-button',
  styleUrl: 'rtk-leave-button.css',
  shadow: true,
})
export class RtkLeaveButton {
  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

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

  private leave = () => {
    this.stateUpdate.emit({ activeLeaveConfirmation: true });
  };

  render() {
    const text = this.t('leave');

    return (
      <Host label={text}>
        <rtk-controlbar-button
          size={this.size}
          iconPack={this.iconPack}
          class="leave red-icon"
          onClick={this.leave}
          icon={this.iconPack.call_end}
          label={text}
          variant={this.variant}
          part="controlbar-button"
        />
      </Host>
    );
  }
}
