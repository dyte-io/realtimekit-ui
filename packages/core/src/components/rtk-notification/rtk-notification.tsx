import { Component, Host, h, Prop, EventEmitter, Event, Watch, State } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Notification, Size } from '../../types/props';
import { SyncWithStore } from '../../utils/sync-with-store';
import { TextMessageView } from '../rtk-text-message/components/TextMessage';

/**
 * A component which shows a notification.
 *
 * You need to remove the element after you receive the
 * `rtkNotificationDismiss` event.
 */
@Component({
  tag: 'rtk-notification',
  styleUrl: 'rtk-notification.css',
  shadow: true,
})
export class RtkNotification {
  /** Message */
  @Prop() notification!: Notification;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Dismiss event */
  @Event({ eventName: 'rtkNotificationDismiss' }) dismiss: EventEmitter<string>;

  @State() imageState: 'loading' | 'loaded' | 'errored' = 'loading';

  connectedCallback() {
    this.notificationChanged(this.notification);
  }

  @Watch('notification')
  notificationChanged(notification: Notification) {
    if (notification != null && typeof notification.duration === 'number') {
      setTimeout(() => {
        this.dismiss.emit(notification.id);
      }, notification.duration);
    }
  }

  render() {
    return (
      <Host>
        <div class="ctr">
          {this.notification.icon != null && (
            <rtk-icon
              class="icon"
              icon={this.notification.icon}
              variant={this.notification.iconVariant ?? 'primary'}
            />
          )}
          {this.notification.image != null &&
            this.notification.icon == null &&
            this.imageState !== 'errored' && (
              <img
                src={this.notification.image}
                class={{ loaded: this.imageState === 'loaded' }}
                onLoad={() => (this.imageState = 'loaded')}
                onError={() => (this.imageState = 'errored')}
              />
            )}
          <p class="message">
            <TextMessageView message={this.notification.message} />
          </p>
          <div class="right">
            {this.notification.button != null && (
              <rtk-button
                size="sm"
                variant={this.notification.button.variant}
                onClick={() => this.notification.button.onClick()}
              >
                {this.notification.button.text}
              </rtk-button>
            )}
            <rtk-icon
              aria-label={this.t('dismiss')}
              class="dismiss"
              icon={this.iconPack.dismiss}
              onClick={() => this.dismiss.emit(this.notification.id)}
            />
          </div>
        </div>
      </Host>
    );
  }
}
