import { Component, Prop, h } from '@stencil/core';
import { SyncWithStore } from '../../utils/sync-with-store';
import { IconPack, defaultIconPack, RtkI18n, useLanguage } from '../../exports';

@Component({
  tag: 'rtk-emoji-picker-button',
  styleUrl: 'rtk-emoji-picker-button.css',
  shadow: true,
})
export class RtkEmojiPickerButton {
  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Active state indicator */
  @Prop() isActive: boolean;

  render() {
    return (
      <rtk-tooltip label={this.t('chat.send_emoji')}>
        <rtk-button
          variant="ghost"
          kind="icon"
          class={{ active: this.isActive }}
          title={this.t('chat.send_emoji')}
        >
          <rtk-icon icon={this.iconPack.emoji_multiple} />
        </rtk-button>
      </rtk-tooltip>
    );
  }
}
