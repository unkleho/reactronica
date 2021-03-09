import * as React from 'react';

import css from './DAWPlayhead.module.scss';

type Props = {
  isPlaying?: boolean;
  bpm: number;
  className?: string;
};

const DAWPlayhead: React.FunctionComponent<Props> = ({
  isPlaying,
  bpm,
  className,
}) => {
  return (
    <div className={[css.dawPlayhead, className || ''].join(' ')}>
      <style jsx>{`
        div {
          animation: playhead ${(8 / bpm) * 60}s infinite linear;
        }

        @keyframes playhead {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(${isPlaying ? `${16 * 32}px` : 0}, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default DAWPlayhead;
