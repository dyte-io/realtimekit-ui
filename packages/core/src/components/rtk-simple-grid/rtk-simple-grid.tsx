import { Component, Host, h, Prop, Element, State, Watch } from '@stencil/core';
import { createDefaultConfig } from '../../lib/default-ui-config';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Render } from '../../lib/render';
import { Meeting, Peer } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { Dimensions, useGrid } from '../../lib/grid';
import ResizeObserver from 'resize-observer-polyfill';
import { SyncWithStore } from '../../utils/sync-with-store';
import { MediaConnectionState } from '@cloudflare/realtimekit';

/**
 * A grid component which renders only the participants in a simple grid.
 */
@Component({
  tag: 'rtk-simple-grid',
  styleUrl: 'rtk-simple-grid.css',
  shadow: true,
})
export class RtkSimpleGrid {
  private resizeObserver: ResizeObserver;

  /** Participants */
  @Prop() participants: Peer[] = [];

  /**
   * Aspect Ratio of participant tile
   *
   * Format: `width:height`
   */
  @Prop() aspectRatio: string = '16:9';

  /** Gap between participant tiles */
  @Prop() gap: number = 8;

  /** Size */
  @Prop({ reflect: true }) size: Size;

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** UI Config */
  @SyncWithStore()
  @Prop()
  config: UIConfig = createDefaultConfig();

  /** Icon Pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() dimensions: Dimensions = { width: 0, height: 0 };

  @State() mediaConnection: MediaConnectionState;

  @Element() host: HTMLRtkSimpleGridElement;

  private setHostDimensions = () => {
    const { clientWidth: width, clientHeight: height } = this.host;
    this.dimensions = { width, height };
  };

  connectedCallback() {
    this.resizeObserver = new ResizeObserver(this.setHostDimensions);
    this.resizeObserver.observe(this.host);
    this.meetingChanged(this.meeting);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    const meta = meeting?.meta;
    if (meta) this.mediaConnection = { ...meta.mediaState };
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  render() {
    if (!this.meeting) return null;
    const defaults = {
      meeting: this.meeting,
      config: this.config,
      states: this.states,
      size: this.size,
      iconPack: this.iconPack,
      t: this.t,
    };

    const { width, height, getPosition } = useGrid({
      dimensions: this.dimensions,
      count: this.participants.length,
      aspectRatio: this.aspectRatio,
      gap: this.gap,
    });

    return (
      <Host>
        <slot>
          {this.participants.map((participant, index) => {
            const { top, left } = getPosition(index);

            return (
              <Render
                element="rtk-participant-tile"
                defaults={defaults}
                props={{
                  participant,
                  style: {
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  },
                  key: participant.id,
                  'data-participant': participant.id,
                  mediaConnection: this.mediaConnection,
                }}
                childProps={{ participant }}
                deepProps
              />
            );
          })}
        </slot>
      </Host>
    );
  }
}
