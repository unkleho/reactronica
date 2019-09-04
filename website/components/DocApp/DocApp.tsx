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
        <ReactronicaLogo subText="Docs"></ReactronicaLogo>
      </header>

      {children}
    </App>
  );
};

export default DocApp;
