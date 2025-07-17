import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { Size, States } from '../../types/props';
import { Meeting } from '../../types/rtk-client';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { RTKParticipants } from '@cloudflare/realtimekit';
import { SyncWithStore } from '../../utils/sync-with-store';
import debounce from 'lodash/debounce';

export type GridPaginationVariants = 'solid' | 'rounded' | 'grid';

const MASS_ACTIONS_DEBOUNCE_TIMER = 50; // In ms

/**
 * A component which allows you to change current page and view mode
 * of active participants list. This is reflected in the `rtk-grid` component.
 */
@Component({
  tag: 'rtk-grid-pagination',
  styleUrl: 'rtk-grid-pagination.css',
  shadow: true,
})
export class RtkGridPagination {
  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Size Prop */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Variant */
  @Prop({ reflect: true }) variant: GridPaginationVariants = 'rounded';

  /** Icon Pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() page: number = 1;
  @State() pageCount: number = 0;
  @State() activeCount: number = 0;
  @State() activeComputedCount: number = 0;
  @State() showPagination: boolean = false;

  connectedCallback() {
    this.meetingChanged(this.meeting);
    this.sizeChanged();
  }

  disconnectedCallback() {
    if (!this.meeting) return;

    const { participants, stage } = this.meeting;

    participants.removeListener('pageChanged', this.onPageChanged);
    participants.removeListener('viewModeChanged', this.onPageChanged);
    participants.joined.removeListener('participantJoined', this.onParticipantJoin);
    participants.joined.removeListener('participantLeft', this.onParticipantLeave);
    participants.joined.removeListener('stageStatusUpdate', this.onStateStatusUpdate);
    stage.removeListener('stageStatusUpdate', this.onStateStatusUpdate);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (meeting != null) {
      const { stage, participants } = meeting;

      this.page = participants.currentPage;
      this.pageCount = participants.pageCount;

      participants.addListener('viewModeChanged', this.onPageChanged);
      participants.addListener('pageChanged', this.onPageChanged);
      participants.joined.addListener('participantJoined', this.onParticipantJoin);
      participants.joined.addListener('participantLeft', this.onParticipantLeave);
      participants.joined.addListener('stageStatusUpdate', this.onStateStatusUpdate);
      stage.addListener('stageStatusUpdate', this.onStateStatusUpdate);
      this.activeCount = this.meeting.participants.joined.size;
      this.activeComputedCount = this.meeting.participants.joined.size;
      this.toggleGridPagination();
    }
  }

  @Watch('size')
  sizeChanged() {
    this.toggleGridPagination();
  }

  private onPageChanged = ({
    currentPage,
    pageCount,
  }: Pick<RTKParticipants, 'viewMode' | 'currentPage' | 'pageCount'>) => {
    this.pageCount = pageCount;
    this.page = currentPage;
  };

  private toggleGridPagination = debounce(() => {
    const { self, participants } = this.meeting;
    const { mobile, desktop } = self.config?.maxVideoStreams;
    const maxCount = this.size === 'sm' ? mobile : desktop;
    const stagePeopleCount = participants.joined
      .toArray()
      .filter((p) => p.stageStatus === 'ON_STAGE').length;
    if (stagePeopleCount < maxCount) {
      this.showPagination = false;
    } else {
      this.showPagination = true;
    }
  }, MASS_ACTIONS_DEBOUNCE_TIMER);

  private onParticipantJoin = debounce(() => {
    this.pageCount = this.meeting.participants.pageCount;
    this.toggleGridPagination();
  }, MASS_ACTIONS_DEBOUNCE_TIMER);

  private onParticipantLeave = debounce(() => {
    this.pageCount = this.meeting.participants.pageCount;
    this.toggleGridPagination();
  }, MASS_ACTIONS_DEBOUNCE_TIMER);

  private onStateStatusUpdate = debounce(() => {
    this.pageCount = this.meeting.participants.pageCount;
    this.toggleGridPagination();
  }, MASS_ACTIONS_DEBOUNCE_TIMER);

  private prevPage = () => {
    if (!this.meeting) return;

    const { participants } = this.meeting;

    if (this.page > 1) {
      participants.setPage((this.page -= 1));
    } else if (participants.viewMode === 'PAGINATED') {
      participants.setViewMode('ACTIVE_GRID');
    }
  };

  private nextPage = () => {
    if (!this.meeting) return;

    const { participants } = this.meeting;

    if (this.page > 0 && this.page < this.pageCount) {
      participants.setPage((this.page += 1));
    } else if (participants.count > 0 && this.pageCount === 0) {
      participants.setViewMode('PAGINATED');
    }
  };

  render() {
    if (!this.meeting) return null;
    const { meta } = this.meeting;
    const isAudioRoom = meta?.viewType === 'AUDIO_ROOM';

    if (isAudioRoom || !this.showPagination) {
      return <Host data-hidden />;
    }

    return (
      <Host>
        <rtk-button
          class="prev"
          variant="secondary"
          kind="icon"
          disabled={this.pageCount === 0}
          onClick={this.prevPage}
          aria-label={this.t('page.prev')}
        >
          <rtk-icon icon={this.iconPack.chevron_left} />
        </rtk-button>
        {this.variant !== 'grid' && (
          <div class="center">
            <span class="page">
              {this.pageCount === 0 ? (
                <rtk-tooltip label={this.t('layout.auto')}>
                  <rtk-button kind="icon" class="auto">
                    <rtk-icon icon={this.iconPack.wand} />
                  </rtk-button>
                </rtk-tooltip>
              ) : (
                this.page
              )}
            </span>
            {this.pageCount !== 0 && [
              <span class="slash">/</span>,
              <span class="pages">{this.pageCount}</span>,
            ]}
          </div>
        )}
        {this.variant === 'grid' && this.pageCount > 0 && (
          <div class="dots">
            {[...Array(this.pageCount)].map((_, index) => (
              <div key={`dot-${index}`} class={{ dot: true, active: index + 1 === this.page }} />
            ))}
          </div>
        )}
        <rtk-button
          class="next"
          variant="secondary"
          kind="icon"
          disabled={this.page !== 0 && this.page === this.pageCount}
          onClick={this.nextPage}
          aria-label={this.t('page.next')}
        >
          <rtk-icon icon={this.iconPack.chevron_right} tabIndex={-1} aria-hidden={true} />
        </rtk-button>
      </Host>
    );
  }
}
