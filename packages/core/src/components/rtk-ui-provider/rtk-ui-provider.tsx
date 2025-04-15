import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  Watch,
} from '@stencil/core';
import { Meeting, RoomLeftState } from '../../types/rtk-client';
import {
  defaultConfig,
  RtkI18n,
  generateConfig,
  IconPack,
  provideRtkDesignSystem,
  Size,
  States,
  UIConfig,
} from '../../exports';
import { uiState, uiStore } from '../../utils/sync-with-store/ui-store';
import deepMerge from 'lodash-es/merge';
import { PermissionSettings } from '../../types/props';
import { getSize } from '../../utils/size';

const LEAVE_ROOM_TIMER = 10000;

@Component({
  tag: 'rtk-ui-provider',
  styleUrl: 'rtk-ui-provider.css',
})
export class RtkUiProvider {
  @Element() host: HTMLRtkUiProviderElement;

  /** Meeting */
  @Prop()
  meeting: Meeting;

  /** Icon pack */
  @Prop()
  iconPack: IconPack;

  /** Language utility */
  @Prop()
  t: RtkI18n;

  /** Config */
  @Prop() config: UIConfig = defaultConfig;

  /** Size */
  @Prop({ reflect: true, mutable: true }) size: Size;

  /** Whether to show setup screen or not */
  @Prop() showSetupScreen: boolean = false;

  /**
   * Do not render children until meeting is initialized
   * @default false
   */
  @Prop() noRenderUntilMeeting: boolean = false;

  /** States event */
  @Event({ eventName: 'rtkStatesUpdate' }) statesUpdate: EventEmitter<States>;

  private authErrorListener: (ev: CustomEvent<Error>) => void;

  private resizeObserver: ResizeObserver;

  @Listen('rtkStateUpdate')
  listenState(e: CustomEvent<States>) {
    this.updateStates(e.detail);
  }

  private updateStates(states: Partial<States>) {
    const newStates = Object.assign({}, uiState.states);
    uiState.states = deepMerge(newStates, states);
    this.statesUpdate.emit(uiState.states);
  }

  connectedCallback() {
    if (typeof window !== 'undefined') {
      this.authErrorListener = (ev) => {
        if (ev.detail.message.includes('401')) {
          this.updateStates({ meeting: 'ended', roomLeftState: 'unauthorized' });
        }
      };
      window.addEventListener('rtkError', this.authErrorListener);
    }

    this.onMeetingChange(this.meeting);
    this.onIconPackChange(this.iconPack);
    this.onTChange(this.t);
    this.onConfigChange(this.config);
    this.onSizeChange(this.size);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.host);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    window.removeEventListener('rtkError', this.authErrorListener);

    if (!this.meeting) return;
    this.meeting.self.removeListener('roomLeft', this.roomLeftListener);
    this.meeting.self.removeListener('roomJoined', this.roomJoinedListener);
    this.meeting.self.removeListener('waitlisted', this.waitlistedListener);
    this.meeting.self.removeListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
    this.meeting.meta.removeListener('socketConnectionUpdate', this.socketConnectionUpdateListener);
  }

  @Watch('meeting')
  onMeetingChange(meeting: Meeting) {
    uiStore.state.meeting = meeting;

    if (!meeting) return;

    this.updateStates({ viewType: meeting.meta.viewType });
    this.loadTheme();

    meeting.self.addListener('roomJoined', this.roomJoinedListener);
    meeting.self.addListener('waitlisted', this.waitlistedListener);
    meeting.self.addListener('roomLeft', this.roomLeftListener);
    meeting.self.addListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
    meeting.meta.addListener('socketConnectionUpdate', this.socketConnectionUpdateListener);

    if (meeting.connectedMeetings.supportsConnectedMeetings) {
      meeting.connectedMeetings.once('changingMeeting', this.handleChangingMeeting);
    }

    if (meeting.self.roomJoined) {
      this.updateStates({ meeting: 'joined' });
    } else {
      if (this.showSetupScreen) {
        this.updateStates({ meeting: 'setup' });
      } else {
        meeting.joinRoom();
      }
    }

    window.removeEventListener('rtkError', this.authErrorListener);
  }

  @Watch('iconPack')
  onIconPackChange(newIconPack: IconPack) {
    uiStore.state.iconPack = newIconPack;
  }

  @Watch('t')
  onTChange(newT: RtkI18n) {
    uiStore.state.t = newT;
  }

  @Watch('config')
  onConfigChange(config: UIConfig) {
    uiStore.state.config = config;
  }

  @Watch('size')
  onSizeChange(newSize: Size) {
    uiStore.state.size = newSize;
  }

  private handleResize = () => {
    this.size = getSize(this.host.clientWidth);
  };

  private loadTheme = () => {
    if (this.config === defaultConfig) {
      const { config } = generateConfig(this.meeting.self.config, this.meeting);
      this.config = config;
    }

    if (this.config?.designTokens) {
      provideRtkDesignSystem(document.documentElement, this.config.designTokens);
    }
  };

  private roomJoinedListener = () => {
    this.updateStates({ meeting: 'joined' });
  };

  private waitlistedListener = () => {
    this.updateStates({ meeting: 'waiting' });
  };

  private roomLeftListener = ({ state }: { state: RoomLeftState }) => {
    // Let socketConnectionUpdate listener handle this case.
    if (state === 'disconnected' || state === 'failed') return;
    this.updateStates({ meeting: 'ended', roomLeftState: state });
  };

  private mediaPermissionUpdateListener = ({ kind, message }) => {
    if (['audio', 'video'].includes(kind)) {
      if (
        (message === 'DENIED' || message === 'SYSTEM_DENIED') &&
        uiState.states.activeDebugger !== true
      ) {
        const permissionModalSettings: PermissionSettings = {
          enabled: true,
          kind,
        };
        this.updateStates({ activePermissionsMessage: permissionModalSettings });
      }
    }
  };

  private socketConnectionUpdateListener = ({ state }) => {
    if (state === 'failed') {
      setTimeout(() => {
        this.meeting.leave('disconnected');
      }, LEAVE_ROOM_TIMER);
    }
  };

  private handleChangingMeeting(destinationMeetingId: string) {
    this.updateStates({
      activeBreakoutRoomsManager: {
        ...uiState.states.activeBreakoutRoomsManager,
        destinationMeetingId,
      },
    });
  }

  render() {
    return <Host>{this.noRenderUntilMeeting && !this.meeting ? null : <slot />}</Host>;
  }
}
