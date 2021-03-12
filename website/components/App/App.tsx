import * as React from 'react';

import useAnalytics from '../../lib/hooks/useAnalytics';

import css from './App.module.scss';

type Props = {
  className?: string;
  children?: string | React.ReactNode;
};

const App: React.FunctionComponent<Props> = ({ className, children }) => {
  useAnalytics();

  return <div className={[css.app, className || ''].join(' ')}>{children}</div>;
};

export default App;
