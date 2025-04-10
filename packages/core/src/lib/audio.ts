import { Meeting } from '../types/rtk-client';
import { disableSettingSinkId } from '../utils/flags';
import logger from '../utils/logger';

interface PeerAudio {
  id: string;
  track: MediaStreamTrack;
}

/**
 * Handles audio from participants in a meeting
 */
export default class RTKAudio {
  private audio: HTMLAudioElement;
  private audioStream: MediaStream;
  private meeting: Meeting;

  private audioTracks: PeerAudio[];

  private _onError: () => void;

  constructor(meeting: Meeting, audio?: HTMLAudioElement) {
    this.meeting = meeting;
    this.audio = audio ?? document.createElement('audio');
    this.audio.autoplay = true;

    this.audioStream = new MediaStream();
    this.audio.srcObject = this.audioStream;

    this.audioTracks = [];
  }

  addTrack(id: string, track: MediaStreamTrack) {
    if (!this.audioTracks.some((a) => a.id === id)) {
      this.audioTracks.push({ id, track });
      this.audioStream.addTrack(track);

      this.play();
    }
  }

  removeTrack(id: string) {
    const track = this.audioTracks.find((a) => a.id === id);
    if (track != null) {
      this.audioStream.removeTrack(track.track);
      this.audioTracks = this.audioTracks.filter((a) => a.id !== id);
    }
  }

  async play() {
    this.audio.srcObject = this.audioStream;

    await this.audio.play()?.catch((err) => {
      if (err.name === 'NotAllowedError') {
        if (this._onError != null) {
          this._onError();
        }
      } else if (err.name !== 'AbortError') {
        logger.error('[rtk-audio] play() error\n', err);
      }
    });
  }

  async setDevice(id: string) {
    if (disableSettingSinkId(this.meeting)) return;
    await (this.audio as any).setSinkId?.(id)?.catch((err) => {
      logger.error('[rtk-audio] setSinkId() error\n', err);
    });
  }

  onError(onError: () => void) {
    this._onError = onError;
  }
}
