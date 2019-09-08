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

          <ion-icon name="logo-github"></ion-icon>
        </div>
      </header>

      <main className={css.main}>{children}</main>

      <footer>By @unkleho</footer>
    </App>
  );
};

export default DocApp;
