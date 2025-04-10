import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { SyncWithStore } from '../../utils/sync-with-store';
import { RtkI18n, IconPack, defaultIconPack, useLanguage } from '../../exports';

/**
 * A component which renders the draft attachment to send
 */
@Component({
  tag: 'rtk-draft-attachment-view',
  styleUrl: 'rtk-draft-attachment-view.css',
  shadow: true,
})
export class RtkDraftAttachmentView {
  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Attachment to display */
  @Prop() attachment: {
    type: 'image' | 'file';
    file: File;
  } = null;

  @State() filePreview: string = null;

  /** Event triggered when the attachment is deleted */
  @Event({ eventName: 'deleteAttachment' }) onDeleteAttachment: EventEmitter;

  private fileReader: FileReader = new FileReader();

  @Watch('attachment')
  onAttachmentChange() {
    this.generatePreview();
  }

  connectedCallback() {
    this.fileReader.onload = (e) => {
      if (typeof e.target.result === 'string') {
        this.filePreview = e.target.result;
      }
    };
    // this.fileReader.onloadstart = () => {};
    // this.fileReader.onloadend = () => {};
  }

  componentWillLoad() {
    this.onAttachmentChange();
  }

  private generatePreview = () => {
    if (this.attachment.type === 'image') {
      this.fileReader.readAsDataURL(this.attachment.file);
    } else if (this.attachment.type === 'file') {
      this.filePreview = this.attachment.file.name;
    }
  };

  private onDeleteClickHandler = () => {
    this.filePreview = null;
    this.onDeleteAttachment.emit();
  };

  render() {
    return (
      <Host>
        <div class="preview-overlay">
          <div class="preview">
            <rtk-tooltip label={this.t('chat.cancel_upload')}>
              <rtk-button variant="secondary" kind="icon" onClick={this.onDeleteClickHandler}>
                <rtk-icon icon={this.iconPack.dismiss} />
              </rtk-button>
            </rtk-tooltip>
            {this.attachment.type === 'image' ? (
              <img class="preview-image" src={this.filePreview} />
            ) : (
              <div class="preview-file">
                <span>{this.filePreview}</span>
              </div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
