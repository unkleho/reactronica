import * as React from 'react';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';
// import DAWBeatTimerRuler from '../DAWBeatTimeRuler';

import css from './DocApp.scss';

type Props = {
  className?: string;
};

const DocApp: React.FunctionComponent<Props> = ({ children, className }) => {
  return (
    <App className={[css.docApp, className || ''].join(' ')}>
      <header>
        {/* <DAWBeatTimerRuler /> */}

        <div className={css.headerInside}>
          <ReactronicaLogo
            subText="Docs"
            logoClassName={css.logo}
          ></ReactronicaLogo>

          <ion-icon name="logo-github"></ion-icon>
        </div>
      </header>

      <main className={css.main}>{children}</main>

      <footer>
        By <a href="https://twitter.com/unkleho">@unkleho</a>
      </footer>
    </App>
  );
};

export default DocApp;
