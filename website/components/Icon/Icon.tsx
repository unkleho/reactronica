import * as React from 'react';

import css from './Icon.scss';

type Props = {
  name: 'add' | 'play' | 'remove' | 'square' | 'trash';
  className?: string;
};

const Icon: React.FunctionComponent<Props> = ({ name, className }) => {
  return (
    <i
      className={[css.icon, 'icon', `ion-md-${name}`, className || ''].join(
        ' ',
      )}
    ></i>
  );
};

export default Icon;
