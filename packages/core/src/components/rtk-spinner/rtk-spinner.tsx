import { Component, Host, h, Prop } from '@stencil/core';
import { Size } from '../../exports';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { SyncWithStore } from '../../utils/sync-with-store';

/**
 * A component which shows an animating spinner.
 */
@Component({
  tag: 'rtk-spinner',
  styleUrl: 'rtk-spinner.css',
  shadow: true,
})
export class RtkSpinner {
  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Size */
  @Prop({ reflect: true }) size: Size = 'md';

  render() {
    return (
      <Host>
        <rtk-icon class="spinner" icon={this.iconPack.spinner} />
      </Host>
    );
  }
}
