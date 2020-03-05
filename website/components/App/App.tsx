import * as React from 'react';
import Head from 'next/head';

import useAnalytics from '../../lib/hooks/useAnalytics';

import '../../node_modules/normalize.css/normalize.css';
import './tailwind.css';
import '../../styles/base.css';
import css from './App.css';

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

      <div className="bg-yellow-500">test</div>

      {children}
    </div>
  );
};

export default App;
