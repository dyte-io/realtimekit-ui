import type { StageStatus } from '@dytesdk/web-core';
import { Component, Host, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { Size, IconPack, defaultIconPack, DyteI18n, States } from '../../exports';
import { useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/dyte-client';
import { canRequestToJoinStage, canJoinStage } from '../../utils/stage';
import { ControlBarVariant } from '../dyte-controlbar-button/dyte-controlbar-button';
import { SyncWithStore } from '../../utils/sync-with-store';
import { uiState } from '../../utils/sync-with-store/ui-store';

interface DataState {
  label: string;
  disabled: boolean;
  icon: string;
}

@Component({
  tag: 'dyte-stage-toggle',
  styleUrl: 'dyte-stage-toggle.css',
  shadow: true,
})
export class DyteStageToggle {
  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** States */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: DyteI18n = useLanguage();

  @State() stageStatus: StageStatus = 'OFF_STAGE';

  @State() state: DataState = {
    label: '',
    disabled: false,
    icon: '',
  };

  /** Emits updated state data */
  @Event({ eventName: 'dyteStateUpdate' }) stateUpdate: EventEmitter<States>;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  private stageStatusHandler(meeting: Meeting, status: StageStatus) {
    this.stageStatus = status;
    if (status === 'ACCEPTED_TO_JOIN_STAGE') {
      meeting.self.setupTracks({ audio: false, video: false });
      this.stateUpdate.emit({ activeJoinStage: true });
    }
    this.state = this.getState();
  }

  disconnectedCallback() {
    this.meeting?.stage?.removeListener('stageStatusUpdate', (status) =>
      this.stageStatusHandler(this.meeting, status)
    );
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (meeting == null) return;
    this.stageStatus = meeting.stage?.status;
    this.stageStatusHandler(meeting, meeting.stage?.status);
    this.meeting?.stage?.on('stageStatusUpdate', (status) =>
      this.stageStatusHandler(meeting, status)
    );
  }

  private stageCallback = async () => {
    const stageStatus = this.meeting.stage?.status;

    if (stageStatus === 'ON_STAGE') {
      await this?.meeting?.stage?.leave();
    }
    if (stageStatus === 'OFF_STAGE') {
      this?.meeting?.stage?.requestAccess();
      if (canJoinStage(this.meeting)) {
        uiState.states.activeJoinStage = true;
        this.stateUpdate.emit({ activeJoinStage: true });
      }
    }

    if (stageStatus === 'REQUESTED_TO_JOIN_STAGE') {
      this?.meeting?.stage?.cancelRequestAccess();
    }
  };

  private getState() {
    let label = '';
    let icon = '';
    let disabled = false;
    switch (this.stageStatus) {
      case 'ON_STAGE': {
        icon = this.iconPack.leave_stage;
        label = this.t('stage_request.leave_stage');
        disabled = false;
        break;
      }
      case 'ACCEPTED_TO_JOIN_STAGE': {
        icon = this.iconPack.join_stage;
        label = this.t('stage_request.request');
        disabled = true;
        break;
      }
      case 'REQUESTED_TO_JOIN_STAGE': {
        icon = this.iconPack.join_stage;
        label = this.t('stage_request.requested');
        disabled = false;
        break;
      }
      default: {
        icon = this.iconPack.join_stage;
        label = this.t('stage_request.request');
        disabled = false;
        break;
      }
    }

    return { label, disabled, icon };
  }

  render() {
    if (!canRequestToJoinStage(this.meeting)) return;
    return (
      <Host title={this.state.label}>
        <dyte-tooltip
          placement="top"
          kind="block"
          label={this.state.label}
          delay={600}
          part="tooltip"
        >
          <dyte-controlbar-button
            part="controlbar-button"
            size={this.size}
            iconPack={this.iconPack}
            variant={this.variant}
            label={this.state.label}
            icon={this.state.icon}
            onClick={this.stageCallback}
            disabled={this.state.disabled}
            showWarning={false}
          />
        </dyte-tooltip>
      </Host>
    );
  }
}
