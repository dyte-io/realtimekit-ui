import { Component, Event, Prop, h, EventEmitter } from '@stencil/core';
import { SyncWithStore } from '../../utils/sync-with-store';
import { RtkI18n, IconPack, defaultIconPack, useLanguage } from '../../exports';

@Component({
  tag: 'rtk-file-picker-button',
  styleUrl: 'rtk-file-picker-button.css',
  shadow: true,
})
export class RtkFilePickerButton {
  /** File type filter to open file picker with */
  @Prop() filter: string;

  /** Label for tooltip */
  @Prop() label: string;

  /** Icon */
  @Prop() icon: keyof IconPack = 'attach';

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Event when a file is selected for upload */
  @Event({ eventName: 'fileChange' }) onFileChange: EventEmitter<File>;

  private fileInputField: HTMLInputElement;

  connectedCallback() {
    this.fileInputField = document.createElement('input');
  }

  disconnectedCallback() {
    // For GC
    this.fileInputField = undefined;
  }

  private uploadFile = () => {
    const input = this.fileInputField;
    input.type = 'file';

    if (this.filter) {
      input.accept = this.filter;
    }

    input.onchange = (e: InputEvent) => {
      const {
        validity,
        files: [file],
      } = e.target as HTMLInputElement;
      if (validity.valid) {
        this.onFileChange.emit(file);
      }
    };
    input.click();
  };

  render() {
    const label = this.label || this.t('chat.send_file');
    const icon = this.iconPack[this.icon];
    return (
      <rtk-tooltip label={label}>
        <rtk-button variant="ghost" kind="icon" onClick={() => this.uploadFile()} title={label}>
          <rtk-icon icon={icon} />
        </rtk-button>
      </rtk-tooltip>
    );
  }
}
