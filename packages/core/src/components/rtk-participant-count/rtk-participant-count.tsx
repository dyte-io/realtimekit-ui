import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/rtk-client';
import { isLiveStreamViewer } from '../../utils/livestream';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Size } from '../../types/props';

/**
 * A component which shows count of total joined participants in a meeting.
 */
@Component({
  tag: 'rtk-participant-count',
  styleUrl: 'rtk-participant-count.css',
  shadow: true,
})
export class RtkParticipantCount {
  private countListener: () => void;

  private stageUpdateListener: () => void;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  @State() participantCount: number = 0;

  @State() isViewer: boolean = false;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  private disconnectMeeting = (meeting: Meeting) => {
    if (meeting != null && this.countListener != null) {
      meeting.participants.joined.removeListener('participantJoined', this.countListener);
      meeting.participants.joined.removeListener('participantLeft', this.countListener);
      meeting?.stage &&
        this.stageUpdateListener &&
        meeting.stage.removeListener('stageStatusUpdate', this.stageUpdateListener);
      meeting.self.removeListener('roomJoined', this.countListener);
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
        this.participantCount =
          meeting.participants.joined.size + (meeting.self.roomJoined ? 1 : 0);
      };
      this.countListener();
      this.isViewer = isLiveStreamViewer(this.meeting);
      meeting.participants.joined.addListener('participantJoined', this.countListener);
      meeting.participants.joined.addListener('participantLeft', this.countListener);

      if (meeting?.stage) {
        this.stageUpdateListener = () => {
          this.isViewer = isLiveStreamViewer(this.meeting);
        };
        meeting?.stage.addListener('stageStatusUpdate', this.stageUpdateListener);
      }

      meeting.self.addListener('roomJoined', this.countListener);
    }
  }

  render() {
    if (this.isViewer) return <Host data-hidden />;
    return (
      <Host
        tabIndex={0}
        role="log"
        aria-label={`${this.participantCount} ${this.t('participants')}`}
      >
        <rtk-icon icon={this.iconPack.people} tabIndex={-1} aria-hidden={true} part="icon" />
        {this.participantCount}
      </Host>
    );
  }
}
