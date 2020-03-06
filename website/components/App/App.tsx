import * as React from 'react';
import Head from 'next/head';

import useAnalytics from '../../lib/hooks/useAnalytics';

import '../../styles/base.scss';
import css from './App.scss';

type Props = {
  className?: string;
  children?: string | React.ReactNode;
};

const App: React.FunctionComponent<Props> = ({ className, children }) => {
  useAnalytics();

  return (
    <div className={[css.app, className || ''].join(' ')}>
      <Head>
        <script src="https://unpkg.com/ionicons@4.2.2/dist/ionicons.js" />
      </Head>

      {children}
    </div>
  );
};

export default App;
