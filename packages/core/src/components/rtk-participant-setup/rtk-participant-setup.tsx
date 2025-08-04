import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Peer } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { createDefaultConfig } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import { RTKSelf } from '@cloudflare/realtimekit';

export type VideoState = Pick<Peer, 'videoEnabled' | 'videoTrack'>;

@Component({
  tag: 'rtk-participant-setup',
  styleUrl: 'rtk-participant-setup.css',
  shadow: true,
})
export class RtkParticipantSetup {
  private videoEl: HTMLVideoElement;

  @State() videoState: VideoState;

  @State() isPinned: boolean = false;

  /** Position of name tag */
  @Prop({ reflect: true }) nameTagPosition:
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'top-left'
    | 'top-right'
    | 'top-center' = 'bottom-left';

  /** Whether tile is used for preview */
  @Prop() isPreview: boolean = false;

  /** Participant object */
  @Prop() participant!: Peer;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Config object */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

  /** Variant */
  @Prop({ reflect: true }) variant: 'solid' | 'gradient' = 'solid';

  /** Size */
  @Prop({ reflect: true }) size: Size;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  connectedCallback() {
    // set videoState before initial render and initialize listeners
    this.participantsChanged(this.participant);
  }

  componentDidLoad() {
    // load videoState into video element after first render
    this.videoStateChanged(this.videoState);
  }

  disconnectedCallback() {
    if (this.participant == null) return;

    (this.participant as RTKSelf).removeListener('videoUpdate', this.onVideoUpdate);
  }

  @Watch('participant')
  async participantsChanged(participant: Peer) {
    if (participant != null) {
      this.videoState = {
        videoEnabled: participant.videoEnabled,
        videoTrack: participant.videoTrack,
      };

      this.isPinned = participant.isPinned;

      (participant as RTKSelf).addListener('videoUpdate', this.onVideoUpdate);
    }
  }

  @Watch('videoState')
  videoStateChanged(videoState: VideoState) {
    if (videoState != null && this.videoEl != null) {
      if (videoState.videoEnabled) {
        const stream = new MediaStream();
        stream.addTrack(videoState.videoTrack);
        this.videoEl.srcObject = stream;
      } else {
        this.videoEl.srcObject = undefined;
      }
    }
  }

  private onVideoUpdate = (videoState: VideoState) => {
    this.videoState = videoState;
  };

  private isMirrored() {
    if (this.participant != null) {
      const isSelf = 'preview' in this.participant || this.isPreview;
      if (isSelf) {
        const states = this.states;
        const mirrorVideo = states?.prefs?.mirrorVideo;
        if (typeof mirrorVideo === 'boolean') {
          return mirrorVideo;
        }
      }
    }
    return false;
  }

  render() {
    return (
      <Host>
        <video
          ref={(el) => (this.videoEl = el)}
          class={{
            visible: this.videoState?.videoEnabled,
            mirror: this.isMirrored(),
            [this.config?.config?.videoFit ?? 'cover']: true,
          }}
          autoPlay
          playsInline
          muted
        />
        <slot></slot>
      </Host>
    );
  }
}
