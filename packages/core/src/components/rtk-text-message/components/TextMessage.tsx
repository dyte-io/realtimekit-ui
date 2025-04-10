import { h, FunctionalComponent } from '@stencil/core';
import {
  MAX_TEXT_LENGTH,
  Token,
  extractReplyBlock,
  parseRichText,
  stripOutReplyBlock,
} from '../../../utils/chat';

interface Props {
  message: string;
}

const renderLink = (content: string) => {
  return (
    <a class="link" href={content} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
};

const renderBold = (content: Token[] | string) => {
  if (typeof content === 'string') {
    return <b>{content}</b>;
  }
  return <b>{renderTokens(content)}</b>;
};
const renderItalic = (content: Token[] | string) => {
  if (typeof content === 'string') {
    return <i>{content}</i>;
  }
  return <i>{renderTokens(content)}</i>;
};
const renderStrikethrough = (content: Token[] | string) => {
  if (typeof content === 'string') {
    return <s>{content}</s>;
  }
  return <b>{renderTokens(content)}</b>;
};
const renderPlainText = (content: Token[] | string) => {
  if (typeof content === 'string') {
    return content;
  }
  return <p>{renderTokens(content)}</p>;
};

const renderTokens = (tokens: Token[]) => {
  return tokens.map((token) => {
    switch (token.type) {
      case 'a':
        if (typeof token.content === 'string') {
          return renderLink(token.content);
        }
      case 'b':
        return renderBold(token.content);
      case 'i':
        return renderItalic(token.content);
      case 's':
        return renderStrikethrough(token.content);
      case 'q':
        return <span class="block-quote"></span>;
      case 'plain_text':
      default:
        return renderPlainText(token.content);
    }
  });
};

export const TextMessageView: FunctionalComponent<Props> = ({ message }) => {
  const slicedMessage = message.slice(0, MAX_TEXT_LENGTH);
  const withReply = extractReplyBlock(slicedMessage, true);
  const withoutReply = stripOutReplyBlock(slicedMessage);
  return (
    <p>
      {withReply.length !== 0 && (
        <blockquote>
          {withReply.split('\n').map((line) => {
            const tokens = parseRichText(line);
            return <p>{renderTokens(tokens)}</p>;
          })}
        </blockquote>
      )}
      {withoutReply.split('\n').map((line) => {
        const tokens = parseRichText(line);
        return <p>{renderTokens(tokens)}</p>;
      })}
    </p>
  );
};
