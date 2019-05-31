import React from 'react';

import css from './StepsEditor.module.css';

// Rename to StepsEditor?
const StepEditor = ({
  currentStepIndex,
  steps,
  editorLength = 8,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  return (
    <div className={css.stepsEditor}>
      <div className={css.row}>
        {[...new Array(1 + editorLength)].map((_, i) => {
          return (
            <div
              className={[
                css.step,
                currentStepIndex + 1 === i ? css.stepIsCurrent : '',
              ].join(' ')}
              key={`header-${i}`}
            >
              {i !== 0 && i}
            </div>
          );
        })}
      </div>

      {[
        'C3',
        'C#3',
        'D3',
        'D#3',
        'E3',
        'F3',
        'F#3',
        'G3',
        'G#3',
        'A3',
        'A#3',
        'B3',
      ].map((note) => {
        const isAccidental = note.includes('#');

        return (
          <div
            className={[css.row, isAccidental ? css.rowIsAccidental : ''].join(
              ' ',
            )}
            key={note}
          >
            {[...new Array(1 + editorLength)].map((_, i) => {
              const index = i - 1;
              const isCurrent = steps[index] && steps[index].note === note;

              // For the first column, show playable keyboard
              if (i === 0) {
                return (
                  <button
                    className={[css.step, css.stepKey].join(' ')}
                    onMouseDown={() => onKeyboardDown(note)}
                    onMouseUp={() => onKeyboardUp(note)}
                    key={i}
                  >
                    {note}
                  </button>
                );
              }

              return (
                <button
                  className={[
                    css.step,
                    isCurrent ? css.stepIsCurrent : '',
                  ].join(' ')}
                  onClick={() => {
                    if (typeof onStepEditorClick === 'function') {
                      return onStepEditorClick(note, index);
                    }
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

export default StepEditor;
