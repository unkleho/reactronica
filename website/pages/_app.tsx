import React from 'react';
import NextApp from 'next/app';
import Head from 'next/head';

import '../node_modules/normalize.css/normalize.css';
import '../styles/base.scss';

import '../components/CodeBlock/CodeBlock.scss';

class MyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <>
        <Head>
          <link
            href="https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700,900&display=swap"
            rel="stylesheet"
          />
          {/* <link
            rel="stylesheet"
            type="text/css"
            href="https://rsms.me/inter/inter-ui.css"
          /> */}
          <link
            href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
