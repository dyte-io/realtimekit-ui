import { Component, h, Prop } from '@stencil/core';
import { hasOnlyEmojis } from '../../utils/string';

/**
 * A component which renders a text message from chat.
 */
@Component({
  tag: 'rtk-text-message-view',
  styleUrl: 'rtk-text-message-view.css',
})
export class RtkTextMessageView {
  /** Text message */
  @Prop() text!: string;

  /** Renders text as markdown (default = true) */
  @Prop() isMarkdown: boolean = false;

  render() {
    return (
      <p class={{ text: true, emoji: hasOnlyEmojis(this.text) }}>
        {this.isMarkdown ? <rtk-markdown-view text={this.text} /> : this.text}
      </p>
    );
  }
}
