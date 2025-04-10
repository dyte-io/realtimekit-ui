import { Component, Host, h, Event, EventEmitter, Prop } from '@stencil/core';
import { IconPack, defaultIconPack } from '../../lib/icons';
import { useLanguage, RtkI18n } from '../../lib/lang';
import { SyncWithStore } from '../../utils/sync-with-store';
import { States } from '../../types/props';

/**
 * A component used as a stage that commonly houses
 * the `grid` and `sidebar` components.
 *
 *  @slot - Default slot
 */
@Component({
  tag: 'rtk-stage',
  styleUrl: 'rtk-stage.css',
  shadow: true,
})
export class RtkStage {
  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
