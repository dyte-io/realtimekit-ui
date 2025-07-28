import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Size, States } from '../../types/props';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';
import { SyncWithStore } from '../../utils/sync-with-store';

/**
 * A button which toggles visibility of settings module.
 *
 * When clicked it emits a `rtkStateUpdate` event with the data:
 *
 * ```ts
 * { activeSettings: boolean; }
 * ```
 */
@Component({
  tag: 'rtk-settings-toggle',
  styleUrl: 'rtk-settings-toggle.css',
  shadow: true,
})
export class RtkSettingsToggle {
  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Size */
  @Prop({ reflect: true }) size: Size;

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

  private toggleSettings() {
    const updatePartial = { activeSettings: true, activeMoreMenu: false };
    this.states = { ...this.states, ...updatePartial };
    this.stateUpdate.emit(updatePartial);
  }

  render() {
    const text = this.t('settings');

    return (
      <Host title={text}>
        <rtk-controlbar-button
          part="controlbar-button"
          size={this.size}
          iconPack={this.iconPack}
          onClick={() => this.toggleSettings()}
          icon={this.iconPack.settings}
          label={text}
          variant={this.variant}
        />
      </Host>
    );
  }
}
