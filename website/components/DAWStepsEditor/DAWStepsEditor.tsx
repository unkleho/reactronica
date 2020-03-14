import React from 'react';
import { StepNoteType } from 'reactronica';

import { midiNotes } from '../../configs/midiConfig';

import css from './DAWStepsEditor.scss';

type Props = {
  clipId?: string;
  clipName?: string;
  currentStepIndex?: number;
  stepIndexOffset?: number;
  steps?: StepNoteType[][];
  // defaultSteps?: StepNoteType[][];
  subdivision?: number;
  startNote?: string;
  endNote?: string;
  disableScrollIntoView?: boolean;
  className?: string;
  onStepEditorClick?: (
    steps: StepNoteType[][],
    stepNote: StepNoteType,
    index: number,
  ) => void;
  onKeyboardDown?: Function;
  onKeyboardUp?: Function;
};

const DAWStepsEditor: React.FC<Props> = ({
  clipId,
  clipName,
  currentStepIndex,
  stepIndexOffset = 0,
  steps = [],
  // defaultSteps = [],
  subdivision = 8,
  startNote = 'C2',
  endNote = 'B4',
  disableScrollIntoView = false,
  className,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  const [localSteps, setLocalSteps] = React.useState([]);
  // const [focusStepNotes, setSelectedStepNotes] = React.useState([]);

  // const [selectedStepIndex, setSelectedStepIndex] = React.useState();
  // const [selectedStepNoteName, setSelectedStepNoteName] = React.useState();

  // --------------------------------------------------------------------------
  // Set up refs for keyboard noteNames
  // Lets us get and set scroll position of stepsRef
  // --------------------------------------------------------------------------

  const keysRef = React.useRef([]);
  const stepsRef = React.useRef(null);

  // --------------------------------------------------------------------------
  // Set up keyboard
  // --------------------------------------------------------------------------

  const startNoteIndex = midiNotes.indexOf(startNote);
  const endNoteIndex = midiNotes.indexOf(endNote);
  const noteNames = midiNotes.slice(startNoteIndex, endNoteIndex + 1);

  React.useEffect(() => {
    keysRef.current = keysRef.current.slice(0, noteNames.length);
  }, [noteNames]);

  // --------------------------------------------------------------------------
  // Assign local steps if clipId changes
  // localSteps are needed for performance. Yhere could be an interaction delay
  // if relying on `steps` prop.
  // --------------------------------------------------------------------------

  React.useEffect(() => {
    setLocalSteps(steps);
  }, [clipId]);

  // --------------------------------------------------------------------------
  // If new clipId, work out highest key and scroll to it
  // --------------------------------------------------------------------------

  React.useEffect(() => {
    const flattenedSteps = [].concat.apply([], steps);

    // Work out highest step for scrollIntoView
    const highestStep = flattenedSteps.reduce((prev, curr) => {
      if (curr) {
        if (prev === null) {
          return curr;
        }

        // Find indexes and compare between previous highest and current
        const currentIndex = noteNames.findIndex((note) => note === curr.name);
        const prevIndex = noteNames.findIndex((note) => note === prev.name);

        if (currentIndex < prevIndex) {
          return curr;
        }

        return prev;
      }

      return prev;
    }, null);

    if (highestStep) {
      const highestStepIndex = noteNames.findIndex(
        (note) => note === highestStep.name,
      );

      const highestKeyRef = keysRef.current[highestStepIndex];
      // console.log(highestStepIndex, highestKeyRef);

      if (highestKeyRef && disableScrollIntoView === false) {
        highestKeyRef.scrollIntoView();
        stepsRef.current.scrollTop = stepsRef.current.scrollTop - 32;
      }
    }
  }, [clipId]);

  if (steps.length === 0) {
    return null;
  }

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleStepClick = (note, index) => {
    const stepNotes = [...(localSteps[index] ? localSteps[index] : []), note];
    const shouldRemove =
      stepNotes.filter((s) => s.name === note.name).length >= 2;
    const newStepNotes = shouldRemove
      ? stepNotes.filter((s) => s.name !== note.name)
      : stepNotes;

    const newSteps = [...localSteps];
    newSteps[index] = newStepNotes;

    setLocalSteps(newSteps);

    if (typeof onStepEditorClick === 'function') {
      return onStepEditorClick(newSteps, note, index);
    }
  };

  // const handleStepFocus = (noteName, index) => {
  //   const stepNotes = localSteps[index] || [];
  //   const newSelectedStepNotes = stepNotes.filter(
  //     (stepNote) => stepNote.name === noteName,
  //   );

  //   if (newSelectedStepNotes.length > 0) {
  //     setSelectedStepNotes(newSelectedStepNotes);
  //   }

  //   if (stepNotes) {
  //     setSelectedStepNoteName(noteName);
  //     setSelectedStepIndex(index);
  //   } else {
  //     setSelectedStepNoteName(null);
  //     setSelectedStepIndex(null);
  //   }
  // };

  // const handleStepDurationChange = (event, focusStepNote, focusIndex) => {
  //   const newDuration = event.target.value;

  //   const newSteps = localSteps.map((stepNotes, index) => {
  //     if (index === focusIndex) {
  //       return stepNotes.map((stepNote) => {
  //         if (stepNote.name === focusStepNote) {
  //           return {
  //             ...stepNote,
  //             duration: newDuration,
  //           };
  //         }

  //         return stepNote;
  //       });
  //     }

  //     return stepNotes;
  //   });

  //   if (typeof onStepEditorClick === 'function') {
  //     return onStepEditorClick(
  //       newSteps,
  //       selectedStepNoteName,
  //       selectedStepIndex,
  //     );
  //   }

  //   // setSteps(newSteps);
  // };

  const emptyArray = [...new Array(1 + subdivision)];

  // const selectedStepNotes = steps[selectedStepIndex];
  // const selectedStepNote =
  //   (selectedStepNotes &&
  //     selectedStepNotes.find(
  //       (stepNote) => stepNote.name === selectedStepNoteName,
  //     )) ||
  //   {};

  // // console.log(selectedStepNotes, selectedStepNoteName);

  // const stepNoteName = selectedStepNoteName;
  // const stepNoteDuration = selectedStepNote.duration;
  // const stepNoteVelocity = selectedStepNote.velocity;

  // console.log(focusStepNotes);

  // In the future, we may allow multiple notes to be focussed,
  // however for now we'll concentrate on just one at a time
  // const focusStepNote = focusStepNotes[0] || [];

  return (
    <div className={[css.stepsEditor, className || ''].join(' ')}>
      {clipName && (
        <div className={css.info}>
          <p>
            {clipName}

            {/* {stepNoteName && <span>{stepNoteName}</span>}{' '}
            {stepNoteDuration && (
              <span>
                <input
                  type="text"
                  value={stepNoteDuration}
                  // onChange={(event) =>
                  //   handleStepDurationChange(
                  //     event,
                  //     focusStepNote,
                  //     selectedStepIndex,
                  //   )
                  // }
                />
              </span>
            )}
            {stepNoteVelocity && <span>{stepNoteVelocity}</span>} */}
          </p>
        </div>
      )}

      <div className={css.steps} ref={stepsRef}>
        {/* --------------------------------------------------------------- */}
        {/* Steps Header */}
        {/* --------------------------------------------------------------- */}

        <div className={[css.row, css.header].join(' ')}>
          {emptyArray.map((_, i) => {
            return (
              <div
                className={[
                  css.step,
                  currentStepIndex + 1 === i + stepIndexOffset
                    ? css.stepIsCurrent
                    : '',
                ].join(' ')}
                key={`header-${i}`}
                data-testid={`header`}
              >
                {i !== 0 && i + stepIndexOffset}
              </div>
            );
          })}
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Keyboard + Steps */}
        {/* --------------------------------------------------------------- */}

        {noteNames.map((noteName, rowIndex) => {
          const isAccidental = noteName.includes('#');

          return (
            <div
              className={[
                css.row,
                isAccidental ? css.rowIsAccidental : '',
              ].join(' ')}
              key={noteName}
            >
              {emptyArray.map((_, columnIndex) => {
                const index = columnIndex - 1;

                const isCurrent =
                  localSteps[index] &&
                  localSteps[index].findIndex((step) => {
                    return step.name === noteName;
                  }) >= 0;

                const dataTestId = `step-button-${columnIndex - 1}-${rowIndex}${
                  isCurrent ? '-current' : ''
                }`;

                // ------------------------------------------------------------
                // Keyboard
                // ------------------------------------------------------------

                if (columnIndex === 0) {
                  return (
                    <button
                      className={[css.step, css.stepKey].join(' ')}
                      onMouseDown={() => {
                        if (typeof onKeyboardDown === 'function') {
                          onKeyboardDown(noteName);
                        }
                      }}
                      onMouseUp={() => {
                        if (typeof onKeyboardUp === 'function') {
                          onKeyboardUp(noteName);
                        }
                      }}
                      key={columnIndex}
                      data-testid="keyboard-button"
                      ref={(el) => (keysRef.current[rowIndex] = el)}
                    >
                      {noteName}
                    </button>
                  );
                }

                // ------------------------------------------------------------
                // Steps
                // ------------------------------------------------------------

                return (
                  <button
                    className={[
                      css.step,
                      isCurrent ? css.stepIsCurrent : '',
                    ].join(' ')}
                    onClick={() => {
                      handleStepClick({ name: noteName, duration: 0.5 }, index);
                    }}
                    // onFocus={() => {
                    //   handleStepFocus(noteName, index);
                    // }}
                    key={columnIndex}
                    data-testid={dataTestId}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DAWStepsEditor;
