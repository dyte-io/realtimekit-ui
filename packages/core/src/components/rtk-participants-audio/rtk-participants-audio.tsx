import { Component, Host, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { Meeting, Peer } from '../../types/rtk-client';
import RTKAudio from '../../lib/audio';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { IconPack, defaultIconPack } from '../../lib/icons';
import type { StageStatus } from '@cloudflare/realtimekit';
import { SyncWithStore } from '../../utils/sync-with-store';
import { isLiveStreamViewer } from '../../utils/livestream';

/**
 * A component which plays all the audio from participants and screenshares.
 */
@Component({
  tag: 'rtk-participants-audio',
  styleUrl: 'rtk-participants-audio.css',
  shadow: true,
})
export class RtkParticipantsAudio {
  private audio: RTKAudio;

  private audioUpdateListener: (
    participant: Pick<Peer, 'id' | 'audioEnabled' | 'audioTrack'>
  ) => void;
  private participantLeftListener: (participant: Pick<Peer, 'id'>) => void;
  private screenShareUpdateListener: (
    participant: Pick<Peer, 'id' | 'screenShareEnabled' | 'screenShareTracks'>
  ) => void;
  private deviceUpdateListener: (data: { device: MediaDeviceInfo; preview: boolean }) => void;

  private stageStatusUpdateListener: (status: StageStatus) => void;

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

  /** Pass existing audio element */
  @Prop() preloadedAudioElem: HTMLAudioElement = undefined;

  /** Callback to execute when the dialog is closed */
  @Event({ eventName: 'dialogClose' }) dialogClose: EventEmitter<void>;

  @State() showPlayDialog: boolean = false;

  componentDidLoad() {
    this.meetingChanged(this.meeting);
  }

  disconnectedCallback() {
    if (!this.meeting) return;

    this.audioUpdateListener &&
      this.meeting.participants.joined.removeListener('audioUpdate', this.audioUpdateListener);
    this.screenShareUpdateListener &&
      this.meeting.participants.joined.removeListener(
        'screenShareUpdate',
        this.screenShareUpdateListener
      );
    this.participantLeftListener &&
      this.meeting.participants.joined.removeListener(
        'participantLeft',
        this.participantLeftListener
      );

    this.deviceUpdateListener &&
      this.meeting.self.removeListener('deviceUpdate', this.deviceUpdateListener);

    this.stageStatusUpdateListener &&
      this.meeting.stage?.removeListener('stageStatusUpdate', this.stageStatusUpdateListener);
  }

  private async setupAudio() {
    this.audio = new RTKAudio(this.meeting, this.preloadedAudioElem);
    // Set the device to the current speaker device
    const currentDevices = this.meeting.self.getCurrentDevices();
    if (currentDevices.speaker != null) {
      await this.audio.setDevice(currentDevices.speaker.deviceId);
    }
  }

  private async handleAutoPlayError() {
    if (!this.audio) {
      await this.setupAudio();
    }

    this.audio.onError(() => {
      this.showPlayDialog = true;
    });
    this.audio.play();
    return;
  }

  private async handleEvents(meeting: Meeting) {
    this.audioUpdateListener = ({ id, audioEnabled, audioTrack }) => {
      const audioId = `audio-${id}`;
      if (audioEnabled && audioTrack != null) {
        this.audio.addTrack(audioId, audioTrack);
      } else {
        this.audio.removeTrack(audioId);
      }
    };

    const participants = meeting.participants.joined.toArray();
    for (const participant of participants) {
      this.audioUpdateListener(participant);
    }

    this.participantLeftListener = ({ id }) => {
      this.audio.removeTrack(`audio-${id}`);
      this.audio.removeTrack(`screenshare-${id}`);
    };

    this.screenShareUpdateListener = ({ id, screenShareEnabled, screenShareTracks }) => {
      const audioId = `screenshare-${id}`;
      if (screenShareEnabled && screenShareTracks.audio != null) {
        this.audio.addTrack(audioId, screenShareTracks.audio);
      } else {
        this.audio.removeTrack(audioId);
      }
    };

    this.deviceUpdateListener = ({ device, preview }) => {
      if (preview) return;
      if (device.kind === 'audiooutput') {
        this.audio.setDevice(device.deviceId);
      }
    };

    meeting.participants.joined.addListener('audioUpdate', this.audioUpdateListener);
    meeting.participants.joined.addListener('screenShareUpdate', this.screenShareUpdateListener);
    meeting.participants.joined.addListener('participantLeft', this.participantLeftListener);

    meeting.self.addListener('deviceUpdate', this.deviceUpdateListener);
  }

  @Watch('meeting')
  async meetingChanged(meeting: Meeting) {
    if (!meeting) return;
    this.setupAudio();
    if (isLiveStreamViewer(meeting)) {
      this.stageStatusUpdateListener = async (status: StageStatus) => {
        if (status === 'ON_STAGE') {
          // NOTE(@madhugb): When someone joins stage handle autoplay and also handle events
          await this.handleAutoPlayError();
        }
      };
      meeting.stage?.on('stageStatusUpdate', this.stageStatusUpdateListener);
    } else {
      await this.handleAutoPlayError();
    }

    await this.handleEvents(meeting);
  }

  private onRtkDialogClose = () => {
    this.showPlayDialog = false;
    this.dialogClose.emit();
  };

  render() {
    return (
      <Host>
        {this.showPlayDialog && (
          <rtk-dialog
            open
            onRtkDialogClose={this.onRtkDialogClose}
            hideCloseButton
            disableEscapeKey
            iconPack={this.iconPack}
            t={this.t}
          >
            <div class="modal">
              <h3>{this.t('audio_playback.title')}</h3>
              <p>{this.t('audio_playback.description')}</p>
              <rtk-button
                kind="wide"
                onClick={() => {
                  this.audio.play();
                  this.onRtkDialogClose();
                }}
                title={this.t('audio_playback')}
              >
                {this.t('audio_playback')}
              </rtk-button>
            </div>
          </rtk-dialog>
        )}
      </Host>
    );
  }
}
