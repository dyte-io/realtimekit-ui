import type { RecordingState } from '@cloudflare/realtimekit';
import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting } from '../../types/rtk-client';
import { Size } from '../../types/props';
import { SyncWithStore } from '../../utils/sync-with-store';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';

/**
 * A button which toggles recording state of a meeting.
 *
 * Only a privileged user can perform this action,
 * thus the button will not be visible for participants
 * who don't have the permission to record a meeting.
 */
@Component({
  tag: 'rtk-recording-toggle',
  styleUrl: 'rtk-recording-toggle.css',
  shadow: true,
})
export class RtkRecordingToggle {
  private recordingStateUpdateListener: (recordingState: RecordingState) => void;

  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Disable the button */
  @Prop() disabled: boolean = false;

  @State() recordingState: RecordingState;

  @State() canRecord: boolean = false;

  /**
   * Emit api error events
   */
  @Event({ eventName: 'rtkApiError', bubbles: true, composed: true }) apiError: EventEmitter<{
    trace: string;
    message: string;
  }>;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    this.recordingStateUpdateListener &&
      this.meeting?.recording.removeListener('recordingUpdate', this.recordingStateUpdateListener);

    this.meeting?.self.permissions.removeListener(
      'permissionsUpdate',
      this.permissionsUpdateListener
    );
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (meeting != null) {
      this.recordingState = meeting.recording.recordingState;
      this.permissionsUpdateListener();

      this.recordingStateUpdateListener = (recordingState) => {
        this.recordingState = recordingState;
      };
      meeting.recording.addListener('recordingUpdate', this.recordingStateUpdateListener);
      meeting.self.permissions.addListener('permissionsUpdate', this.permissionsUpdateListener);
    }
  }

  private permissionsUpdateListener = () => {
    this.canRecord = this.meeting.self.permissions.canRecord === true;
  };

  private toggleRecording = async () => {
    if (this.isLoading() || this.disabled) return;

    switch (this.recordingState) {
      case 'IDLE':
        try {
          await this.meeting?.recording.start();
          return;
        } catch {
          this.apiError.emit({
            trace: this.t('recording.start'),
            message: this.t('recording.error.start'),
          });
        }
        return;
      case 'RECORDING':
        try {
          await this.meeting?.recording.stop();
          return;
        } catch {
          this.apiError.emit({
            trace: this.t('recording.stop'),
            message: this.t('recording.error.stop'),
          });
        }
        return;
      case 'PAUSED':
        try {
          await this.meeting?.recording.resume();
          return;
        } catch {
          this.apiError.emit({
            trace: this.t('recording.resume'),
            message: this.t('recording.error.resume'),
          });
        }
        return;
      case 'STARTING':
      case 'STOPPING':
      default:
        return;
    }
  };

  private getLabel() {
    switch (this.recordingState) {
      case 'IDLE':
        return 'recording.idle';
      case 'RECORDING':
        return 'recording.stop';
      case 'STARTING':
        return 'recording.starting';
      case 'STOPPING':
        return 'recording.stopping';
      case 'PAUSED':
        return 'recording.resume';
      default:
        return 'recording.loading';
    }
  }

  private getIcon() {
    switch (this.recordingState) {
      case 'IDLE':
        return this.iconPack.recording;
      case 'RECORDING':
        return this.iconPack.stop_recording;
      case 'STARTING':
      case 'STOPPING':
      default:
        return this.iconPack.recording;
    }
  }

  private isLoading = () => {
    return (
      !this.meeting ||
      this.recordingState === 'STARTING' ||
      this.recordingState === 'STOPPING'
    );
  };

  render() {
    if (!this.meeting) return null;
    if (!this.canRecord) return;
    return (
      <Host
        title={this.t(this.recordingState === 'RECORDING' ? 'recording.stop' : 'recording.idle')}
      >
        <rtk-controlbar-button
          part="controlbar-button"
          size={this.size}
          iconPack={this.iconPack}
          onClick={this.toggleRecording}
          icon={this.getIcon()}
          isLoading={this.isLoading()}
          label={this.t(this.getLabel())}
          variant={this.variant}
          disabled={this.disabled}
        />
      </Host>
    );
  }
}
