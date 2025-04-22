import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { showLivestream } from '../../utils/livestream';

export type ViewerCountVariant = 'primary' | 'embedded';

/**
 * A component which shows count of total joined participants in a meeting.
 */
@Component({
  tag: 'rtk-viewer-count',
  styleUrl: 'rtk-viewer-count.css',
  shadow: true,
})
export class RtkViewerCount {
  private countListener: () => void;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Viewer count variant */
  @Prop({ reflect: true }) variant: ViewerCountVariant = 'primary';

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() viewerCount: number = 0;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  private disconnectMeeting = (meeting: Meeting) => {
    if (meeting != null && this.countListener != null) {
      meeting.livestream?.removeListener('viewerCountUpdate', this.countListener);
    }
  };

  disconnectedCallback() {
    this.disconnectMeeting(this.meeting);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting, oldMeeting?: Meeting) {
    this.disconnectMeeting(oldMeeting);
    if (meeting != null) {
      this.countListener = () => {
        this.viewerCount = meeting.livestream?.viewerCount;
      };
      this.countListener();
      meeting.livestream?.addListener('viewerCountUpdate', this.countListener);
    }
  }

  render() {
    if (!showLivestream(this.meeting)) return <Host data-hidden />;
    return (
      <Host tabIndex={0} role="log" aria-label={`${this.viewerCount} ${this.t('viewers')}`}>
        <rtk-icon icon={this.iconPack.viewers} tabIndex={-1} aria-hidden={true} part="icon" />
        {this.viewerCount} {this.t('viewers')}
      </Host>
    );
  }
}
