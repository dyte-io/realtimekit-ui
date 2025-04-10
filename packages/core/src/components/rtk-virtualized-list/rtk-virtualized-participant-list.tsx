import { Component, h, Prop, State, Element, Watch } from '@stencil/core';
import { debounce } from 'lodash-es';
import { Peer } from '../..';

@Component({
  tag: 'rtk-virtualized-participant-list',
  styleUrl: 'rtk-virtualized-participant-list.css',
  shadow: false, // No shadow DOM, allowing styles to propagate
})
export class RtkVirtualizedParticipantList {
  /** Items to be virtualized */
  @Prop() items: Peer[] = [];

  /** Function to render each item */
  @Prop() renderItem: (item: Peer, index: number) => HTMLElement;

  /** Height of each item in pixels (assumed fixed) */
  @Prop({ mutable: true }) itemHeight: number = 55; // Mutable so we can update it

  /** Buffer items to render before and after the visible area */
  @Prop() bufferedItemsCount: number = 5;

  /** Element to render if list is empty */
  @Prop() emptyListElement: HTMLElement = null;

  /** The reference to the container element */
  @Element() el!: HTMLRtkVirtualizedParticipantListElement;

  @State() visibleStart: number = 0; // Start of visible items
  @State() visibleEnd: number = 0; // End of visible items

  private containerHeight: number = 0; // Height of the container
  private lastScrollTop: number = 0; // To track and restore scrollTop

  @Watch('items')
  itemsChanged() {
    this.recalculatePositioning();
  }

  componentDidLoad() {
    this.recalculatePositioning();
    // Set up the scroll event listener
    this.el.querySelector('.virtual-list-container').addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.recalculatePositioning);
  }

  private recalculatePositioning = () => {
    // Measure container height and update visible items
    this.updateContainerHeight();

    // Check for the first item height
    requestAnimationFrame(() => {
      this.updateItemHeight();
    });
  };

  componentDidUpdate() {
    // Update item height if it changes
    this.updateItemHeight();
  }

  disconnectedCallback() {
    // Remove event listeners to prevent memory leaks
    this.el.querySelector('.virtual-list-container').removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.recalculatePositioning);
  }

  private updateContainerHeight = () => {
    if (!this.el.querySelector('.virtual-list-container').clientHeight) {
      return;
    }
    // Check for the first item height
    requestAnimationFrame(() => {
      this.updateItemHeight();
    });
    this.containerHeight = this.el.querySelector('.virtual-list-container').clientHeight;
    this.updateVisibleRange();
  };

  private onScroll = debounce(() => {
    const scrollTop = this.el.querySelector('.virtual-list-container').scrollTop;

    if (scrollTop > this.lastScrollTop && this.visibleEnd === this.items.length) {
      return;
    }
    // Track scrollTop for resetting after re-render
    this.lastScrollTop = scrollTop;

    this.updateVisibleRange();
  });

  private updateVisibleRange() {
    // Get the current scroll position
    const scrollTop = this.el.querySelector('.virtual-list-container').scrollTop;

    // Calculate the start and end of visible items based on scroll position and item height
    const startIndex = Math.floor(scrollTop / this.itemHeight);

    // Calculate the number of fully visible items and include an extra one if there's a partially visible one
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);

    // The end index should include the buffer and partially visible item
    const endIndex = Math.min(
      this.items.length,
      startIndex + visibleCount + this.bufferedItemsCount
    );

    // Update the visible range in the component's state
    this.visibleStart = startIndex;
    this.visibleEnd = endIndex;

    // Reset the scroll position to ensure smooth rendering
    this.el.querySelector('.virtual-list-container').scrollTop = this.lastScrollTop;
  }

  private updateItemHeight() {
    // Get the first rendered item
    const firstRenderedItem = this.el.querySelector('.virtual-list-item') as HTMLElement;

    if (firstRenderedItem) {
      // Temporarily remove the height style to let the browser compute natural height
      const originalHeight = firstRenderedItem.style.height;
      firstRenderedItem.style.height = 'auto'; // Let it take natural height

      // Measure the natural height
      const naturalHeight = firstRenderedItem.getBoundingClientRect().height;

      // Reapply the original height (if needed)
      if (originalHeight) {
        firstRenderedItem.style.height = originalHeight;
      }

      // Check if the measured height differs from the current itemHeight
      if (naturalHeight && Math.floor(naturalHeight) !== Math.floor(this.itemHeight)) {
        this.itemHeight = naturalHeight;
      }
    }
  }

  private renderItems() {
    // Slice the items array to only render the visible and buffered items
    const visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);

    // Render each visible item at the correct position using absolute positioning
    return visibleItems.map((item, index) => {
      const itemIndex = this.visibleStart + index;
      return (
        <div
          class="virtual-list-item"
          key={item.id}
          style={{
            position: 'absolute',
            top: `${itemIndex * this.itemHeight}px`,
            height: `${this.itemHeight}px`,
            width: '100%',
          }}
        >
          {this.renderItem(item, itemIndex)}
        </div>
      );
    });
  }

  render() {
    const totalHeight = this.items.length * this.itemHeight; // Total height of the list
    return (
      <div
        class="virtual-list-container"
        style={{
          position: 'relative',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {!this.items?.length ? this.emptyListElement : this.renderItems()}
        </div>
        {/* Padding at bottom to show the last  */}
        <div style={{ height: `${this.itemHeight}px` }}></div>
      </div>
    );
  }
}
