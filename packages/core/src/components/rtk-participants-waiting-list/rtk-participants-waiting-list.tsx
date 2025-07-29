import { Component, h, Prop, State, Watch } from '@stencil/core';
import {
  UIConfig,
  Size,
  IconPack,
  defaultIconPack,
  RtkI18n,
  createDefaultConfig,
} from '../../exports';
import { useLanguage } from '../../lib/lang';
import { Meeting, WaitlistedParticipant } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { ParticipantsViewMode } from '../rtk-participants/rtk-participants';

@Component({
  tag: 'rtk-participants-waiting-list',
  styleUrl: 'rtk-participants-waiting-list.css',
  shadow: true,
})
export class RtkParticipantsWaitlisted {
  private waitlistedParticipantJoinedListener: (participant: WaitlistedParticipant) => void;
  private waitlistedParticipantLeftListener: (participant: WaitlistedParticipant) => void;
  private waitlistedParticipantsClearedListener: () => void;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;
  /** Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

  /** Size */
  @Prop({ reflect: true }) size: Size;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** View mode for participants list */
  @Prop() view: ParticipantsViewMode = 'sidebar';

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();
  private acceptWaitingRoomRequest = async (id: WaitlistedParticipant['id']) => {
    await this.meeting.participants.acceptWaitingRoomRequest(id);
  };

  @State() waitlistedParticipants: WaitlistedParticipant[] = [];

  private acceptAllWaitingRoomRequests = async () => {
    await this.meeting.participants.acceptAllWaitingRoomRequest(
      this.waitlistedParticipants.map((p) => p.id)
    );
  };

  private rejectWaitingRoomRequest = async (id: WaitlistedParticipant['id']) => {
    await this.meeting.participants.rejectWaitingRoomRequest(id);
  };

  disconnectedCallback() {
    const { participants } = this.meeting;

    this.waitlistedParticipantJoinedListener &&
      participants.waitlisted.removeListener(
        'participantJoined',
        this.waitlistedParticipantJoinedListener
      );
    this.waitlistedParticipantLeftListener &&
      participants.waitlisted.removeListener(
        'participantLeft',
        this.waitlistedParticipantLeftListener
      );
    this.waitlistedParticipantsClearedListener &&
      participants.waitlisted.removeListener(
        'participantsCleared',
        this.waitlistedParticipantsClearedListener
      );
  }

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (!meeting) return;
    this.waitlistedParticipants = meeting.participants.waitlisted.toArray();

    this.waitlistedParticipantJoinedListener = (participant: WaitlistedParticipant) => {
      if (!this.waitlistedParticipants.some((p) => p.id === participant.id)) {
        this.waitlistedParticipants = [...this.waitlistedParticipants, participant];
      }
    };
    this.waitlistedParticipantLeftListener = (participant: WaitlistedParticipant) => {
      this.waitlistedParticipants = this.waitlistedParticipants.filter(
        (p) => p.id !== participant.id
      );
    };
    this.waitlistedParticipantsClearedListener = () => {
      this.waitlistedParticipants = [];
    };

    meeting.participants.waitlisted.addListener(
      'participantJoined',
      this.waitlistedParticipantJoinedListener
    );
    meeting.participants.waitlisted.addListener(
      'participantLeft',
      this.waitlistedParticipantLeftListener
    );
    meeting.participants.waitlisted.addListener(
      'participantsCleared',
      this.waitlistedParticipantsClearedListener
    );
  }

  private shouldShowWaitlist = () => {
    if (this.meeting.meta.viewType === 'LIVESTREAM') return false;
    return (
      this.meeting.self.permissions.acceptWaitingRequests &&
      this.waitlistedParticipants.length !== 0
    );
  };

  render() {
    if (this.view !== 'sidebar' || !this.shouldShowWaitlist()) return;
    return (
      <div class="waiting-participants">
        <div class="heading-count" part="waitlisted-heading-count">
          {this.t('waitlist.header_title')} ({this.waitlistedParticipants.length})
        </div>
        <ul class="participants" part="waitlisted-participants">
          {this.waitlistedParticipants.map((participant) => (
            <li class="waiting-participant" key={participant.id}>
              <div class="participant-details">
                <rtk-avatar
                  participant={participant}
                  size="sm"
                  iconPack={this.iconPack}
                  t={this.t}
                />
                <p class="name" title={participant.name}>
                  {participant.name}
                </p>
              </div>
              <div class="waitlist-controls">
                <rtk-tooltip label={this.t('waitlist.deny_request')} variant="secondary">
                  <rtk-button
                    variant="secondary"
                    kind="icon"
                    onClick={() => this.rejectWaitingRoomRequest(participant.id)}
                  >
                    <rtk-icon class="deny" icon={this.iconPack.dismiss} />
                  </rtk-button>
                </rtk-tooltip>
                <rtk-tooltip label={this.t('waitlist.accept_request')} variant="secondary">
                  <rtk-button
                    variant="secondary"
                    kind="icon"
                    onClick={() => this.acceptWaitingRoomRequest(participant.id)}
                  >
                    <rtk-icon class="accept" icon={this.iconPack.checkmark} />
                  </rtk-button>
                </rtk-tooltip>
              </div>
            </li>
          ))}
        </ul>
        <rtk-button
          class="accept-all-button"
          variant="secondary"
          kind="wide"
          onClick={this.acceptAllWaitingRoomRequests}
        >
          {this.t('waitlist.accept_all')}
        </rtk-button>
      </div>
    );
  }
}
