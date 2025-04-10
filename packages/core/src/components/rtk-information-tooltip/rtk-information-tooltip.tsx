import { Component, h, Host, Prop } from '@stencil/core';
import { SyncWithStore } from '../../utils/sync-with-store';
import { IconPack, defaultIconPack } from '../../exports';

@Component({
  tag: 'rtk-information-tooltip',
  styleUrl: 'rtk-information-tooltip.css',
  shadow: true,
})
export class RtkInformationTooltip {
  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  render() {
    return (
      <Host>
        <div class="tooltip-container">
          <rtk-icon icon={this.iconPack.info} size="sm"></rtk-icon>
          <div class="tooltip">
            <slot name="tootlip-text" />
          </div>
        </div>
      </Host>
    );
  }
}
