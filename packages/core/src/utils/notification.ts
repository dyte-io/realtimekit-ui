import { Notification } from '../types/props';
import { Sound } from '../lib/notification';

/**
 * Send notification which will be displayed in the `<rtk-notifications />` component.
 * @param notification Notification object
 * @param playSound Sound type, if sound type is sent plays that sound with the notification.
 * @returns Return value of emitting the event
 */
export const sendNotification = (
  notification: Notification,
  playSound: Sound | undefined = undefined
) => {
  if (typeof document === 'undefined') return false;

  const event = new CustomEvent<Notification & { playSound: Sound }>('rtkNotification', {
    detail: {
      ...notification,
      playSound,
    },
    composed: true,
  });

  return document.dispatchEvent(event);
};
