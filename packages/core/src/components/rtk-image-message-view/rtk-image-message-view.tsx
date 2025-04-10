import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { RtkI18n, IconPack, defaultIconPack, useLanguage } from '../../exports';
import { sanitizeLink } from '../../utils/string';
import { SyncWithStore } from '../../utils/sync-with-store';
import { downloadFile } from '../../utils/file';

/**
 * A component which renders an image message.
 */
@Component({
  tag: 'rtk-image-message-view',
  styleUrl: 'rtk-image-message-view.css',
  shadow: true,
})
export class RtkImageMessageView {
  /** Url of the image */
  @Prop() url!: string;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** preview event */
  @Event({ eventName: 'preview' }) onPreview: EventEmitter<string>;

  @State() status: 'loading' | 'loaded' | 'errored' = 'loading';

  render() {
    return (
      <div class={{ image: true, loaded: this.status === 'loaded' }}>
        <img
          src={sanitizeLink(this.url)}
          onLoad={() => {
            this.status = 'loaded';
          }}
          onError={() => {
            this.status = 'errored';
          }}
          onClick={() => {
            if (this.status === 'loaded') {
              this.onPreview.emit(this.url);
            }
          }}
        />
        {this.status === 'loading' && (
          <div
            class="image-spinner"
            title={this.t('chat.img.loading')}
            aria-label={this.t('chat.img.loading')}
          >
            <rtk-spinner iconPack={this.iconPack} />
          </div>
        )}
        {this.status === 'errored' && (
          <div
            class="image-errored"
            title={this.t('chat.error.img_not_found')}
            aria-label={this.t('chat.error.img_not_found')}
          >
            <rtk-icon icon={this.iconPack.image_off} />
          </div>
        )}
        {this.status === 'loaded' && (
          <div class="actions">
            <rtk-button
              class="action"
              variant="secondary"
              kind="icon"
              onClick={() => {
                this.onPreview.emit(this.url);
              }}
            >
              <rtk-icon icon={this.iconPack.full_screen_maximize} />
            </rtk-button>
            <rtk-button
              class="action"
              variant="secondary"
              kind="icon"
              onClick={() => downloadFile(this.url, { fallbackName: 'image' })}
            >
              <rtk-icon icon={this.iconPack.download} />
            </rtk-button>
          </div>
        )}
      </div>
    );
  }
}
