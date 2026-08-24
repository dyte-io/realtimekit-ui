import { newSpecPage } from '@stencil/core/testing';
import { RtkRecordingToggle } from './rtk-recording-toggle';

function createMeeting(startRecording: () => Promise<void>) {
  return {
    recording: {
      recordingState: 'IDLE',
      start: startRecording,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    self: {
      permissions: {
        canRecord: true,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  } as any;
}

describe('<rtk-recording-toggle>', () => {
  it('shows an "already in progress" message when start() rejects with a 1005 conflict', async () => {
    const page = await newSpecPage({
      components: [RtkRecordingToggle],
      html: `<rtk-recording-toggle></rtk-recording-toggle>`,
    });
    const instance = page.rootInstance as RtkRecordingToggle;
    instance.meeting = createMeeting(() => Promise.reject({ code: '1005' }));
    const apiErrorSpy = jest.fn();
    page.root.addEventListener('rtkApiError', apiErrorSpy);

    await (instance as any).toggleRecording();

    expect(apiErrorSpy).toHaveBeenCalledTimes(1);
    expect(apiErrorSpy.mock.calls[0][0].detail.message).toBe('A recording is already in progress.');
  });

  it('shows the generic start error message for any other failure', async () => {
    const page = await newSpecPage({
      components: [RtkRecordingToggle],
      html: `<rtk-recording-toggle></rtk-recording-toggle>`,
    });
    const instance = page.rootInstance as RtkRecordingToggle;
    instance.meeting = createMeeting(() => Promise.reject({ code: '1000' }));
    const apiErrorSpy = jest.fn();
    page.root.addEventListener('rtkApiError', apiErrorSpy);

    await (instance as any).toggleRecording();

    expect(apiErrorSpy).toHaveBeenCalledTimes(1);
    expect(apiErrorSpy.mock.calls[0][0].detail.message).toBe('Error while starting recording.');
  });
});
