import React, { Component } from 'react';

import StepsEditorExample from './components/StepsEditorExample';
import TabExample from './components/TabExample';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Reactronica</h1>
        <p>React audio components for making music in the browser.</p>

        <p>
          Check out the repo:
          <br />
          <a href="https://github.com/unkleho/reactronica">
            https://github.com/unkleho/reactronica
          </a>
        </p>

        <br />

        <h2>Examples</h2>

        <h3>Keyboard/Beat Editor</h3>
        <StepsEditorExample />

        <h3>Tablature</h3>
        <TabExample />
      </div>
    );
  }
}
