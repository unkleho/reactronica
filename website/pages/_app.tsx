import React from 'react';
import NextApp from 'next/app';

import DocApp from '../components/DocApp';
import DAWApp from '../components/DAWApp';

class MyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props;

    let AppComponent;

    if (router.route === '/daw') {
      AppComponent = DAWApp;
    } else {
      AppComponent = DocApp;
    }

    return (
      <AppComponent>
        <Component {...pageProps} />
      </AppComponent>
    );
  }
}

export default MyApp;
