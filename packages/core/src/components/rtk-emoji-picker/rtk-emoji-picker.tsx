import { Component, Host, h, State, EventEmitter, Event, Prop } from '@stencil/core';
import { IconPack, defaultIconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { EmojiMetaData } from '../../types/props';
import { SyncWithStore } from '../../utils/sync-with-store';
import { fetchEmojis } from '../../utils/assets';

/**
 * A very simple emoji picker component.
 */
@Component({
  tag: 'rtk-emoji-picker',
  styleUrl: 'rtk-emoji-picker.css',
  shadow: true,
})
export class RtkEmojiPicker {
  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Controls whether or not to focus on mount */
  @Prop()
  focusWhenOpened = true;

  /** Close event */
  @Event() pickerClose: EventEmitter<void>;

  @State() emojiList;
  @State() filterVal: string = '';
  @State() filteredEmojis: EmojiMetaData[] = [];

  /**
   * Event which is emitted when an Emoji is clicked
   */
  @Event({ eventName: 'rtkEmojiClicked' }) emojiClicked: EventEmitter<string>;

  /** Input element ref */
  private inputElement!: HTMLInputElement;

  componentWillLoad() {
    // Don't use async here as it will block the render
    fetchEmojis().then((e) => {
      this.emojiList = e;
      this.handleInputChange(this.inputElement);
    });
  }

  componentDidLoad() {
    if (this.focusWhenOpened) {
      this.inputElement.focus();
    }
  }

  private handleInputChange(target) {
    this.filterVal = target.value;
    const regex = new RegExp(`([^,]*?${this.filterVal}[^,]*):(\\d+)`, 'g');
    this.filteredEmojis = Array.from(this.emojiList['search'].matchAll(regex)).map((m) => {
      return { name: m[1], emoji: this.emojiList['emojis'][m[2]] };
    });
  }

  private handleEmojiClick(emoji: string) {
    this.emojiClicked.emit(emoji);
  }

  private mapEmojiList() {
    if (this.emojiList?.length > 0) {
      return (
        <div id="loader">
          <rtk-spinner iconPack={this.iconPack} />
        </div>
      );
    }
    return (
      <div id="emoji-grid" class="scrollbar max-w-40">
        {this.filteredEmojis.map((e) => (
          <rtk-button
            key={`emoji-button-${e.name}`}
            class="emoji"
            variant="ghost"
            kind="icon"
            title={e.name}
            onClick={() => this.handleEmojiClick(e.emoji)}
          >
            {e.emoji}
          </rtk-button>
        ))}
      </div>
    );
  }
  render() {
    return (
      <Host>
        <div class={'close-parent'}>
          {/* Close button */}
          <rtk-button
            variant="ghost"
            kind="icon"
            class="close"
            onClick={() => this.pickerClose?.emit()}
            aria-label={this.t('close')}
          >
            <rtk-icon icon={this.iconPack.dismiss} />
          </rtk-button>
        </div>
        <div class={'emoji-parent'}>
          <input
            value={this.filterVal}
            onInput={(event) => this.handleInputChange(event.target)}
            placeholder={this.t('search')}
            ref={(el) => (this.inputElement = el)}
          ></input>
          {this.mapEmojiList()}
        </div>
      </Host>
    );
  }
}
