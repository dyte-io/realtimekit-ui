import RealtimeKitClient from '@cloudflare/realtimekit';

export const canJoinStage = (meeting: RealtimeKitClient) => {
  return (
    meeting?.self?.permissions.stageEnabled && meeting?.self?.permissions.stageAccess === 'ALLOWED'
  );
};

export const canRequestToJoinStage = (meeting: RealtimeKitClient) => {
  return (
    meeting?.self?.permissions.stageEnabled &&
    meeting?.self?.permissions.stageAccess !== 'NOT_ALLOWED'
  );
};
