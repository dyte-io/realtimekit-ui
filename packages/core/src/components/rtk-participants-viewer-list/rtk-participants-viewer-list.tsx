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
import { Meeting, Participant, Peer } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { ParticipantsViewMode } from '../rtk-participants/rtk-participants';

@Component({
  tag: 'rtk-participants-viewer-list',
  styleUrl: 'rtk-participants-viewer-list.css',
  shadow: true,
})
export class RtkParticipantsViewers {
  private participantJoinedListener: (data: any) => void;
  private participantLeftListener: (data: any) => void;
  private updateStageViewers = () => {
    this.getViewers(this.search);
  };

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Hide Viewer Count Header */
  @Prop() hideHeader: boolean = false;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** View mode for participants list */
  @Prop() view: ParticipantsViewMode = 'sidebar';

  /** Search */
  @Prop() search: string = '';

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();
  @State() stageViewers: Peer[] = [];

  connectedCallback() {
    this.meetingChanged(this.meeting);
    this.searchChanged(this.search);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (meeting == null) return;

    this.participantJoinedListener = (participant: Participant) => {
      if (participant.stageStatus === 'ON_STAGE') return;
      // Do not append if participant name or id does not match search query
      const lowerCaseSearch = this.search.toLowerCase();
      if (lowerCaseSearch.length > 0 && !participant.name.toLowerCase().includes(lowerCaseSearch))
        return;
      this.stageViewers = [
        ...this.stageViewers.filter((p) => p.id !== participant.id),
        participant,
      ];
    };

    this.participantLeftListener = (participant: Participant) => {
      this.stageViewers = this.stageViewers.filter((p) => p.id !== participant.id);
    };

    meeting.participants.joined.addListener('participantJoined', this.participantJoinedListener);
    meeting.participants.joined.addListener('participantLeft', this.participantLeftListener);
    meeting.participants.joined.on('stageStatusUpdate', this.updateStageViewers);
    meeting.stage.on('stageStatusUpdate', this.updateStageViewers);
  }

  @Watch('search')
  searchChanged(search: string) {
    this.getViewers(search);
  }

  disconnectedCallback() {
    const { participants, stage } = this.meeting;
    this.participantJoinedListener &&
      this.meeting.participants.joined.removeListener(
        'participantJoined',
        this.participantJoinedListener
      );
    this.participantLeftListener &&
      this.meeting.participants.joined.removeListener(
        'participantLeft',
        this.participantLeftListener
      );
    participants.joined.removeListener('stageStatusUpdate', this.updateStageViewers);
    stage.removeListener('stageStatusUpdate', this.updateStageViewers);
  }

  private getViewers(search) {
    let list: Peer[] = this.meeting.stage.status === 'ON_STAGE' ? [] : [this.meeting.self];
    list = [...list, ...this.meeting.participants.joined.toArray()].filter(
      (p) => p.stageStatus !== 'ON_STAGE'
    );

    if (search === '') {
      this.stageViewers = list;
    } else {
      this.stageViewers = list.filter((p) =>
        (p.name ?? p.id).toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  private createParticipantNode = (participant: Peer) => {
    return (
      <rtk-participant
        role="listitem"
        key={participant.id}
        meeting={this.meeting}
        participant={participant}
        view={this.view}
        iconPack={this.iconPack}
        config={this.config}
        t={this.t}
      />
    );
  };

  // TODO: (ishita1805) Remove viewtype check when we start supporting viewers in livestream.
  private shouldShowViewers = () => {
    return this.meeting?.self?.permissions?.stageEnabled;
  };

  render() {
    if (this.view !== 'sidebar' || !this.shouldShowViewers()) return;

    return (
      <div class="list">
        {!this.hideHeader && (
          <div class="heading-count" part="heading-count">
            {this.t('viewers')} ({this.stageViewers.length})
          </div>
        )}
        <rtk-virtualized-participant-list
          items={this.stageViewers}
          renderItem={this.createParticipantNode}
          class="participants"
          part="participants"
          style={{ height: '100%' }}
          emptyListElement={
            <div class="empty-viewers-list">
              {this.search.length > 0
                ? this.t('participants.errors.empty_results')
                : this.t('participants.empty_list')}
            </div>
          }
        />
      </div>
    );
  }
}
