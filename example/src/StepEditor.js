import React from 'react';

// Rename to StepsEditor?
const StepEditor = ({
  activeStepIndex,
  steps,
  editorLength = 8,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  return (
    <div className="step-editor">
      <div className="step-editor__row">
        {[...new Array(1 + editorLength)].map((_, i) => {
          return (
            <div
              className={[
                'step-editor__step',
                activeStepIndex + 1 === i ? 'step-editor__step--is-active' : '',
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
            className={[
              'step-editor__row',
              isAccidental ? 'step-editor__row--is-accidental' : '',
            ].join(' ')}
            key={note}
          >
            {[...new Array(1 + editorLength)].map((_, i) => {
              const index = i - 1;
              const isActive = steps[index] && steps[index].note === note;

              // For the first column, show playable keyboard
              if (i === 0) {
                return (
                  <button
                    className={[
                      'step-editor__step',
                      'step-editor__step--key',
                    ].join(' ')}
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
                    'step-editor__step',
                    isActive ? 'step-editor__step--is-active' : '',
                  ].join(' ')}
                  onClick={() => onStepEditorClick(note, index)}
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
