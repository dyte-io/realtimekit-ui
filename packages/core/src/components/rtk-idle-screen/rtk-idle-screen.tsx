import { Component, Host, h, Prop } from '@stencil/core';
import { createDefaultConfig } from '../../exports';
import { IconPack, defaultIconPack } from '../../lib/icons';
import { useLanguage, RtkI18n } from '../../lib/lang';
import { UIConfig } from '../../types/ui-config';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Meeting } from '../../types/rtk-client';

/**
 * A screen that handles the idle state,
 * i.e; when you are waiting for data about the meeting, specifically the `meeting` object.
 */
@Component({
  tag: 'rtk-idle-screen',
  styleUrl: 'rtk-idle-screen.css',
  shadow: true,
})
export class RtkIdleScreen {
  /** Meeting */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Config object */
  @Prop() config: UIConfig = createDefaultConfig();

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
        <slot>
          <div class="ctr" part="container">
            <rtk-logo meeting={this.meeting} config={this.config} t={this.t} part="logo" />
            <rtk-spinner
              aria-label="Idle, waiting for meeting data"
              part="spinner"
              iconPack={this.iconPack}
            />
          </div>
        </slot>
      </Host>
    );
  }
}
