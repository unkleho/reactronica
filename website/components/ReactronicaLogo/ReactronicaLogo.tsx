import * as React from 'react';

import css from './ReactronicaLogo.css';

type Props = {
  subText?: string;
  className?: string;
};

const ReactronicaLogo: React.FunctionComponent<Props> = ({
  subText,
  className,
}) => {
  return (
    <div className={[css.reactronicaLogo, className || ''].join(' ')}>
      <h1 className={css.logo}>
        <span>Reactronica</span> <span>{subText}</span>
      </h1>
    </div>
  );
};

export default ReactronicaLogo;
