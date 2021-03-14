import * as React from 'react';
import { MDXProvider } from '@mdx-js/react';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';
import CodeBlock from '../CodeBlock';

import css from './DocApp.module.scss';

type Props = {
  className?: string;
};

const DocApp: React.FunctionComponent<Props> = ({ children, className }) => {
  const components = {
    pre: (props) => <div {...props} />,
    // code: (props) => <pre style={{ color: 'tomato' }} {...props} />,
    code: CodeBlock,
  };

  return (
    <MDXProvider components={components}>
      <App className={[css.docApp, className || ''].join(' ')}>
        <header>
          <div className={css.headerInside}>
            <ReactronicaLogo
              // subText="Docs"
              logoClassName={css.logo}
            ></ReactronicaLogo>
            <p>React audio components for making music in the browser</p>

            <div className={css.headerLinks}>
              <a
                href="https://www.github.com/unkleho/reactronica"
                className={css.headerLink}
              >
                <i className="icon ion-logo-github"></i>&nbsp;Github
              </a>{' '}
              | <a href="/#documentation">Documentation</a>
            </div>
          </div>
        </header>

        {/* <DAWBeatTimerRuler /> */}

        <main className={css.main}>{children}</main>

        <footer>
          By <a href="https://twitter.com/unkleho">@unkleho</a>
        </footer>
      </App>
    </MDXProvider>
  );
};

export default DocApp;
