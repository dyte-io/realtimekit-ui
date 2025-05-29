import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Meeting, Peer, MediaPermission } from '../../types/rtk-client';
import { PermissionSettings, Size, States } from '../../types/props';
import { ControlBarVariant } from '../rtk-controlbar-button/rtk-controlbar-button';
import { SyncWithStore } from '../../utils/sync-with-store';
import { StageStatus } from '@cloudflare/realtimekit';

/**
 * A button which toggles your camera.
 */
@Component({
  tag: 'rtk-camera-toggle',
  styleUrl: 'rtk-camera-toggle.css',
  shadow: true,
})
export class RtkCameraToggle {
  private videoUpdateListener = ({ videoEnabled }: Peer) => {
    this.videoEnabled = videoEnabled;
  };

  private stageStatusListener = () => {
    this.stageStatus = this.meeting.stage.status;
    this.canProduceVideo = this.meeting.self.permissions.canProduceVideo === 'ALLOWED';
  };

  private mediaPermissionUpdateListener = ({ kind, message }) => {
    if (kind === 'video') {
      this.cameraPermission = message;
    }
  };

  private meetingPermissionsUpdateListener = (patch?: {
    media?: { video?: { canProduce?: number } };
  }) => {
    if (patch?.media?.video) {
      this.canProduceVideo = this.meeting.self.permissions.canProduceVideo === 'ALLOWED';
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

  @State() videoEnabled: boolean = false;

  @State() canProduceVideo: boolean = false;

  @State() cameraPermission: MediaPermission = 'NOT_REQUESTED';

  @State() stageStatus: StageStatus = 'OFF_STAGE';

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    this.meeting?.self.removeListener('videoUpdate', this.videoUpdateListener);
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
      this.canProduceVideo = this.meeting.self.permissions.canProduceVideo === 'ALLOWED';
      this.cameraPermission = self.mediaPermissions.video || 'NOT_REQUESTED';
      this.videoEnabled = self.videoEnabled;

      this.stageStatus = meeting.stage.status;
      self.addListener('videoUpdate', this.videoUpdateListener);
      self.addListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
      stage?.addListener('stageStatusUpdate', this.stageStatusListener);
      meeting?.self?.permissions?.addListener(
        'permissionsUpdate',
        this.meetingPermissionsUpdateListener
      );
    }
  }

  private hasPermissionError() {
    return this.cameraPermission === 'DENIED' || this.cameraPermission === 'SYSTEM_DENIED';
  }

  private toggleCamera = () => {
    this.meeting?.__internals__.logger.info('rtkCameraToggle::toggleCamera', {
      media: {
        video: {
          enabled: Boolean(this.meeting?.self?.videoEnabled),
          permission: this.cameraPermission,
          canProduce: this.meeting?.self?.permissions?.canProduceVideo,
        },
      },
      webinar: {
        stageStatus: this.meeting?.stage.status as any,
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
        kind: 'video',
      };
      this.stateUpdate.emit({ activePermissionsMessage: permissionModalSettings });
      return false;
    }

    const self = this.meeting?.self;
    if (self == null || !this.canProduceVideo) {
      return;
    }
    if (self.videoEnabled) {
      self.disableVideo();
    } else {
      self.enableVideo();
    }
  };

  private getState() {
    let tooltipLabel = '';
    let label = '';
    let icon = '';
    let classList = {};
    let hasError = this.hasPermissionError();
    let couldNotStart = this.cameraPermission === 'COULD_NOT_START';

    if (this.videoEnabled && !hasError) {
      label = this.t('video_on');
      icon = this.iconPack.video_on;
    } else {
      label = this.t('video_off');
      icon = this.iconPack.video_off;
      classList['red-icon'] = true;
    }

    if (couldNotStart) {
      tooltipLabel = this.t('perm_could_not_start.video');
    } else if (this.cameraPermission === 'SYSTEM_DENIED') {
      tooltipLabel = this.t('perm_sys_denied.video');
    } else if (this.cameraPermission === 'DENIED') {
      tooltipLabel = this.t('perm_denied.video');
    } else {
      tooltipLabel = this.videoEnabled ? this.t('disable_video') : this.t('enable_video');
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
      !this.canProduceVideo ||
      this.meeting?.meta.viewType === 'AUDIO_ROOM' ||
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
            size={this.size}
            iconPack={this.iconPack}
            class={classList}
            variant={this.variant}
            label={label}
            icon={icon}
            onClick={this.toggleCamera}
            showWarning={showWarning}
            disabled={disable}
          />
        </rtk-tooltip>
      </Host>
    );
  }
}
