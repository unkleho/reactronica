import React, { useState } from 'react';

const Sequencer = ({
  activeStepIndex,
  steps,
  currentStepsName,
  onSequencerClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  return (
    <div className="app__sequencer">
      <div className="app__sequencer__row">
        {[...new Array(9)].map((_, i) => {
          return (
            <div
              className={[
                'app__sequencer__step',
                activeStepIndex + 1 === i
                  ? 'app__sequencer__step--is-active'
                  : '',
              ].join(' ')}
              key={`header-${i}`}
            >
              {i !== 0 && i}
            </div>
          );
        })}
      </div>

      {['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'].map((note) => {
        return (
          <div className="app__sequencer__row" key={note}>
            {[...new Array(9)].map((_, i) => {
              const index = i - 1;
              const isActive = steps[index] && steps[index].note === note;

              // For the first column, show playable keyboard
              if (i === 0) {
                return (
                  <button
                    className={['app__sequencer__step'].join(' ')}
                    onMouseDown={() => onKeyboardDown(note)}
                    onMouseUp={() => onKeyboardUp(note)}
                  >
                    {note}
                  </button>
                );
              }

              return (
                <button
                  className={[
                    'app__sequencer__step',
                    isActive ? 'app__sequencer__step--is-active' : '',
                  ].join(' ')}
                  onClick={() => {
                    return onSequencerClick(note, index, currentStepsName);
                  }}
                  key={i}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Sequencer;
