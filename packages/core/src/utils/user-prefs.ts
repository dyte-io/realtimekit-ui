import gracefulStorage from './graceful-storage';

const KEY = 'rtk-prefs';

export const setPreference = (key: string, value: any): void => {
  const data = JSON.parse(gracefulStorage.getItem(KEY) || '{}');
  data[key] = JSON.stringify(value);
  gracefulStorage.setItem('rtk-prefs', JSON.stringify(data));
};

export const getPreference = (key: string): string | undefined => {
  const data = JSON.parse(gracefulStorage.getItem(KEY) || '{}');
  return data[key];
};

export const getUserPreferences = () => {
  const prefs = JSON.parse(gracefulStorage.getItem(KEY) || '{}');

  const mirrorVideo = prefs['mirror-video'] ? prefs['mirror-video'] === 'true' : true;
  const muteNotificationSounds = prefs['mute-notification-sounds']
    ? prefs['mute-notification-sounds'] === 'true'
    : false;

  return { mirrorVideo, muteNotificationSounds };
};

export const chatUnreadTimestamps = {};
