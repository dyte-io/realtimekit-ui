import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  writeTask,
} from '@stencil/core';
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Size } from '../../types/props';
import { Placement } from '../../types/floating-ui';

export type TooltipVariant = 'primary' | 'secondary';
export type TooltipKind = 'inline' | 'block';

/**
 * Tooltip component which follows RTK Design System.
 *
 * @slot - Default slot for trigger
 * @slot tooltip - Slot for content inside the tooltip
 */
@Component({
  tag: 'rtk-tooltip',
  styleUrl: 'rtk-tooltip.css',
  shadow: true,
})
export class RtkMenu {
  private triggerEl: HTMLSpanElement;
  private tooltipEl: HTMLDivElement;
  private arrowEl: HTMLDivElement;

  /** Tooltip label */
  @Prop() label: string = '';

  /** Tooltip variant */
  @Prop({ reflect: true }) variant: TooltipVariant = 'secondary';

  /** Disabled */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Open */
  @Prop({ reflect: true }) open: boolean = false;

  /** Tooltip kind */
  @Prop({ reflect: true }) kind: TooltipKind = 'inline';

  /** Size */
  @Prop({ reflect: true }) size: Size;

  /** Placement of menu */
  @Prop() placement: Placement = 'top';

  /** Delay before showing the tooltip */
  @Prop() delay: number = 0;

  @State() isInFocus: boolean = false;

  /** Event handler called when the open state of the tooltip changes. */
  @Event({ eventName: 'rtkOpenChange' }) openChange: EventEmitter<boolean>;

  componentDidLoad() {
    this.triggerEl.addEventListener('focusin', this.showMenu);
    this.triggerEl.addEventListener('mouseenter', this.showMenu);

    this.triggerEl.addEventListener('focusout', this.hideMenu);
    this.triggerEl.addEventListener('mouseleave', this.hideMenu);

    writeTask(() => {
      this.openChanged(this.open);
    });
  }

  disconnectedCallback() {
    if (!this.triggerEl) return;
    this.triggerEl.removeEventListener('focusin', this.showMenu);
    this.triggerEl.removeEventListener('mouseenter', this.showMenu);

    this.triggerEl.removeEventListener('focusout', this.hideMenu);
    this.triggerEl.removeEventListener('mouseleave', this.hideMenu);
    this.triggerEl = undefined;
  }

  @Watch('open')
  openChanged(open: boolean) {
    if (open) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  private update() {
    computePosition(this.triggerEl, this.tooltipEl, {
      placement: this.placement,
      middleware: [offset(8), flip(), shift({ padding: 5 }), arrow({ element: this.arrowEl })],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(this.tooltipEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(this.arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
    });
  }

  private showMenu = () => {
    if (this.disabled) return;

    this.isInFocus = true;
    setTimeout(() => {
      if (this.isInFocus) {
        this.tooltipEl.style.display = 'block';
        this.update();
        this.openChange.emit(true);
        if (this.size === 'sm') {
          setTimeout(() => {
            if (this.isInFocus) {
              this.hideMenu();
            }
          }, 1000);
        }
      }
    }, this.delay);
  };

  private hideMenu = () => {
    if (this.open || this.disabled) return;

    this.isInFocus = false;
    this.tooltipEl.style.display = 'none';
    this.openChange.emit(false);
  };

  render() {
    return (
      <Host>
        <span part="trigger" id="trigger" ref={(el) => (this.triggerEl = el)}>
          <slot></slot>
        </span>
        <div
          part="tooltip"
          class="tooltip"
          id="tooltip"
          role="tooltip"
          ref={(el) => (this.tooltipEl = el)}
        >
          <div id="arrow" ref={(el) => (this.arrowEl = el)} part="arrow"></div>
          {this.label}
          <slot name="tooltip" />
        </div>
      </Host>
    );
  }
}
