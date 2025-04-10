import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { defaultIconPack, RtkI18n, IconPack } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import { useLanguage } from '../../lib/lang';

@Component({
  tag: 'rtk-file-dropzone',
  styleUrl: 'rtk-file-dropzone.css',
  shadow: true,
})
export class RtkFileDropzone {
  /** Host element on which drop events to attach */
  @Prop() hostEl: HTMLElement;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** drop event callback */
  @Event({ eventName: 'dropCallback' }) onDropCallback: EventEmitter<DragEvent>;

  @State() dropzoneActivated: boolean = false;

  connectedCallback() {
    if (!this.hostEl) throw new Error('hostEl prop is required');
    this.hostEl.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      this.dropzoneActivated = true;
    });

    this.hostEl.addEventListener('dragleave', () => {
      this.dropzoneActivated = false;
    });

    this.hostEl.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      this.dropzoneActivated = false;
      this.onDropCallback.emit(e);
    });
  }

  render() {
    return (
      <Host>
        <div id="dropzone" class={{ active: this.dropzoneActivated }} part="dropzone">
          <rtk-icon icon={this.iconPack.attach} />
          <p>{this.t('chat.send_attachment')}</p>
        </div>
      </Host>
    );
  }
}
