import { Component, Element, Event, EventEmitter, h, Host, Prop, Watch } from '@stencil/core';
import { Meeting, RoomLeftState } from '../../types/rtk-client';
import {
  createDefaultConfig,
  RtkI18n,
  generateConfig,
  IconPack,
  provideRtkDesignSystem,
  Size,
  States,
  UIConfig,
} from '../../exports';
import {
  uiStore as legacyGlobalUIStore,
  createPeerStore,
  type RtkUiStoreExtended,
} from '../../utils/sync-with-store/ui-store';
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

  private peerStore: RtkUiStoreExtended | null = null;

  private storeRequestListener: (event: CustomEvent) => void;
  private stateUpdateListener: (event: CustomEvent<States>) => void;

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
  @Prop() config: UIConfig = createDefaultConfig();

  /** Size */
  @Prop({ reflect: true, mutable: true }) size: Size;

  /** Whether to show setup screen or not */
  @Prop() showSetupScreen: boolean = false;

  /**
   * Emits `rtkStatesUpdate` so that developers can listen to onRtkStatesUpdate and update their own stores
   * Do not confuse this with `rtkStateUpdate` that other components emit
   */
  @Event({ eventName: 'rtkStatesUpdate' }) statesUpdate: EventEmitter<States>;

  private authErrorListener: (ev: CustomEvent<Error>) => void;

  private resizeObserver: ResizeObserver;

  connectedCallback() {
    if (typeof window !== 'undefined') {
      this.authErrorListener = (ev) => {
        if (ev.detail.message.includes('401')) {
          this.updateStates({ meeting: 'ended', roomLeftState: 'unauthorized' });
        }
      };
      window.addEventListener('rtkError', this.authErrorListener);
    }

    // Listen for store requests from child components
    this.setupStoreRequestListener();

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

    // Remove event listeners
    if (this.storeRequestListener) {
      this.host.removeEventListener('rtkRequestStore', this.storeRequestListener);
    }
    if (this.stateUpdateListener) {
      this.host.removeEventListener('rtkStateUpdate', this.stateUpdateListener);
    }

    if (!this.meeting) return;
    this.meeting.self.removeListener('roomLeft', this.roomLeftListener);
    this.meeting.self.removeListener('roomJoined', this.roomJoinedListener);
    this.meeting.self.removeListener('waitlisted', this.waitlistedListener);
    this.meeting.self.removeListener('mediaPermissionUpdate', this.mediaPermissionUpdateListener);
    this.meeting.meta.removeListener('socketConnectionUpdate', this.socketConnectionUpdateListener);
  }

  private updateStates(states: Partial<States>) {
    // Use isolated store if available, otherwise fall back to global store
    const targetStore = this.peerStore || legacyGlobalUIStore;
    const newStates = Object.assign({}, targetStore.state.states);
    targetStore.state.states = deepMerge(newStates, states);
    console.log(
      `RtkUiProvider: Updated states in ${
        this.peerStore ? 'isolated' : 'global'
      } store for meeting ${targetStore.state.peerId}`,
      states
    );


    // Emit unscoped event for backward compatibility
    this.statesUpdate.emit(targetStore.state.states);

    // Also emit a scoped event that only this meeting's components should listen to
    const scopedEvent = new CustomEvent('rtkStatesUpdate', {
      detail: targetStore.state.states,
      bubbles: true,
      composed: true,
    });
    this.host.dispatchEvent(scopedEvent);
  }

  private setupStateUpdateListener() {
    // Remove existing listener if any
    if (this.stateUpdateListener) {
      this.host.removeEventListener('rtkStateUpdate', this.stateUpdateListener);
    }

    // Create new listener
    this.stateUpdateListener = (event: CustomEvent<States>) => {
      console.log(
        `Provider ${(this.peerStore || legacyGlobalUIStore).state.peerId} handling state update from ${
          (event.target as HTMLElement).tagName
        }`
      );

      this.updateStates(event.detail);
    };

    // Listen for both generic events (backward compatibility) and peer-specific events
    this.host.addEventListener('rtkStateUpdate', this.stateUpdateListener);
  }

  private setupStoreRequestListener() {
    // Remove existing listener if any
    if (this.storeRequestListener) {
      this.host.removeEventListener('rtkRequestStore', this.storeRequestListener);
    }

    console.log('RtkUiProvider: Setting up store request listener');

    // Listen for store requests from child components
    this.storeRequestListener = (
      event: CustomEvent<{ element: HTMLElement; propName: string; requestId: string }>
    ) => {
      // Provide the actual store object, not a wrapper
      const storeToProvide = this.peerStore || legacyGlobalUIStore;
      console.log(
        'RtkUiProvider: Providing store for',
        event.detail.element.tagName,
        this.peerStore ? '(isolated)' : '(global)',
        'peerId:',
        storeToProvide.state.peerId
      );
      console.log('RtkUiProvider: Store object keys:', Object.keys(storeToProvide));
      console.log(
        'RtkUiProvider: Store has elementsMap:',
        !!(storeToProvide as RtkUiStoreExtended).elementsMap
      );

      const responseEvent = new CustomEvent('rtkProvideStore', {
        detail: { store: storeToProvide, requestId: event.detail.requestId },
      });
      document.dispatchEvent(responseEvent);

      // Stop the event from bubbling further to prevent other providers from handling it
      event.stopPropagation();
    };

    this.host.addEventListener('rtkRequestStore', this.storeRequestListener);
    console.log('RtkUiProvider: Store request listener added to host');
  }

  @Watch('meeting')
  onMeetingChange(meeting: Meeting) {
    console.log('RtkUiProvider: onMeetingChange called with meeting:', meeting?.self?.id);

    if (meeting) {
      this.peerStore = createPeerStore({meeting, config: this.config}) as RtkUiStoreExtended;

      this.peerStore.state.meeting = meeting;
      if (this.config) this.peerStore.state.config = this.config;
      if (this.iconPack) this.peerStore.state.iconPack = this.iconPack;
      if (this.t) this.peerStore.state.t = this.t;
      if (this.size) this.peerStore.state.size = this.size;

      console.log(`RtkUiProvider: Created isolated store for meeting ${meeting.self.id}`);
    } else {
      console.log('RtkUiProvider: No meeting.self.id found, using global store');
      this.peerStore = null;
    }

    // Setup state update listener now that we have peerId
    this.setupStateUpdateListener();

    if (meeting) {
      const targetStore = this.peerStore || legacyGlobalUIStore;
      targetStore.state.meeting = meeting;

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
  }

  @Watch('iconPack')
  onIconPackChange(newIconPack: IconPack) {
    (this.peerStore || legacyGlobalUIStore).state.iconPack = newIconPack;
  }

  @Watch('t')
  onTChange(newT: RtkI18n) {
    if (this.peerStore) {
      this.peerStore.state.t = newT;
    }
    (this.peerStore || legacyGlobalUIStore).state.t = newT;
  }

  @Watch('config')
  onConfigChange(config: UIConfig) {
    if (this.peerStore) {
      this.peerStore.state.config = config;
    }
    (this.peerStore || legacyGlobalUIStore).state.config = config;

    // Apply design system if enabled
    if (config?.designTokens && typeof document !== 'undefined') {
      provideRtkDesignSystem(document.documentElement, config.designTokens);
    }
  }

  @Watch('size')
  onSizeChange(newSize: Size) {
    (this.peerStore || legacyGlobalUIStore).state.size = newSize;
  }

  private handleResize = () => {
    this.size = getSize(this.host.clientWidth);
  };

  private loadTheme = () => {
    const { config } = generateConfig(this.meeting.self.config, this.meeting);
    this.config = config;

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
    if (state === 'disconnected' || state === 'failed') return;
    this.updateStates({ meeting: 'ended', roomLeftState: state });
  };

  private mediaPermissionUpdateListener = ({ kind, message }) => {
    if (['audio', 'video'].includes(kind)) {
      if (
        (message === 'DENIED' || message === 'SYSTEM_DENIED') &&
        (this.peerStore || legacyGlobalUIStore).state.states.activeDebugger !== true
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

  private handleChangingMeeting = (destinationMeetingId: string) => {
    this.updateStates({
      activeBreakoutRoomsManager: {
        ...(this.peerStore || legacyGlobalUIStore)?.state.states.activeBreakoutRoomsManager,
        destinationMeetingId,
      },
    });
  };

  render() {
    // Don't render children until meeting is properly initialized
    if (!this.meeting) {
      return <Host></Host>;
    }

    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
