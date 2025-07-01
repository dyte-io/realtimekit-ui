import { Component, Host, h, State, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { createDefaultConfig } from '../../lib/default-ui-config';
import {
  canViewChat,
  canViewParticipants,
  canViewPlugins,
  canViewPolls,
} from '../../utils/sidebar';
import { RtkSidebarTab, RtkSidebarView } from '../rtk-sidebar-ui/rtk-sidebar-ui';
import { SyncWithStore } from '../../utils/sync-with-store';
import { StageStatus } from '@cloudflare/realtimekit';
import { Render } from '../../lib/render';

export type RtkSidebarSection = 'chat' | 'polls' | 'participants' | 'plugins';

/**
 * A component which handles the sidebar and
 * you can customize which sections you want, and which section you want as the default.
 */
@Component({
  tag: 'rtk-sidebar',
  styleUrl: 'rtk-sidebar.css',
  shadow: true,
})
export class RtkSidebar {
  private onStageStatusUpdate: (status: StageStatus) => void;

  /** Enabled sections in sidebar */
  @Prop({ mutable: true }) enabledSections: RtkSidebarTab[] = [];

  /** Default section */
  @Prop() defaultSection: RtkSidebarSection = 'chat';

  /** Meeting object */
  @SyncWithStore()
  @Prop()
  meeting: Meeting;

  /** States object */
  @SyncWithStore()
  @Prop()
  states: States;

  /** Config */
  @SyncWithStore()
  @Prop() config: UIConfig = createDefaultConfig();

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** View type */
  @Prop({ reflect: true }) view: RtkSidebarView = 'sidebar';

  @State() currentTab: RtkSidebarSection = this.defaultSection;

  /** Emits updated state data */
  @Event({ eventName: 'rtkStateUpdate' }) stateUpdate: EventEmitter<States>;

  @State() isFloating: boolean = false;

  @State() enablePinning: boolean = true;

  connectedCallback() {
    console.log('[RtkSidebar] Connected with initial props:', {
      meeting: !!this.meeting,
      states: this.states,
      config: !!this.config,
      iconPack: !!this.iconPack,
      t: !!this.t
    });
    this.viewChanged(this.view);
    this.statesChanged(this.states);
    this.meetingChanged(this.meeting);
    this.isFloating = this.states?.sidebarFloating || false;
  }

  disconnectedCallback() {
    console.log('[RtkSidebar] Component disconnected');
    this.meeting?.stage?.removeListener('stageStatusUpdate', this.onStageStatusUpdate);
    this.onStageStatusUpdate = null;
  }

  componentWillLoad() {
    console.log('[RtkSidebar] Component will load');
  }

  componentDidLoad() {
    console.log('[RtkSidebar] Component did load');
  }

  @Watch('meeting')
  meetingChanged(meeting: Meeting) {
    if(!meeting){
      console.log('[RtkSidebar] Meeting object not found, returning');
      return;
    }
    this.updateEnabledSections(meeting);
    this.onStageStatusUpdate = (_status: StageStatus) => {
      this.updateEnabledSections(this.meeting);
    };

    this.meeting?.stage?.on('stageStatusUpdate', this.onStageStatusUpdate);
  }

  @Watch('currentTab')
  currentTabChanged(newTab: RtkSidebarSection, oldTab: RtkSidebarSection) {
    console.log('[RtkSidebar] currentTab changed from', oldTab, 'to', newTab);
    console.log('[RtkSidebar] This should trigger a render...');
  }

  @Watch('states')
  statesChanged(s?: States) {
    console.log('[RtkSidebar] States changed:', {
      newStates: s,
      activeSidebar: s?.activeSidebar,
      sidebar: s?.sidebar,
      currentTab: this.currentTab
    });
    const states = s;
    if (states?.sidebar) {
      console.log('[RtkSidebar] Setting currentTab to:', states.sidebar);
      this.currentTab = states.sidebar;
      console.log('[RtkSidebar] After setting currentTab, should trigger render. currentTab is now:', this.currentTab);
    }
  }

  @Watch('view')
  viewChanged(view: RtkSidebarView) {
    if (view === 'full-screen') {
      this.enablePinning = false;
    } else {
      this.enablePinning = true;
    }
  }

  private getTabs = () => {
    if (!this.meeting?.self?.config) {
      return this.enabledSections;
    }

    return this.enabledSections.filter(
      (section) => this.meeting.self.config.controlBar.elements[section.id]
    );
  };

  private viewSection(section: RtkSidebarSection) {
    this.currentTab = section;
    this.stateUpdate.emit({ activeSidebar: true, sidebar: this.currentTab });
  }

  private close = () => {
    this.stateUpdate.emit({ activeSidebar: false, sidebar: this.defaultSection });
  };

  private updateEnabledSections(meeting: Meeting = this.meeting) {
    const list: RtkSidebarTab[] = [];
    if (canViewChat(meeting)) {
      list.push({ id: 'chat', name: this.t('chat') });
    }
    if (canViewPolls(meeting)) {
      list.push({ id: 'polls', name: this.t('polls') });
    }
    if (canViewParticipants(meeting)) {
      list.push({ id: 'participants', name: this.t('participants') });
    }
    if (canViewPlugins(meeting)) {
      list.push({ id: 'plugins', name: this.t('plugins') });
    }
    this.enabledSections = list;
  }

  private toggleFloating = () => {
    this.isFloating = !this.isFloating;
  };

  render() {
    if (!this.meeting) {
      console.log('[RtkSidebar] No meeting object found, returning null');
      return null;
    }

    const defaults = {
      meeting: this.meeting,
      config: this.config,
      states: this.states,
      size: this.size,
      t: this.t,
      iconPack: this.iconPack,
    };

    console.log('[RtkSidebar] Render called with:', {
      activeSidebar: defaults.states?.activeSidebar,
      sidebar: defaults.states?.sidebar,
      currentTab: this.currentTab,
      meeting: !!defaults.meeting,
      config: !!defaults.config,
      states: defaults.states
    });

    // NOTE(ishita1805): This makes it easier to use the sidebar component in isolation.
    if (defaults.states?.activeSidebar === false || !this.currentTab) {
      console.log('[RtkSidebar] Returning null because:', {
        activeSidebar: defaults.states?.activeSidebar,
        currentTab: this.currentTab
      });
      return null;
    }

    return (
      <Host class={this.enablePinning ? (this.isFloating ? 'floating' : '') : 'floating'}>
        <rtk-sidebar-ui
          tabs={this.getTabs()}
          currentTab={this.currentTab}
          view={this.view}
          onTabChange={(e) => {
            this.viewSection(e.detail as RtkSidebarSection);
          }}
          onSidebarClose={this.close}
        >
          {this.enablePinning && (
            <div class="pinned-state" slot="pinned-state">
              <rtk-button
                variant="ghost"
                kind="icon"
                onClick={this.toggleFloating}
                aria-label={this.isFloating ? this.t('pin') : this.t('unpin')}
              >
                <rtk-icon icon={this.isFloating ? this.iconPack.pin : this.iconPack.pin_off} />
              </rtk-button>
            </div>
          )}
          {defaults.states.sidebar === 'chat' && (
            (() => {
              console.log('[RtkSidebar] Rendering RtkChat because sidebar === "chat"', {
                sidebar: defaults.states.sidebar,
                defaults: defaults
              });
              return <Render element="rtk-chat" defaults={defaults} props={{ slot: 'chat' }} />;
            })()
          )}
          {defaults.states.sidebar === 'polls' && <rtk-polls {...defaults} slot="polls" />}
          {defaults.states.sidebar === 'participants' && (
            <Render
              element="rtk-participants"
              defaults={defaults}
              props={{ slot: 'participants' }}
            />
          )}
          {defaults.states.sidebar === 'plugins' && <rtk-plugins {...defaults} slot="plugins" />}
        </rtk-sidebar-ui>
      </Host>
    );
  }
}
