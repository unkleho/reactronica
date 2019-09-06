import * as React from 'react';

import css from './ReactronicaLogo.css';

type Props = {
  subText?: string;
  className?: string;
  logoClassName?: string;
};

const ReactronicaLogo: React.FunctionComponent<Props> = ({
  subText,
  className,
  logoClassName,
}) => {
  return (
    <div className={[css.reactronicaLogo, className || ''].join(' ')}>
      <h1 className={[css.logo, logoClassName || ''].join(' ')}>
        <span>Reactronica</span> <span>{subText}</span>
      </h1>
    </div>
  );
};

export default ReactronicaLogo;
