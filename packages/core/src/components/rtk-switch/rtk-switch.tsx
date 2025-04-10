import { Component, Host, h, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { IconPack, defaultIconPack } from '../../lib/icons';
import { SyncWithStore } from '../../utils/sync-with-store';
import { useLanguage, RtkI18n } from '../../lib/lang';

/**
 * A switch component which follows RTK Design System.
 */
@Component({
  tag: 'rtk-switch',
  styleUrl: 'rtk-switch.css',
  shadow: true,
})
export class RtkSwitch {
  /** Whether the switch is enabled/checked */
  @Prop({ mutable: true }) checked: boolean = false;

  /** Whether switch is readonly */
  @Prop() readonly: boolean = false;

  /** Whether switch is readonly */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Event when switch value is changed */
  @Event({ eventName: 'rtkChange', cancelable: false, composed: false })
  onChange: EventEmitter<boolean>;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Language */
  @SyncWithStore()
  @Prop()
  t: RtkI18n = useLanguage();

  connectedCallback() {
    this.checkedChange(this.checked);
  }

  private onClick = () => {
    if (!this.readonly && !this.disabled) {
      this.checked = !this.checked;
    }
  };

  private onKeyPress = (e: KeyboardEvent) => {
    if (this.readonly) return;
    switch (e.key) {
      // Enter or Space
      case 'Enter':
      case ' ':
        this.checked = !this.checked;
        break;
    }
  };

  @Watch('checked')
  checkedChange(checked: boolean) {
    this.checked = checked;
    this.onChange.emit(checked);
  }

  render() {
    return (
      <Host
        role="switch"
        tabIndex={this.disabled && 0}
        aria-readonly={this.readonly}
        aria-checked={this.checked}
        aria-disabled={this.disabled}
        class={{ checked: this.checked }}
        onClick={this.onClick}
        onKeyPress={this.onKeyPress}
      >
        <div class="switch" part="switch"></div>
      </Host>
    );
  }
}
