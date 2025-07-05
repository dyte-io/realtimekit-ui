import { Component, Host, h, Prop, Watch, State, writeTask } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Size } from '../../types/props';

/**
 * A component which lets to manage your audio devices and audio preferences.
 *
 * Emits `rtkStateUpdate` event with data for muting notification sounds:
 * ```ts
 * {
 *  prefs: {
 *    muteNotificationSounds: boolean
 *  }
 * }
 * ```
 */
@Component({
  tag: 'rtk-camera-selector',
  styleUrl: 'rtk-camera-selector.css',
  shadow: true,
})
export class RtkCameraSelector {
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

  /** variant */
  @Prop() variant: 'full' | 'inline' = 'full';

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() videoDevices: MediaDeviceInfo[] = [];

  @State() currentDevice: MediaDeviceInfo;

  @State() canProduceVideo: boolean = true;

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (!meeting) return;

    meeting.self?.addListener('deviceListUpdate', this.deviceListUpdateListener);
    meeting.self?.addListener('deviceUpdate', this.deviceUpdateListener);
    meeting.self?.addListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);

    writeTask(async () => {
      const videoDevices = await meeting.self.getVideoDevices();
      const currentVideoDevice = meeting.self.getCurrentDevices()?.video;
      //  NOTE(callmetarush): Setting current video device to show on top of list

      if (currentVideoDevice != undefined) {
        this.videoDevices = [
          videoDevices.find((device) => device.deviceId === currentVideoDevice.deviceId) ??
            currentVideoDevice,
          ...videoDevices.filter((device) => device.deviceId !== currentVideoDevice.deviceId),
        ];
      } else {
        this.videoDevices = videoDevices;
      }
    });
  }

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    this.meeting?.stage?.removeListener('stageStatusUpdate', this.stageStateListener);
    this.meeting?.self.removeListener('deviceListUpdate', this.deviceListUpdateListener);
    this.meeting?.self.removeListener('deviceUpdate', this.deviceUpdateListener);
    this.meeting?.self.removeListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
  }

  private stageStateListener = () => {
    this.canProduceVideo = this.meeting.self.permissions.canProduceVideo === 'ALLOWED';
  };

  private deviceListUpdateListener = ({ devices }) => {
    this.videoDevices = devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput');
  };

  private deviceUpdateListener = ({ device }) => {
    if (device.kind !== 'videoinput') return;
    this.currentDevice = device;
  };

  private mediaPermissionUpdateListener = async ({ kind, message }) => {
    if (!this.meeting) return;
    if (kind === 'video' && message === 'ACCEPTED') {
      this.videoDevices = await this.meeting.self.getVideoDevices();
    }
  };

  private async setDevice(deviceId: string) {
    const device = this.videoDevices.find((d) => d.deviceId === deviceId);
    this.currentDevice = device;

    if (device != null) {
      await this.meeting?.self.setDevice(device);
    }
  }

  render() {
    if (!this.meeting) return null;

    let unnamedVideoCount = 0;

    return (
      <Host>
        {this.canProduceVideo && (
          <div class={'group container ' + this.variant} part="camera-selection">
            <label>
              {this.variant !== 'inline' && this.t('camera')}
              <rtk-icon icon={this.iconPack.video_on} size="sm" />
            </label>
            <div class="row">
              <select
                class="rtk-select"
                onChange={(e) => this.setDevice((e.target as HTMLSelectElement).value)}
              >
                {this.videoDevices.map(({ deviceId, label }) => (
                  <option selected={this.currentDevice?.deviceId === deviceId} value={deviceId}>
                    {label || `Camera ${++unnamedVideoCount}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
