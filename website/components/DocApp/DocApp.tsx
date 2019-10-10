import * as React from 'react';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';

import css from './DocApp.scss';

type Props = {
  className?: string;
};

const DocApp: React.FunctionComponent<Props> = ({ children, className }) => {
  return (
    <App className={[css.docApp, className || ''].join(' ')}>
      <header>
        <div className={css.headerInside}>
          <ReactronicaLogo
            // subText="Docs"
            logoClassName={css.logo}
          ></ReactronicaLogo>
          <p>React audio components for making music in the browser</p>

          <div>
            <a
              href="https://www.github.com/unkleho/reactronica"
              className={css.headerLink}
            >
              <i className="icon ion-logo-github"></i>&nbsp;Github
            </a>
          </div>
        </div>
      </header>

      {/* <DAWBeatTimerRuler /> */}

      <main className={css.main}>{children}</main>

      <footer>
        By <a href="https://twitter.com/unkleho">@unkleho</a>
      </footer>
    </App>
  );
};

export default DocApp;
