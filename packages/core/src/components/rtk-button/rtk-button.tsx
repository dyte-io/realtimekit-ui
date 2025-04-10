import { Size } from '../../types/props';
import { Component, Host, h, Prop } from '@stencil/core';
import { SyncWithStore } from '../../utils/sync-with-store';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export type ButtonKind = 'button' | 'icon' | 'wide';

/**
 * A button that follows RTK Design System.
 *
 * @slot - Default slot
 * @slot start - Content placed to the start of the button, i.e; left.
 * @slot end - Content placed to the end of the button, i.e; right.
 */
@Component({
  tag: 'rtk-button',
  styleUrl: 'rtk-button.css',
  shadow: true,
})
export class RtkButton {
  /** Size */
  @SyncWithStore() @Prop({ reflect: true }) size: Size;

  /** Button variant */
  @Prop({ reflect: true }) variant: ButtonVariant = 'primary';

  /** Button type */
  @Prop({ reflect: true }) kind: ButtonKind = 'button';

  /** Whether to reverse order of children */
  @Prop({ reflect: true }) reverse: boolean = false;

  /** Where the button is disabled or not */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Button type */
  @Prop({ reflect: true }) type: HTMLButtonElement['type'] = 'button';

  render() {
    return (
      <Host>
        <button part="button" type={this.type} disabled={this.disabled}>
          <span class="start">
            <slot name="start" />
          </span>
          <span class="content" part="content">
            <slot />
          </span>
          <span class="end">
            <slot name="end" />
          </span>
        </button>
      </Host>
    );
  }
}
