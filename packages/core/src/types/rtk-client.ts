import type RealtimeKitClient from '@cloudflare/realtimekit';
import type {
  RTKSelf as Self,
  RTKParticipant as Participant,
  leaveRoomState,
} from '@cloudflare/realtimekit';

// TODO (@tushar): maybe move this to @cloudflare/realtimekit
type WaitlistedParticipant = Readonly<
  Omit<Participant, 'audioTrack' | 'videoTrack' | 'screenShareTracks'>
>;
type Peer = Self | Participant;

type Meeting = RealtimeKitClient;

export type { Meeting, RealtimeKitClient, Peer, Self, Participant, WaitlistedParticipant };

export type RoomLeftState = leaveRoomState;

export type MediaPermission =
  | 'NOT_REQUESTED'
  | 'ACCEPTED'
  | 'DENIED'
  | 'SYSTEM_DENIED'
  | 'COULD_NOT_START'
  | 'CANCELED'
  | 'NO_DEVICES_AVAILABLE';

// eslint-disable-next-line @stencil-community/ban-exported-const-enums
export enum RemoteUpdateType {
  REQUEST_RECEIVED = 'REQUEST_RECEIVED',
  REQUEST_SENT = 'REQUEST_SENT',
  INCOMING_REQUEST_ACCEPTED = 'INCOMING_REQUEST_ACCEPTED',
  OUTGOING_REQUEST_ACCEPTED = 'OUTGOING_REQUEST_ACCEPTED',
  INCOMING_REQUEST_ENDED = 'INCOMING_REQUEST_ENDED',
  OUTGOING_REQUEST_ENDED = 'OUTGOING_REQUEST_ENDED',
}
