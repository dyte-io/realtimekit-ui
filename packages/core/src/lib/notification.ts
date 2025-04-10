import { Meeting } from '../types/rtk-client';
import { disableSettingSinkId } from '../utils/flags';
import logger from '../utils/logger';

const SOUNDS = {
  joined: 'https://dyte-uploads.s3.ap-south-1.amazonaws.com/notification_join.mp3',
  left: 'https://dyte-uploads.s3.ap-south-1.amazonaws.com/notification_join.mp3',
  message: 'https://dyte-uploads.s3.ap-south-1.amazonaws.com/notification_message.mp3',
};

export type Sound = keyof typeof SOUNDS;

/**
 * Handles notification sounds in a meeting
 */
export default class RTKNotificationsAudio {
  private audio: HTMLAudioElement;
  private playing: boolean;
  private meeting: Meeting;

  constructor(meeting: Meeting) {
    this.meeting = meeting;
    this.audio = document.createElement('audio');
    this.audio.volume = 0.3;
  }

  play(sound: Sound, duration: number = 3000) {
    if (this.playing) return;

    this.playing = true;

    this.audio.src = SOUNDS[sound];
    this.audio.volume = 0.3;
    this.audio.play()?.catch((err) => {
      logger.error('[rtk-notifications] play() failed\n', { sound, duration }, err);
    });

    setTimeout(() => {
      this.playing = false;
    }, duration);
  }

  async setDevice(id: string) {
    if (disableSettingSinkId(this.meeting)) return;
    await (this.audio as any)?.setSinkId?.(id)?.catch((err) => {
      logger.error('[rtk-notifications] setSinkId() error\n', err);
    });
  }
}
