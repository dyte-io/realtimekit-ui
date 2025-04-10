import { Component, Prop, h } from '@stencil/core';
import { IconPack, defaultIconPack } from '../../exports';
import { sanitizeLink } from '../../utils/string';
import { SyncWithStore } from '../../utils/sync-with-store';
import { downloadFile, getExtension, getFileSize } from '../../utils/file';

/**
 * A component which renders a file message.
 */
@Component({
  tag: 'rtk-file-message-view',
  styleUrl: 'rtk-file-message-view.css',
  shadow: true,
})
export class RtkFileMessageView {
  /** Name of the file */
  @Prop() name!: string;

  /** Size of the file */
  @Prop() size!: number;

  /** Url of the file */
  @Prop() url!: string;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  render() {
    return (
      <div class="file">
        <rtk-button
          variant="secondary"
          kind="icon"
          onClick={() =>
            downloadFile(sanitizeLink(this.url), { name: this.name, fallbackName: 'file' })
          }
          part="button"
        >
          <rtk-icon icon={this.iconPack.download} />
        </rtk-button>
        <div class="file-data">
          <div class="name">{this.name}</div>
          <div class="file-data-split">
            <div class="ext">{getExtension(this.name)}</div>
            <span class="divider"></span>
            <div class="size">{getFileSize(this.size)}</div>
          </div>
        </div>
      </div>
    );
  }
}
