import { Component, Host, h, Prop, State, Element, Watch, writeTask } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';

import { Transcript, States } from '../../types/props';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { UIConfig } from '../../types/ui-config';
import { createDefaultConfig } from '../../exports';
import { SyncWithStore } from '../../utils/sync-with-store';
import clone from '../../utils/clone';

/**
 * A component which handles transcripts.
 *
 * You can configure which transcripts you want to see and which ones you want to hear.
 * There are also certain limits which you can set as well.
 */
@Component({
  tag: 'rtk-transcripts',
  styleUrl: 'rtk-transcripts.css',
  shadow: true,
})
export class RtkTranscripts {
  private disconnectTimeout: NodeJS.Timeout;

  @Element() host: HTMLRtkTranscriptsElement;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Config object */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() transcripts: Array<Transcript & { renderedId?: string }> = [];

  @State() listenerAttached = false;

  connectedCallback() {
    this.meetingChanged(this.meeting);
  }

  private addListener(meeting: Meeting) {
    meeting?.ai?.addListener('transcript', this.onTranscript);
    this.listenerAttached = true;
  }

  private clearListeners(meeting: Meeting) {
    this.onTranscript && meeting?.ai?.removeListener('transcript', this.onTranscript);
    this.listenerAttached = false;
    clearTimeout(this.disconnectTimeout);
    this.transcripts = [];
  }

  disconnectedCallback() {
    if (this.meeting == null) return;
    this.clearListeners(this.meeting);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting, oldMeeting?: Meeting) {
    clearTimeout(this.disconnectTimeout);
    if (oldMeeting !== undefined) this.clearListeners(oldMeeting);
    if (meeting == null) return;

    if (this.states.activeCaptions) {
      this.addListener(meeting);
    }
  }

  @Watch('states')
  statesChanged(states?: States) {
    if (!states) return;

    if (states.activeCaptions && !this.listenerAttached) {
      this.addListener(this.meeting);
    }

    if (!states.activeCaptions && this.listenerAttached) {
      this.clearListeners(this.meeting);
    }
  }

  private onTranscript = (transcript: Transcript) => {
    if (transcript.transcript) {
      this.add(transcript);
    }
  };

  private transcriptionsReducer(acc: Transcript[], t: Transcript) {
    if (!acc.length) {
      return [t];
    }

    let lastElement = acc[acc.length - 1];

    if (lastElement.peerId !== t.peerId) {
      return acc.concat(t);
    }

    if (lastElement.id === t.id) {
      lastElement.transcript = t.transcript;
      acc.pop();
      return acc.concat(clone(lastElement));
    }

    return acc.concat(t);
  }

  private add(transcript: Transcript) {
    // show transcripts only if tab is in focus and a maximum of 3 at a time
    // this.transcripts.splice(0, this.transcripts.length - 2);
    this.transcripts = this.transcriptionsReducer(this.transcripts, transcript);
  }

  private remove(renderedId: string) {
    this.transcripts = this.transcripts.filter(
      (transcript) => transcript.renderedId !== renderedId
    );
  }

  private handleDismiss(e: CustomEvent<{ id: string; renderedId: string }>) {
    e.stopPropagation();

    const { id, renderedId } = e.detail;
    const el = this.host.shadowRoot.querySelector(`[data-id="${id}"]`);
    // exit animation
    el?.classList.add('exit');

    setTimeout(() => {
      writeTask(() => {
        this.remove(renderedId);
      });
    }, 400);
  }

  private renderTranscripts() {
    const renderedTranscripts = [];
    this.transcripts.forEach((transcript) => {
      const t = {
        name: transcript.name,
        date: transcript.date,
        peerId: transcript.peerId,
        transcript: transcript.transcript,
        id: transcript.id,
        renderedId: transcript.id,
      };

      if (!renderedTranscripts.length) {
        transcript.renderedId = t.renderedId;
        renderedTranscripts.push(t);
        return;
      }

      const lastTranscript = renderedTranscripts[renderedTranscripts.length - 1];

      const maxTranscriptLength = 400;
      if (
        lastTranscript.transcript.length + t.transcript.length > maxTranscriptLength ||
        lastTranscript.peerId !== transcript.peerId
      ) {
        transcript.renderedId = t.renderedId;
        renderedTranscripts.push(t);
        return;
      }

      lastTranscript.transcript += ' ' + transcript.transcript;
      transcript.renderedId = lastTranscript.renderedId;
    });

    renderedTranscripts.splice(0, renderedTranscripts.length - 2);
    return renderedTranscripts?.map((transcript) => (
      <rtk-transcript
        key={transcript.id}
        data-id={transcript.id}
        transcript={transcript}
        onRtkTranscriptDismiss={(e: CustomEvent<{ id: string; renderedId: string }>) =>
          this.handleDismiss(e)
        }
        t={this.t}
      />
    ));
  }

  render() {
    if (!this.states.activeCaptions) return;
    return <Host>{this.renderTranscripts()}</Host>;
  }
}
