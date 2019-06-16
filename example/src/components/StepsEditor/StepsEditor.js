import React from 'react';

import css from './StepsEditor.module.css';

const StepsEditor = ({
  currentStepIndex,
  defaultSteps = [],
  subdivision = 8,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  const [steps, setSteps] = React.useState(defaultSteps);
  React.useEffect(() => {
    setSteps(defaultSteps);
  }, [defaultSteps]);

  if (steps.length === 0) {
    return null;
  }

  // console.log(steps);

  const handleStepClick = (note, index) => {
    // Append note to stepRow
    const stepRow = [...steps[index], note];
    const shouldRemove =
      stepRow.filter((s) => s.note === note.note).length >= 2;
    const newStepRow = shouldRemove
      ? stepRow.filter((s) => s.note !== note.note)
      : stepRow;

    const newSteps = [...steps];
    newSteps[index] = newStepRow;

    setSteps(newSteps);

    if (typeof onStepEditorClick === 'function') {
      return onStepEditorClick(newSteps, note, index);
    }
  };

  const emptyArray = [...new Array(1 + subdivision)];

  return (
    <div className={css.stepsEditor}>
      <div className={css.row}>
        {emptyArray.map((_, i) => {
          return (
            <div
              className={[
                css.step,
                currentStepIndex + 1 === i ? css.stepIsCurrent : '',
              ].join(' ')}
              key={`header-${i}`}
              data-testid={`header`}
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
      ].map((note, rowIndex) => {
        const isAccidental = note.includes('#');

        return (
          <div
            className={[css.row, isAccidental ? css.rowIsAccidental : ''].join(
              ' ',
            )}
            key={note}
          >
            {emptyArray.map((_, columnIndex) => {
              const index = columnIndex - 1;

              const isCurrent =
                steps[index] &&
                steps[index].findIndex((step) => {
                  return step.note === note;
                }) >= 0;

              const dataTestId = `step-button-${columnIndex - 1}-${rowIndex}${
                isCurrent ? '-current' : ''
              }`;

              // For the first column, show playable keyboard
              if (columnIndex === 0) {
                return (
                  <button
                    className={[css.step, css.stepKey].join(' ')}
                    onMouseDown={() => onKeyboardDown(note)}
                    onMouseUp={() => onKeyboardUp(note)}
                    key={columnIndex}
                    data-testid="keyboard-button"
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
                    handleStepClick({ note, duration: 0.5 }, index);
                  }}
                  key={columnIndex}
                  data-testid={dataTestId}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default StepsEditor;
