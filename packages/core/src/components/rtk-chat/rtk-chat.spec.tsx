import { newSpecPage } from '@stencil/core/testing';
import { RtkChat } from './rtk-chat';

describe('<rtk-chat>', () => {
  it('initializes without a private chat recipient', () => {
    expect(new RtkChat().selectedParticipant).toBeNull();
  });

  it('should contain a chat-addon slot', async () => {
    // newton-school uses chat-addons
    const page = await newSpecPage({
      components: [RtkChat],
      html: `<rtk-chat><div slot="chat-addon">Chat addons</div></rtk-chat>`,
    });
    expect(page.root).toEqualHtml(`
    <rtk-chat>
      <mock:shadow-root></mock:shadow-root>
      <div slot="chat-addon">
        Chat addons
      </div>
    </rtk-chat>
  `);
  });
});
