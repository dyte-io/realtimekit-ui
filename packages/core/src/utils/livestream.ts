/* eslint-disable @stencil-community/ban-exported-const-enums */
import RealtimeKitClient from '@cloudflare/realtimekit';
import { Level } from 'hls.js';

/**
 * Can view the livestream
 */
export const isLiveStreamViewer = (meeting: RealtimeKitClient) => {
  if (!showLivestream(meeting)) return false;
  return meeting.meta.viewType === 'LIVESTREAM' && meeting.stage.status !== 'ON_STAGE';
};

/**
 * Can start/stop the livestream
 */
export const isLiveStreamHost = (meeting: RealtimeKitClient) => {
  if (!showLivestream(meeting)) return false;
  return meeting.meta.viewType === 'LIVESTREAM' && meeting?.self?.permissions.canLivestream;
};

export const showLivestream = (meeting: RealtimeKitClient) => {
  return meeting?.livestream;
};

export enum PlayerState {
  BUFFERING = 'Buffering',
  ENDED = 'Ended',
  IDLE = 'Idle',
  PAUSED = 'Paused',
  PLAYING = 'Playing',
  READY = 'Ready',
}

export enum PlayerEventType {
  INITIALIZED = 'PlayerInitialized',
  QUALITY_CHANGED = 'PlayerQualityChanged',
  DURATION_CHANGED = 'PlayerDurationChanged',
  VOLUME_CHANGED = 'PlayerVolumeChanged',
  MUTED_CHANGED = 'PlayerMutedChanged',
  PLAYBACK_RATE_CHANGED = 'PlayerPlaybackRateChanged',
  REBUFFERING = 'PlayerRebuffering',
  AUDIO_BLOCKED = 'PlayerAudioBlocked',
  PLAYBACK_BLOCKED = 'PlayerPlaybackBlocked',
  ERROR = 'PlayerError',
  RECOVERABLE_ERROR = 'PlayerRecoverableError',
  ANALYTICS_EVENT = 'PlayerAnalyticsEvent',
  TIME_UPDATE = 'PlayerTimeUpdate',
  BUFFER_UPDATE = 'PlayerBufferUpdate',
  SEEK_COMPLETED = 'PlayerSeekCompleted',
  SESSION_DATA = 'PlayerSessionData',
  STATE_CHANGED = 'PlayerStateChanged',
  WORKER_ERROR = 'PlayerWorkerError',
  METADATA = 'PlayerMetadata',
  TEXT_CUE = 'PlayerTextCue',
  TEXT_METADATA_CUE = 'PlayerTextMetadataCue',
  AD_CUE = 'PlayerAdCue',
  STREAM_SOURCE_CUE = 'PlayerStreamSourceCue',
  NETWORK_UNAVAILABLE = 'PlayerNetworkUnavailable',
  SEGMENT_DISCONTINUITY = 'PlayerSegmentDiscontinuity',
  SEGMENT_METADATA = 'PlayerSegmentMetadata',
  PLAYER_METADATA = 'PlayerMetadata',
}

/**
 * NOTE(callmetarush): For some reason PlayerMetadata is not in type but spams events like crazy
 */
export const awsIvsPlayerEventsToIgnore: PlayerEventType[] = [
  PlayerEventType.TIME_UPDATE,
  PlayerEventType.BUFFER_UPDATE,
  PlayerEventType.TEXT_METADATA_CUE,
  PlayerEventType.PLAYER_METADATA,
];

export const isIvsPlayerCallStatsEvent: PlayerEventType[] = [
  // CallStats Major Events
  PlayerEventType.REBUFFERING, // no payload
  PlayerEventType.AUDIO_BLOCKED, // no payload
  PlayerEventType.PLAYBACK_BLOCKED, // no payload
  PlayerEventType.ERROR,
  PlayerEventType.RECOVERABLE_ERROR,
  PlayerEventType.WORKER_ERROR,
  // According to docs it says:
  // "Indicates that a playback unavailable event occurred."
  //
  // So I am taking a guess this can occcur
  // even when a viewer is online
  PlayerEventType.NETWORK_UNAVAILABLE, // no payload

  // CallStats Minor Events
  PlayerEventType.ANALYTICS_EVENT,
  PlayerEventType.PLAYBACK_RATE_CHANGED,
  PlayerEventType.QUALITY_CHANGED,
  PlayerEventType.INITIALIZED, // no payload
];

export function getLivestreamViewerAllowedQualityLevels({
  meeting,
  hlsLevels,
}: {
  meeting: RealtimeKitClient;
  hlsLevels: Level[];
}): {
  autoLevelChangeAllowed: boolean;
  levels: Level[];
} {
  let allowedQualities = meeting.self.config.livestreamViewerQualities || [];

  if (!allowedQualities.length) {
    return { autoLevelChangeAllowed: true, levels: hlsLevels };
  }

  // Filter allowed qualities
  const desiredLevels = hlsLevels.filter((level) =>
    (allowedQualities as number[]).includes(level.height)
  );

  if (!desiredLevels.length) {
    return { autoLevelChangeAllowed: true, levels: hlsLevels };
  }
  return { autoLevelChangeAllowed: false, levels: desiredLevels };
}
