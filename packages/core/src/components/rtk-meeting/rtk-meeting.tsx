import { Component, h, Element, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import deepMerge from 'lodash-es/merge';
import { PermissionSettings, Size, States } from '../../types/props';
import { getSize } from '../../utils/size';
import { Meeting, RoomLeftState } from '../../types/rtk-client';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { UIConfig } from '../../types/ui-config';
import { createDefaultConfig } from '../../lib/default-ui-config';
import { Render } from '../../lib/render';
import { provideRtkDesignSystem } from '../../index';
import { generateConfig } from '../../utils/config';
import { GridLayout } from '../rtk-grid/rtk-grid';
import ResizeObserver from 'resize-observer-polyfill';
import { uiState, createPeerStore } from '../../utils/sync-with-store/ui-store';

export type MeetingMode = 'fixed' | 'fill';

/**
 * A single component which renders an entire meeting UI.
 *
 * It loads your preset and renders the UI based on it.
 * With this component, you don't have to handle all the states,
 * dialogs and other smaller bits of managing the application.
 */
@Component({
  tag: 'rtk-meeting',
  styleUrl: 'rtk-meeting.css',
  shadow: true,
})
export class RtkMeeting {
  private resizeObserver: ResizeObserver;

  private leaveRoomTimer: number;

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
        (this.meetingStore ? this.meetingStore.state.states.activeDebugger !== true : uiState.states.activeDebugger !== true)
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
      }, this.leaveRoomTimer);
    }
  };

  @Element() host: HTMLRtkMeetingElement;

  private stateUpdateListener: (event: CustomEvent<States>) => void;
  private storeRequestListener: (event: CustomEvent) => void;
  private meetingStore: any = null; // Isolated store for this meeting instance

  /** Whether to load config from preset */
  @Prop({ mutable: true }) loadConfigFromPreset: boolean = true;

  /** Whether to apply the design system on the document root from config */
  @Prop({ mutable: true }) applyDesignSystem: boolean = true;

  /** Fill type */
  @Prop({ reflect: true }) mode: MeetingMode = 'fixed';

  /** Whether participant should leave when this component gets unmounted */
  @Prop() leaveOnUnmount = false;

  /** Meeting object */
  @Prop()
  meeting: Meeting;

  /** Whether to show setup screen or not */
  @Prop({ mutable: true }) showSetupScreen: boolean;

  /** Language */
  @Prop()
  t: RtkI18n = useLanguage();

  /** UI Config */
  @Prop({ mutable: true }) config: UIConfig = createDefaultConfig();

  /** Size */
  @Prop({ reflect: true, mutable: true }) size: Size;

  /** Grid layout */
  @Prop() gridLayout: GridLayout = 'row';

  /** Icon pack */
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** States */
  @Event({ eventName: 'rtkStatesUpdate' }) statesUpdate: EventEmitter<States>;

  private authErrorListener: (ev: CustomEvent<Error>) => void;

  connectedCallback() {
    if (typeof window !== 'undefined') {
      this.authErrorListener = (ev) => {
        if (ev.detail.message.includes('401')) {
          this.updateStates({ meeting: 'ended', roomLeftState: 'unauthorized' });
        }
      };
      window.addEventListener('rtkError', this.authErrorListener);
    }

    // Initialize default values
    this.leaveRoomTimer = 10000;
    this.loadConfigFromPreset = true;
    this.applyDesignSystem = true;

    // Setup event listeners
    this.setupStoreRequestListener();
    this.setupStateUpdateListener();

    this.meetingChanged(this.meeting);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.host);
    if (
      this.applyDesignSystem &&
      this.config?.designTokens &&
      typeof document !== 'undefined' &&
      (this.meetingStore ? this.meetingStore.state.states.activeDebugger !== true : uiState.states.activeDebugger !== true)
    ) {
      provideRtkDesignSystem(document.documentElement, this.config.designTokens);
    }
  }

  disconnectedCallback() {
    if (this.leaveOnUnmount) {
      this.meeting?.leaveRoom();
    }
    this.resizeObserver.disconnect();
    window.removeEventListener('rtkError', this.authErrorListener);

    // Remove event listeners
    if (this.storeRequestListener) {
      this.host.removeEventListener('rtkRequestStore', this.storeRequestListener);
      this.storeRequestListener = null;
    }
    if (this.stateUpdateListener) {
      this.host.removeEventListener('rtkStateUpdate', this.stateUpdateListener);
      this.stateUpdateListener = null;
    }

    // Clear meeting listeners
    if (this.meeting) {
      this.clearListeners(this.meeting);
    }
  }

  private setupStoreRequestListener() {
    // Remove existing listener if any
    if (this.storeRequestListener) {
      this.host.removeEventListener('rtkRequestStore', this.storeRequestListener);
    }

    console.log('RtkMeeting: Setting up store request listener');

    // Listen for store requests from child components
    this.storeRequestListener = (event: CustomEvent<{element: HTMLElement, propName: string, requestId: string}>) => {
      // Provide isolated store if available, otherwise fall back to global store
      const storeToProvide = this.meetingStore || { state: uiState };
      console.log('RtkMeeting: Providing store for', event.detail.element.tagName, this.meetingStore ? '(isolated)' : '(global)');
      
      const responseEvent = new CustomEvent('rtkProvideStore', {
        detail: { store: storeToProvide, requestId: event.detail.requestId }
      });
      document.dispatchEvent(responseEvent);
      
      // Stop the event from bubbling further to prevent other meetings from handling it
      event.stopPropagation();
    };
    
    this.host.addEventListener('rtkRequestStore', this.storeRequestListener);
    console.log('RtkMeeting: Store request listener added to host');
  }

  private setupStateUpdateListener() {
    if (this.stateUpdateListener) {
      this.host.removeEventListener('rtkStateUpdate', this.stateUpdateListener);
    }

    console.log('RtkMeeting: Setting up state update listener');

    this.stateUpdateListener = (event: CustomEvent<States>) => {
      const eventTarget = event.target as HTMLElement;
      console.log(`RtkMeeting handling state update from ${eventTarget.tagName}`);
      if (!this.host.contains(eventTarget)) {
        return;
      }
      console.log(`RtkMeeting handling state update from ${eventTarget.tagName}. Going further.`);

      this.updateStates(event.detail);
      
      event.stopPropagation();
    };
    
    this.host.addEventListener('rtkStateUpdate', this.stateUpdateListener);
    console.log('RtkMeeting: Event listener added to host');
  }

  private clearListeners(meeting: Meeting) {
    if (!meeting) return;
    meeting.self.removeListener('roomLeft', this.roomLeftListener);
    meeting.self.removeListener('roomJoined', this.roomJoinedListener);
    meeting.self.removeListener('waitlisted', this.waitlistedListener);
    meeting.self.removeListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
    meeting.meta.removeListener('socketConnectionUpdate', this.socketConnectionUpdateListener);
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if (!meeting) return;

    // Create isolated store for this meeting instance
    if (meeting?.self?.id) {
      this.meetingStore = createPeerStore(meeting.self.id);
      this.meetingStore.state.meeting = meeting;
      console.log(`RtkMeeting: Created isolated store for meeting ${meeting.self.id}`);
    } else {
      this.meetingStore = null;
    }

    this.updateStates({ viewType: meeting.meta.viewType });

    if (this.loadConfigFromPreset && meeting.self.config != null) {
      const theme = meeting.self.config;
      const { config, data } = generateConfig(theme, meeting);

      this.config = config;
      if (this.showSetupScreen == null) {
        this.showSetupScreen = data.showSetupScreen;
      }

      if (
        meeting.connectedMeetings.supportsConnectedMeetings &&
        (this.meetingStore ? this.meetingStore.state.states.activeBreakoutRoomsManager?.destinationMeetingId : uiState.states.activeBreakoutRoomsManager?.destinationMeetingId)
      ) {
        this.showSetupScreen = false;
      }
    }

    if (
      this.applyDesignSystem &&
      this.config?.designTokens &&
      typeof document !== 'undefined' &&
      (this.meetingStore ? this.meetingStore.state.states.activeDebugger !== true : uiState.states.activeDebugger !== true)
    ) {
      provideRtkDesignSystem(document.documentElement, this.config.designTokens);
    }
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

  private handleChangingMeeting = (destinationMeetingId: string) => {
    const currentStates = this.meetingStore ? this.meetingStore.state.states : uiState.states;
    this.updateStates({
      activeBreakoutRoomsManager: {
        ...currentStates.activeBreakoutRoomsManager,
        destinationMeetingId,
      },
    });
  };

  private handleResize() {
    this.size = getSize(this.host.clientWidth);
  }

  private updateStates(states: Partial<States>) {
    // Use isolated store if available, otherwise fall back to global store
    const targetStore = this.meetingStore || { state: uiState };
    const newStates = Object.assign({}, targetStore.state.states);
    targetStore.state.states = deepMerge(newStates, states);
    console.log(`RtkMeeting: Updated states in ${this.meetingStore ? 'isolated' : 'global'} store`, states);
    // Don't emit statesUpdate to prevent cross-contamination
    // this.statesUpdate.emit(targetStore.state.states);
  }

  render() {
    const defaults = {
      meeting: this.meeting,
      size: this.size,
      states: this.meetingStore ? this.meetingStore.state.states : uiState.states,
      config: this.config,
      iconPack: this.iconPack,
      t: this.t,
    };

    if (this.meetingStore ? this.meetingStore.state.states.viewType === 'CHAT' : uiState.states.viewType === 'CHAT') {
      return <rtk-chat {...defaults} />;
    }

    const elementProps = {
      'rtk-grid': {
        layout: this.gridLayout,
      },
    };

    return <Render element="rtk-meeting" defaults={defaults} asHost elementProps={elementProps} />;
  }
}
