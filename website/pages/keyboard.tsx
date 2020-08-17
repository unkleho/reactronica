import { Component, Fragment } from 'react';
import Router from 'next/router';
// import withRedux from 'next-redux-wrapper';
// import { bindActionCreators } from 'redux';

import App from '../components/App';
import Keyboard from '../components/Keyboard';
import ButtonList from '../components/ButtonList';
// import { Router } from '../routes';
import music, {
  chordMap,
  getChordsInProgression,
} from '../lib/music-tools/music';
// import { initStore } from '../lib/store';
// import {
// 	updateScale,
// 	updateChord,
// 	updateRole,
// } from '../actions/keyboardActions';
// import { toggleSequence, updateAudioNotes } from '../actions/audioActions';

import css from './keyboard.module.scss';

const scaleTypes = [
  'major', // 'ionian'
  'minor', // 'aeolian'
  'harmonicminor',
  'melodicminor',
  'majorpentatonic',
  'minorpentatonic',
  'blues',
  'flamenco',
];

const chordTypes = [
  'M',
  'm',
  'Maj7',
  'm7',
  '7',
  'M6',
  'm6',
  '6',
  'Msus4',
  '9',
  'M9',
  'm9',
  'o',
];

class HomePage extends Component {
  static getInitialProps(props) {
    const {
      query: { role = 'scale', scaleOrChord = 'c-major' },
      // isServer,
      // store,
      // pathname,
    } = props;

    // store.dispatch(updateRole(role));

    if (role === 'scale') {
      const tonic = decodeURIComponent(scaleOrChord.split('-')[0]);
      const scaleType = scaleOrChord.split('-')[1];

      // store.dispatch(updateScale(tonic, scaleType));

      return {
        tonic,
        scaleType,
        role,
      };
    } else if (role === 'chord') {
      const rootName = decodeURIComponent(scaleOrChord.split('-')[0]);
      const chordType = scaleOrChord.split('-')[1];

      return {
        rootName,
        chordType,
        role,
      };

      // store.dispatch(updateChord(rootName, chordType));
    } else if (role === 'progression') {
      const tonic = decodeURIComponent(scaleOrChord.split('-')[0]);
      const scaleType = scaleOrChord.split('-')[1];

      // Need major | minor check because progressions don't have other scaleTypes yet.
      if (scaleType === 'major' || scaleType === 'minor') {
        // store.dispatch(updateScale(tonic, scaleType));
        return {
          tonic,
          scaleType,
          role,
        };
      } else {
        Router.pushRoute(`/keyboard/progression/${tonic}-major`);
      }
    }

    return {};
  }

  handleScaleTypeClick = (scaleType) => {
    Router.pushRoute(
      `/keyboard/scale/${encodeURIComponent(this.props.tonic)}-${scaleType}`,
    );
  };

  handleChordTypeClick = (rootName, chordType) => {
    Router.pushRoute(
      `/keyboard/chord/${encodeURIComponent(rootName)}-${chordType}`,
    );
  };

  handlePlayClick = () => {
    // Play chord or scale
    if (this.props.role === 'scale') {
      this.props.toggleSequence(); // Rename to togglePlayButton?
    } else if (this.props.role === 'chord') {
      this.props.updateAudioNotes(this.props.keyboardNotes);

      const timeout = setTimeout(() => {
        this.props.updateAudioNotes();
        clearTimeout(timeout);
      }, 300);
    }
  };

  render() {
    const {
      tonic, // Make this a Note type too?
      rootName,
      keyboardNotes,
      selectedNotes, // Scale
      keys = [],
      activeNotes = [],
      scaleType,
      // scaleTypes,
      chordType,
      // chordTypes,
      role,
      audioNotes = [],
      width,
    } = this.props;

    console.log({ tonic, rootName, scaleType, chordType, role });

    return (
      <App>
        {/* <div className="container container--sm"> */}
        <header className={css['keyboard__header']}>
          <div className={css['keyboard__header__content']}>
            {role === 'scale' && (
              <Fragment>
                <h1 className={css['keyboard__header__title']}>
                  <span className={css['keyboard__header__subtitle']}>
                    Scale
                  </span>
                  {tonic} {scaleType}
                </h1>
              </Fragment>
            )}
            {role === 'chord' && (
              <Fragment>
                <h1 className={css['keyboard__header__title']}>
                  <span className={css['keyboard__header__subtitle']}>
                    Chord
                  </span>
                  {rootName} {chordMap[chordType] && chordMap[chordType].name}
                </h1>
              </Fragment>
            )}
            {role === 'progression' && (
              <Fragment>
                <h1 className={css['keyboard__header__title']}>
                  <span className={css['keyboard__header__subtitle']}>
                    Scale
                  </span>
                  {tonic} {scaleType}
                </h1>

                <h1 className={css['keyboard__header__title']}>
                  <span className={css['keyboard__header__subtitle']}>
                    Chord
                  </span>
                  {rootName} {chordMap[chordType].name}
                </h1>
              </Fragment>
            )}
          </div>

          <button
            className={css['play-button']}
            onClick={this.handlePlayClick}
            dangerouslySetInnerHTML={{
              __html: this.props.isPlaying ? '&#9724;' : '&#9654;',
            }}
          />
        </header>

        <Keyboard
          notes={keyboardNotes} // Highlighted Notes
          activeNotes={[...audioNotes, ...activeNotes]}
          selectedNotes={role !== 'chord' && selectedNotes}
          tonic={role === 'chord' ? undefined : tonic}
          rootNoteName={rootName} // Note quite working yet
          startNoteName="C3"
          totalNotes={width > 500 ? 24 : 12}
          onNoteDown={(note) => {
            if (role === 'scale') {
              // Play note
              this.props.updateAudioNotes([note]);
            } else if (role === 'chord' || role === 'progression') {
              // Build Chord and highlight keys
              const chordNotes = music.chord(note.name, chordType);

              this.props.updateAudioNotes(chordNotes);
            }
          }}
          onNoteUp={() => {
            this.props.updateAudioNotes();
          }}
          canNotesWrap={true}
        />
        <br />

        {role !== 'progression' && (
          <Fragment>
            <h2>{role === 'scale' ? 'Tonic Note' : 'Root Note'}</h2>
            <ButtonList
              items={keys.map((key) => ({
                name: key.note[0], // Use 1 for minor keys
                isActive:
                  role === 'scale'
                    ? key.note[0] === tonic || key.note[1] === tonic
                    : `${key.note[0]}3` === rootName ||
                      `${key.note[1]}3` === rootName, // A bit hacky...
                slug: encodeURIComponent(key.note[0]),
                pitch: key.note[0], // TODO: Switch to [1] for minor scale
                onClick: () => {
                  Router.pushRoute(
                    `/keyboard/${role}/${encodeURIComponent(key.note[0])}3-${
                      role === 'scale' ? scaleType : chordType
                    }`,
                  );
                },
                onButtonDown: () => {
                  // Play sound if chord
                  if (role === 'chord') {
                    this.props.updateAudioNotes(
                      music.chord(key.note[0], chordType),
                    );
                  }
                },
                onButtonUp: () => {
                  // Play sound if chord
                  if (role === 'chord') {
                    this.props.updateAudioNotes();
                  }
                },
              }))}
            />
          </Fragment>
        )}

        {role === 'scale' && (
          <Fragment>
            <h2>Scale Types</h2>
            <ButtonList
              items={scaleTypes.map((s) => ({
                name: s,
                isActive: s === scaleType,
                onClick: (item) => this.handleScaleTypeClick(item.name),
              }))}
            />
          </Fragment>
        )}

        {role === 'chord' && (
          <Fragment>
            <h2>Chord Types</h2>
            <ButtonList
              items={chordTypes.map((c) => ({
                name: chordMap[c].name,
                isActive: c === chordType,
                slug: c,
                onClick: (item) =>
                  this.handleChordTypeClick(rootName, item.slug),
              }))}
            />
            {/* <h3>Description</h3>
							<p>{chordMap[chordType].description}</p> */}
          </Fragment>
        )}

        {role === 'progression' && (
          <Fragment>
            {['triad', 'seventh'].map((chordClass) => {
              return (
                <Fragment key={`progression-${chordClass}`}>
                  <h2>{chordClass}s</h2>

                  <ButtonList
                    items={getChordsInProgression(
                      tonic,
                      scaleType,
                      chordClass,
                      3,
                    ).map((c) => {
                      return {
                        name: `${c.name} (${c.roman})`,
                        // Need to take out last number in rootName, eg. C3 to C
                        isActive:
                          c.name === `${rootName.slice(0, -1)}${chordType}`,
                        onButtonDown: () => {
                          // This updates chord, but also clears scale highlights. May need a different level of 'selected' notes in Keyboard.
                          this.props.updateChord(c.root.name, c.chordType);

                          this.props.updateAudioNotes(c.notes);
                        },
                        onButtonUp: () => {
                          this.props.updateAudioNotes();
                        },
                      };
                    })}
                  />
                </Fragment>
              );
            })}
          </Fragment>
        )}
        {/* </div> */}
      </App>
    );
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateScale: bindActionCreators(updateScale, dispatch),
//     updateChord: bindActionCreators(updateChord, dispatch),
//     toggleSequence: bindActionCreators(toggleSequence, dispatch),
//     updateAudioNotes: bindActionCreators(updateAudioNotes, dispatch),
//   };
// };

// export default withRedux(
//   initStore,
//   (state) => ({
//     ...state.app,
//     ...state.keyboard,
//     ...state.audio,
//   }),
//   mapDispatchToProps,
// )(HomePage);

export default HomePage;
