import { newSpecPage } from '@stencil/core/testing';
import { Component, h } from '@stencil/core';
import { TextMessageView } from './TextMessage';

@Component({ tag: 'test-component' })
class TestComponent {}

describe('TextMessageView', () => {
  describe('bold', () => {
    it('should render bold text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="*bold*" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <b>
              bold
            </b>
          </p>
        </p>
      `);
    });
    it('should not render bold empty text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="* *" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            * *
          </p>
        </p>
      `);
    });
  });
  describe('italic', () => {
    it('should render italic text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="_italics_" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <i>
              italics
            </i>
          </p>
        </p>
      `);
    });
    it('should not render italic empty space', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="_ _" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            _ _
          </p>
        </p>
      `);
    });
    it('should not render italic empty text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="__" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            __
          </p>
        </p>
      `);
    });
  });

  describe('strikethrough', () => {
    it('should render striked text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="~striked~" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <s>
              striked
            </s>
          </p>
        </p>
      `);
    });
    it('should not render striked empty text', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="~ ~" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            ~ ~
          </p>
        </p>
      `);
    });
  });
  describe('mixed text', () => {
    it('*bold1 _italics_ bold2*', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="*bold1 _italics_ bold2*" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            *bold1
            <i>
              italics
            </i>
            bold2*
          </p>
        </p>
      `);
    });
    it('*bold _italic_ ~striked~*', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="*bold _italic_ ~striked~*" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            *bold
            <i>
              italic
            </i>
            <s>
              striked
            </s>
            *
          </p>
        </p>
      `);
    });
  });

  describe('link', () => {
    it('should not render link without protocol', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message="www.dyte.io" />;
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            www.dyte.io
          </p>
        </p>
      `);
    });
    it('should render dyte docs link', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView message="https://docs.dyte.io/api#/operations/start-livestreaming" />
          );
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <a class="link" href="https://docs.dyte.io/api#/operations/start-livestreaming" rel="noopener noreferrer" target="_blank">
              https://docs.dyte.io/api#/operations/start-livestreaming
            </a>
          </p>
        </p>
      `);
    });
    it('should render link with underscore in it', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView message="https://docs.google.com/spreadsheets/d/1lMlf1FLAGRPopqNR8cPODfN-_MPr_ec/edit?usp=sharing" />
          );
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <a class="link" href="https://docs.google.com/spreadsheets/d/1lMlf1FLAGRPopqNR8cPODfN-_MPr_ec/edit?usp=sharing" rel="noopener noreferrer" target="_blank">
              https://docs.google.com/spreadsheets/d/1lMlf1FLAGRPopqNR8cPODfN-_MPr_ec/edit?usp=sharing
            </a>
          </p>
        </p>
      `);
    });
    it('should render a LinkedIn link', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView message="https://www.linkedin.com/feed/update/urn:li:activity:7094369763308535808/" />
          );
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <a class="link" href="https://www.linkedin.com/feed/update/urn:li:activity:7094369763308535808/" rel="noopener noreferrer" target="_blank">
              https://www.linkedin.com/feed/update/urn:li:activity:7094369763308535808/
            </a>
          </p>
        </p>
      `);
    });
    it('should render a highlight link', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView message="https://dyte.io/blog/add-transcription-video-calls-aws-transcribe/#:~:text=devised%20an%20AWS%20(-,Amazon%20Web%20Services,-)%20based%20solution%20that" />
          );
        },
      });

      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <a class="link" href="https://dyte.io/blog/add-transcription-video-calls-aws-transcribe/#:~:text=devised%20an%20AWS%20(-,Amazon%20Web%20Services,-)%20based%20solution%20that" rel="noopener noreferrer" target="_blank">
              https://dyte.io/blog/add-transcription-video-calls-aws-transcribe/#:~:text=devised%20an%20AWS%20(-,Amazon%20Web%20Services,-)%20based%20solution%20that
            </a>
          </p>
        </p>
      `);
    });
  });

  describe('block quote', () => {
    it('should render markdown block quote', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView
              message={`> message

  reply`}
            />
          );
        },
      });
      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            <span class="block-quote"></span>
            message
          </p>
          <p></p>
          <p>
            reply
          </p>
        </p>
      `);
    });
    it('should render reply message block quote', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView
              message={`<blockquote>message</blockquote>

  reply`}
            />
          );
        },
      });
      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <blockquote>
            <p>
              message
            </p>
          </blockquote>
          <p>
            reply
          </p>
        </p>
      `);
    });
  });

  describe('code', () => {
    it('should not format code', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return (
            <TextMessageView
              message={`import base64

          sample_string = "secret code"
          sample_string_bytes = sample_string.encode("ascii")

          base64_bytes = base64.b64encode(sample_string_bytes)
          base64_string = base64_bytes.decode("ascii")

          print(f"Encoded string: {base64_string}")`}
            />
          );
        },
      });
      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            import base64
          </p>
          <p></p>
          <p>
            sample_string = "secret code"
          </p>
          <p>
            sample_string_bytes = sample_string.encode("ascii")
          </p>
          <p></p>
          <p>
            base64_bytes = base64.b64encode(sample_string_bytes)
          </p>
          <p>
            base64_string = base64_bytes.decode("ascii")
          </p>
          <p></p>
          <p>
            print(f"Encoded string: {base64_string}")
          </p>
        </p>
      `);
    });
  });
  describe('xss', () => {
    it('should not run javascript', async () => {
      const page = await newSpecPage({
        components: [TestComponent],
        template() {
          return <TextMessageView message={`<img src=x onerror=alert(1) />`} />;
        },
      });
      expect(page.root).toMatchInlineSnapshot(`
        <p>
          <p>
            &lt;img src=x onerror=alert(1) /&gt;
          </p>
        </p>
      `);
    });
  });
});
