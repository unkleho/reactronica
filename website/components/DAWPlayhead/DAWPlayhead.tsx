import * as React from 'react';

import css from './DAWPlayhead.css';

type Props = {
  isPlaying?: boolean;
  tempo: number;
  className?: string;
};

const DAWPlayhead: React.FunctionComponent<Props> = ({
  isPlaying,
  tempo,
  className,
}) => {
  return <div className={[css.dawPlayhead, className || ''].join(' ')} />;
};

export default DAWPlayhead;
