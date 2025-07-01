import { Component, Host, h, Prop } from '@stencil/core';
import { UIConfig } from '../../types/ui-config';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { IconPack, defaultIconPack } from '../../lib/icons';
import { createDefaultConfig } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Meeting } from '../../types/rtk-client';

@Component({
  tag: 'rtk-waiting-screen',
  styleUrl: 'rtk-waiting-screen.css',
  shadow: true,
})
export class RtkWaitingScreen {
  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

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
          <div class="centered" part="content">
            <rtk-logo meeting={this.meeting} config={this.config} part="logo" t={this.t} />
            <p>{this.t('waitlist.body_text')}</p>
          </div>
        </slot>
      </Host>
    );
  }
}
