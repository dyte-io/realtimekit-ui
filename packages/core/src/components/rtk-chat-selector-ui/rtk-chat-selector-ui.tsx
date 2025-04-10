import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../exports';
import { RtkI18n, useLanguage } from '../../lib/lang';
import { Peer } from '../../types/rtk-client';
import { SyncWithStore } from '../../utils/sync-with-store';
import { generateChatGroupKey } from '../../utils/chat';

export type ChatGroup = Pick<Peer, 'userId' | 'name'>;

// NOTE(vaibhavshn): fixes angular output type errors
export type ChatGroupChangedType = ChatGroup | string;

@Component({
  tag: 'rtk-chat-selector-ui',
  styleUrl: 'rtk-chat-selector-ui.css',
  shadow: true,
})
export class RtkChatSelectorUi {
  /** Self User ID */
  @Prop() selfUserId: string;

  /** Selected participant */
  @Prop() selectedGroupId: string;

  /** Unread counts */
  @Prop() unreadCounts: Record<string, number> = {};

  /** Participants */
  @Prop() groups: ChatGroup[] = [];

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  @State() showParticipantsPanel: boolean = false;

  @State() query: string = '';

  /** Event emitted when chat scope is changed */
  @Event({ eventName: 'rtkChatGroupChanged' }) groupChanged: EventEmitter<ChatGroupChangedType>;

  private toggleParticipants() {
    this.showParticipantsPanel = !this.showParticipantsPanel;
  }

  private onScopeClick = (scope: ChatGroup | string) => {
    this.showParticipantsPanel = false;
    this.groupChanged.emit(scope);
  };

  private getGroups() {
    return this.groups.filter((participant) =>
      participant.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }

  private getName() {
    if (!this.selectedGroupId || this.selectedGroupId === 'everyone') {
      return this.t('everyone');
    }

    const group = this.groups.find((g) => g.userId === this.selectedGroupId);
    if (group) {
      return group.name;
    }

    return this.t('everyone');
  }

  render() {
    const unreadCountTotal = Object.keys(this.unreadCounts).reduce((total, key) => {
      return total + this.unreadCounts[key];
    }, 0);

    return (
      <Host>
        <div class="chat-scope-selector">
          {this.showParticipantsPanel && (
            <div class="participants-container">
              <div class="search" part="search">
                <rtk-icon icon={this.iconPack.search} part="search-icon" />
                <input
                  type="search"
                  autocomplete="off"
                  placeholder={this.t('search')}
                  value={this.query}
                  onInput={(e) => {
                    this.query = (e.target as any).value;
                  }}
                  part="search-input"
                />
              </div>
              <ul class="scope-list scrollbar">
                {this.query === '' && (
                  <li class="scope scope-special" onClick={() => this.onScopeClick('everyone')}>
                    <div class="everyone-icon">
                      <rtk-icon icon={this.iconPack.participants} />
                    </div>
                    {this.t('everyone')}
                    {this.unreadCounts['everyone'] > 0 && (
                      <div class="unread-count" part="unread-count">
                        <span>{this.unreadCounts['everyone']}</span>
                      </div>
                    )}
                  </li>
                )}
                {this.getGroups().map((group) => {
                  const count =
                    this.unreadCounts[generateChatGroupKey([this.selfUserId, group.userId])];

                  return (
                    <li class="scope" onClick={() => this.onScopeClick(group)} key={group.userId}>
                      {group.name}
                      {count > 0 && (
                        <div class="unread-count" part="unread-count">
                          <span>{count}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <button onClick={() => this.toggleParticipants()}>
            <span>
              {`${this.t('to')} ${this.getName()}`}
              {'  '}
              {unreadCountTotal > 0 && (
                <div class="unread-count selector">
                  <span>{unreadCountTotal}</span>
                </div>
              )}
            </span>
            <rtk-icon
              icon={
                this.showParticipantsPanel ? this.iconPack.chevron_up : this.iconPack.chevron_down
              }
            />
          </button>
        </div>
      </Host>
    );
  }
}
