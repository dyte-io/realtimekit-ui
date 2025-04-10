import { h, FunctionalComponent } from '@stencil/core';
import { elapsedDuration, formatDateTime } from '../../../utils/date';
import { formatName, shorten } from '../../../utils/string';

interface Props {
  name: string;
  time: Date;
  now: Date;
}

export const ChatHead: FunctionalComponent<Props> = ({ name, time, now }) => {
  return (
    <div class="head">
      <div class="name">{shorten(formatName(name), 20)}</div>
      <div class="time" title={formatDateTime(time)}>
        {elapsedDuration(time, now)}
      </div>
    </div>
  );
};
