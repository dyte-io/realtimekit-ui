import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { Meeting, Peer } from '../../types/rtk-client';
import {
  RtkI18n,
  IconPack,
  Size,
  States,
  UIConfig,
  defaultIconPack,
  useLanguage,
} from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Render } from '../../lib/render';

@Component({
  tag: 'rtk-audio-grid',
  styleUrl: 'rtk-audio-grid.css',
  shadow: true,
})
export class RtkAudioGrid {
  /** Meeting */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig;

  /** States */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Icon Pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Whether to hide self in the grid */
  @Prop() hideSelf = false;

  @State() activeParticipants: Peer[] = [];

  @State() onStageParticipants: Peer[] = [];

  @State() offStageParticipants: any[] = [];

  @Element() host: HTMLRtkAudioGridElement;

  private resizeObserver: ResizeObserver;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  @Watch('meeting')
  meetingChanged(meeting?: Meeting) {
    if (!meeting || meeting.self.config.viewType !== 'AUDIO_ROOM') {
      return;
    }

    this.onParticipantListUpdate();

    // listeners
    meeting.participants.active.addListener('participantJoined', this.onParticipantListUpdate);
    meeting.participants.active.addListener('participantLeft', this.onParticipantListUpdate);

    meeting.participants.joined.addListener('participantJoined', this.onParticipantListUpdate);
    meeting.participants.joined.addListener('participantLeft', this.onParticipantListUpdate);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    this.resizeObserver = undefined;

    this.meeting.participants.active.removeListener(
      'participantJoined',
      this.onParticipantListUpdate
    );
    this.meeting.participants.active.removeListener(
      'participantLeft',
      this.onParticipantListUpdate
    );

    this.meeting.participants.joined.removeListener(
      'participantJoined',
      this.onParticipantListUpdate
    );
    this.meeting.participants.joined.removeListener(
      'participantLeft',
      this.onParticipantListUpdate
    );
  }

  private onParticipantListUpdate = () => {
    if (!this.meeting) {
      return;
    }

    let activeParticipants: Peer[] = this.meeting.participants.active.toArray();

    if (!this.hideSelf) {
      activeParticipants = [...activeParticipants, this.meeting.self];
    }

    let onStageParticipants: Peer[] = this.meeting.participants.joined
      .toArray()
      .filter((p) => !activeParticipants.some((a) => a.id === p.id));

    this.activeParticipants = activeParticipants;
    this.onStageParticipants = onStageParticipants;
  };

  private renderGrid(participants: Peer[] = []) {
    const defaults = {
      meeting: this.meeting,
      size: this.size,
      config: this.config,
      t: this.t,
      iconPack: this.iconPack,
      states: this.states,
    };

    return participants.map((participant) => {
      return (
        <Render
          element="rtk-audio-tile"
          defaults={defaults}
          props={{
            key: participant.id,
            participant,
          }}
          childProps={{
            participant,
          }}
          deepProps
        />
      );
    });
  }

  render() {
    const onStage = this.activeParticipants.concat(this.onStageParticipants);

    return (
      <Host>
        <div class="content scrollbar">
          <div class="stage grid">{this.renderGrid(onStage)}</div>

          {this.offStageParticipants.length > 0 && (
            <div class="waitlist-area">
              <div class="listening-title">
                {this.offStageParticipants.length} {this.t('grid.listening')}
              </div>

              <div class="waitlist-grid grid">{this.renderGrid(this.offStageParticipants)}</div>
            </div>
          )}
        </div>

        <slot></slot>
      </Host>
    );
  }
}
