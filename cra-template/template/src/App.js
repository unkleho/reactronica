import React from 'react';
import { Song, Track, Instrument } from 'reactronica';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="App">
      <Song isPlaying={isPlaying}>
        <Track steps={['C3', 'E3', 'G3', null]}>
          <Instrument type="synth" />
        </Track>
      </Song>

      <header className="App-header">
        <button
          style={{
            fontSize: '2rem',
          }}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? 'Stop sound' : 'Play sound'}
        </button>

        <br />

        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
