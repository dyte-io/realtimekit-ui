import { Component, Host, h, Prop } from '@stencil/core';
import { defaultIconPack, IconPack } from '../../lib/icons';
import { SyncWithStore } from '../../utils/sync-with-store';
import { Size } from '../../types/props';

export type ControlBarVariant = 'button' | 'horizontal';

/**
 * A skeleton component used for composing custom controlbar buttons.
 */
@Component({
  tag: 'rtk-controlbar-button',
  styleUrl: 'rtk-controlbar-button.css',
  shadow: true,
})
export class RtkControlbarButton {
  /** Variant */
  @Prop({ reflect: true }) variant: ControlBarVariant = 'button';

  /** Whether to show warning icon */
  @Prop() showWarning: boolean = false;

  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Label of button */
  @Prop() label: string;

  /** Icon */
  @Prop() icon: string;

  /**
   * Loading state
   * Ignores current icon and shows a spinner if true
   */
  @Prop() isLoading: boolean;

  /** Whether button is disabled */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Icon pack */
  @SyncWithStore()
  @Prop()
  iconPack: IconPack = defaultIconPack;

  /** Whether icon requires brand color */
  @Prop({ reflect: true }) brandIcon = false;

  render() {
    return (
      <Host>
        <button aria-label={this.label} part="button">
          {this.isLoading ? (
            <rtk-spinner id="icon" part="spinner" iconPack={this.iconPack} />
          ) : (
            <rtk-icon id="icon" icon={this.icon} tabIndex={-1} aria-hidden={true} part="icon" />
          )}
          <span class="label" part="label">
            {this.label}
          </span>
          {this.showWarning && (
            <rtk-icon
              id="warning-indicator"
              icon={this.iconPack.warning}
              part="warning-indicator"
            />
          )}
        </button>
      </Host>
    );
  }
}
