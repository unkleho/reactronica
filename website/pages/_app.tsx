import React from 'react';
import NextApp from 'next/app';
import Head from 'next/head';
import { MDXProvider } from '@mdx-js/react';

import DocApp from '../components/DocApp';
import DAWApp from '../components/DAWApp';
import CodeBlock from '../components/CodeBlock';

import '../node_modules/normalize.css/normalize.css';
// import '../styles/base.scss';

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
        <Head>
          <link
            href="https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap"
            rel="stylesheet"
          ></link>
        </Head>

        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </MDXProvider>
    );
  }
}

export default MyApp;
