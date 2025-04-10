import { Component, Host, h, Prop } from '@stencil/core';
import { Size } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';

const parseIcon = (icon: string) => {
  try {
    return JSON.parse(icon);
  } catch (e) {
    return icon;
  }
};

export type IconVariant = 'primary' | 'secondary' | 'danger';

/**
 * An icon component which accepts an svg string and renders it.
 */
@Component({
  tag: 'rtk-icon',
  styleUrl: 'rtk-icon.css',
  shadow: true,
})
export class RtkIcon {
  /** Icon */
  @Prop() icon: string;

  /** Icon variant */
  @Prop({ reflect: true }) variant: IconVariant = 'primary';

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size = 'lg';

  render() {
    return (
      <Host>
        <div class="icon-wrapper" innerHTML={parseIcon(this.icon)} part="wrapper"></div>
      </Host>
    );
  }
}
