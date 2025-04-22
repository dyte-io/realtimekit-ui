import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { defaultConfig } from '../../lib/default-ui-config';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { SyncWithStore } from '../../utils/sync-with-store';
import { UIConfig } from '../../types/ui-config';

/**
 * A dialog component.
 */
@Component({
  tag: 'rtk-dialog',
  styleUrl: 'rtk-dialog.css',
  shadow: true,
})
export class RtkDialog {
  /** Whether to show the close button */
  @Prop() hideCloseButton: boolean = false;

  /** Whether Escape key can close the modal */
  @Prop() disableEscapeKey = false;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** UI Config */
  @Prop() config: UIConfig = defaultConfig;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

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

  /** Whether a dialog is open or not */
  @Prop({ reflect: true, mutable: true }) open: boolean = true;

  /** Event emitted when dialog is closed */
  @Event({ eventName: 'rtkDialogClose' }) onClose: EventEmitter;

  connectedCallback() {
    document.addEventListener('keydown', this.keydownListener);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.keydownListener);
  }

  private close = () => {
    this.open = false;
    this.onClose.emit();
  };

  private keydownListener = (e: KeyboardEvent) => {
    if (!this.disableEscapeKey && e.key === 'Escape' && this.open) {
      this.close();
    }
  };

  private dialogEl: HTMLDialogElement;

  componentDidRender() {
    if (this.open && !this.dialogEl.open) {
      // we need to call showModal() to get the ::backdrop
      this.dialogEl.showModal();
    }
  }

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <Host>
        <dialog
          ref={(el) => (this.dialogEl = el)}
          id="dialog"
          part="container"
          onClose={this.close}
          onClick={(e) => {
            // clicked outside the children of dialog
            if (!this.disableEscapeKey && e.target === this.dialogEl) {
              this.close();
            }
          }}
          onKeyDown={(e) => {
            if (this.disableEscapeKey && e.key === 'Escape') {
              e.preventDefault();
            }
          }}
        >
          <slot />
          {!this.hideCloseButton && (
            <rtk-button
              part="close-button"
              id="dismiss-btn"
              kind="icon"
              variant="ghost"
              onClick={() => this.close()}
              type="button"
              aria-label={this.t('dialog.close')}
              role="button"
            >
              <rtk-icon icon={this.iconPack.dismiss} />
            </rtk-button>
          )}
        </dialog>
      </Host>
    );
  }
}
