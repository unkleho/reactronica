import * as React from 'react';

import '../../node_modules/normalize.css/normalize.css';
import '../../styles/base.css';
import css from './App.css';

type Props = {
  className?: string;
  children?: string | React.ReactNode;
};

const App: React.FunctionComponent<Props> = ({ className, children }) => {
  return <div className={[css.app, className || ''].join(' ')}>{children}</div>;
};

export default App;
