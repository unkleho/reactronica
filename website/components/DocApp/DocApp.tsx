import * as React from 'react';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';

import css from './DocApp.css';

type Props = {
  className?: string;
};

const DocApp: React.FunctionComponent<Props> = ({ children, className }) => {
  return (
    <App className={[css.docApp, className || ''].join(' ')}>
      <header>
        <div className={css.headerInside}>
          <ReactronicaLogo
            subText="Docs"
            logoClassName={css.logo}
          ></ReactronicaLogo>
        </div>
      </header>

      <main className={css.main}>{children}</main>
    </App>
  );
};

export default DocApp;
