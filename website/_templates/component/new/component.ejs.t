---
to: components/<%= name %>/<%= name %>.tsx
---
import * as React from 'react';

import css from './<%= name %>.scss';

type Props = {
  className?: string;
};

const <%= name %>: React.FunctionComponent<Props> = ({ className }) => {
  return <div className={[css.<%= h.changeCase.camel(name) %>, className || ''].join(' ')}></div>;
};

export default <%= name %>;
