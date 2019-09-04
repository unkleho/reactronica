import React from 'react';
import NextApp from 'next/app';
import { MDXProvider } from '@mdx-js/react';

import DocApp from '../components/DocApp';
import DAWApp from '../components/DAWApp';
import CodeBlock from '../components/CodeBlock';

class MyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props;

    let AppComponent;

    if (router.route === '/daw') {
      AppComponent = DAWApp;
    } else {
      AppComponent = DocApp;
    }

    const components = {
      pre: (props) => <div {...props} />,
      // code: (props) => <pre style={{ color: 'tomato' }} {...props} />,
      code: CodeBlock,
    };

    return (
      <MDXProvider components={components}>
        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </MDXProvider>
    );
  }
}

export default MyApp;
