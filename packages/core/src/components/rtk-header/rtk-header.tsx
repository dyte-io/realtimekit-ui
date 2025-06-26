import { Component, Host, h, Prop } from '@stencil/core';
import { createDefaultConfig, defaultIconPack, IconPack, UIConfig } from '../../exports';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Render } from '../../lib/render';
import { Meeting } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Size, States } from '../../types/props';

/**
 * A component that houses all the header components.
 *
 * @slot - Default slot
 */
@Component({
  tag: 'rtk-header',
  styleUrl: 'rtk-header.css',
  shadow: true,
})
export class RtkHeader {
  /** Variant */
  @Prop({ reflect: true }) variant: 'solid' | 'boxed' = 'solid';

  /** Whether to render the default UI */
  @Prop() disableRender = false;

  /** Meeting */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Config */
  @Prop() config: UIConfig = createDefaultConfig();

  /** States */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Icon Pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  render() {
    const defaults = {
      meeting: this.meeting,
      config: this.config,
      states: this.states,
      t: this.t,
      iconPack: this.iconPack,
      size: this.size,
    };

    return (
      <Host>
        {!this.disableRender && <Render element="rtk-header" defaults={defaults} onlyChildren />}
        <slot />
      </Host>
    );
  }
}
