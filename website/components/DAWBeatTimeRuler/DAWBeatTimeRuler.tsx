import * as React from 'react';

import css from './DAWBeatTimeRuler.scss';

type Props = {
  className?: string;
};

const DAWBeatTimeRuler: React.FunctionComponent<Props> = ({ className }) => {
  return (
    <div className={[css.dawBeatTimeRuler, className || ''].join(' ')}>
      {[...Array(9).fill(null)].map((_, i) => {
        return <p key={i}>{i * 4 + 1}</p>;
      })}
    </div>
  );
};

export default DAWBeatTimeRuler;
