import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Meeting, Peer, MediaPermission } from '../../types/rtk-client';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { PermissionSettings, Size, States } from '../../types/props';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';
import { SyncWithStore } from '../../utils/sync-with-store';
import { StageStatus } from '@cloudflare/realtimekit';

/**
 * A button which toggles your microphone.
 */
@Component({
  tag: 'rtk-mic-toggle',
  styleUrl: 'rtk-mic-toggle.css',
  shadow: true,
})
export class RtkMicToggle {
  private audioUpdateListener = ({ audioEnabled }: Peer) => {
    this.audioEnabled = audioEnabled;
  };

  private stageStatusListener = () => {
    this.stageStatus = this.meeting.stage.status;
    this.canProduceAudio = this.meeting.self.permissions.canProduceAudio === 'ALLOWED';
  };

  private mediaPermissionUpdateListener = ({ kind, message }) => {
    if (kind === 'audio') {
      this.micPermission = message;
    }
  };

  private meetingPermissionsUpdateListener = (patch?: {
    media?: { audio?: { canProduce?: number } };
  }) => {
    if (patch?.media?.audio) {
      this.canProduceAudio = this.meeting.self.permissions.canProduceAudio === 'ALLOWED';
    }
  };

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

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() audioEnabled: boolean = false;

  @State() canProduceAudio: boolean = false;

  @State() micPermission: MediaPermission = 'NOT_REQUESTED';

  @State() stageStatus: StageStatus = 'OFF_STAGE';

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    this.meeting?.self.removeListener('audioUpdate', this.audioUpdateListener);
    this.meeting?.self.removeListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
    this.meeting?.stage?.removeListener('stageStatusUpdate', this.stageStatusListener);
    this.meeting?.self?.permissions?.removeListener(
      'permissionsUpdate',
      this.meetingPermissionsUpdateListener
    );
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (meeting != null) {
      const { self, stage } = meeting;

      this.canProduceAudio = this.meeting.self.permissions.canProduceAudio === 'ALLOWED';
      this.micPermission = meeting.self.mediaPermissions.audio || 'NOT_REQUESTED';
      this.audioEnabled = self.audioEnabled;

      this.stageStatus = meeting.stage.status;
      self.addListener('audioUpdate', this.audioUpdateListener);
      self.addListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
      stage?.addListener('stageStatusUpdate', this.stageStatusListener);
      meeting.self?.permissions?.addListener(
        'permissionsUpdate',
        this.meetingPermissionsUpdateListener
      );
    }
  }

  private hasPermissionError() {
    return this.micPermission === 'DENIED' || this.micPermission === 'SYSTEM_DENIED';
  }

  private toggleMic = () => {
    this.meeting?.__internals__.logger.info('dyteMicToggle::toggleMic', {
      media: {
        audio: {
          enabled: Boolean(this.meeting?.self?.audioEnabled),
          permission: this.micPermission,
          canProduce: this.meeting?.self?.permissions?.canProduceAudio,
        },
      },
      webinar: {
        stageStatus: this.meeting?.stage?.status as any,
      },
      livestream: {
        stageStatus: this.meeting?.stage?.status,
      },
      moduleExists: {
        self: Boolean(this.meeting?.self),
      },
    });

    if (this.hasPermissionError()) {
      const permissionModalSettings: PermissionSettings = {
        enabled: true,
        kind: 'audio',
      };
      this.stateUpdate.emit({ activePermissionsMessage: permissionModalSettings });
      return false;
    }

    const self = this.meeting?.self;
    if (self == null || !this.canProduceAudio) {
      return;
    }
    if (self.audioEnabled) {
      self.disableAudio();
    } else {
      self.enableAudio();
    }
  };

  private getState() {
    let tooltipLabel = '';
    let label = '';
    let icon = '';
    let classList = {};
    let hasError = this.hasPermissionError();
    let couldNotStart = this.micPermission === 'COULD_NOT_START';

    if (this.audioEnabled && !hasError) {
      label = this.t('mic_on');
      icon = this.iconPack.mic_on;
    } else {
      label = this.t('mic_off');
      icon = this.iconPack.mic_off;
      classList['red-icon'] = true;
    }

    if (couldNotStart) {
      tooltipLabel = this.t('perm_could_not_start.audio');
    } else if (this.micPermission === 'SYSTEM_DENIED') {
      tooltipLabel = this.t('perm_sys_denied.audio');
    } else if (this.micPermission === 'DENIED') {
      tooltipLabel = this.t('perm_denied.audio');
    } else {
      tooltipLabel = this.audioEnabled ? this.t('disable_mic') : this.t('enable_mic');
    }

    return {
      tooltipLabel,
      label,
      icon,
      classList,
      showWarning: hasError || couldNotStart,
      disable: hasError,
    };
  }

  render() {
    if (
      !this.canProduceAudio ||
      ['OFF_STAGE', 'REQUESTED_TO_JOIN_STAGE'].includes(this.stageStatus)
    ) {
      return <Host data-hidden />;
    }

    const { tooltipLabel, label, icon, classList, showWarning, disable } = this.getState();

    return (
      <Host title={label}>
        <rtk-tooltip kind="block" label={tooltipLabel} part="tooltip">
          <rtk-controlbar-button
            part="controlbar-button"
            icon={icon}
            label={label}
            size={this.size}
            iconPack={this.iconPack}
            variant={this.variant}
            class={classList}
            onClick={this.toggleMic}
            showWarning={showWarning}
            disabled={disable}
          />
        </rtk-tooltip>
      </Host>
    );
  }
}
