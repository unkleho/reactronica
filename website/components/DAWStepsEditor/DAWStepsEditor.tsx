import React from 'react';
import { StepNoteType } from 'reactronica';
import produce from 'immer';

import { midiNotes } from '../../configs/midiConfig';

import css from './DAWStepsEditor.scss';
import { StepIndexContext } from '../../lib/contexts/StepIndexContext';

type Props = {
  clipId?: string;
  clipName?: string;
  // currentStepIndex?: number;
  stepIndexOffset?: number;
  steps?: StepNoteType[][];
  // defaultSteps?: StepNoteType[][];
  subdivision?: number;
  startNote?: string;
  endNote?: string;
  disableScrollIntoView?: boolean;
  className?: string;
  onStepEditorChange?: (steps: StepNoteType[][]) => void;
  onKeyboardDown?: Function;
  onKeyboardUp?: Function;
};

type State = {
  localSteps: StepNoteType[][];
  selectedStepNoteName: string;
  selectedStepIndex: number;
};

const initialState: State = {
  localSteps: [],
  selectedStepNoteName: null,
  selectedStepIndex: null,
};

const reducer = produce((draft: State, action) => {
  switch (action.type) {
    case types.SET_LOCAL_STEPS: {
      draft.localSteps = action.localSteps;

      break;
    }

    case types.SET_SELECTED_STEP_NOTE: {
      draft.selectedStepNoteName = action.stepNote?.name;
      draft.selectedStepIndex = action.index;

      break;
    }

    case types.SET_SELECTED_STEP_NOTE_DURATION: {
      const { selectedStepIndex, selectedStepNoteName } = draft;

      const stepNotes = draft.localSteps[selectedStepIndex];
      const stepNoteIndex = stepNotes.findIndex((stepNote) => {
        return stepNote.name === selectedStepNoteName;
      });

      stepNotes[stepNoteIndex].duration = action.duration;

      break;
    }

    case types.SET_SELECTED_STEP_NOTE_VELOCITY: {
      const { selectedStepIndex, selectedStepNoteName } = draft;

      const stepNotes = draft.localSteps[selectedStepIndex];
      const stepNoteIndex = stepNotes.findIndex((stepNote) => {
        return stepNote.name === selectedStepNoteName;
      });

      stepNotes[stepNoteIndex].velocity = parseInt(action.velocity);

      break;
    }
  }
});

const types = {
  SET_LOCAL_STEPS: 'SET_LOCAL_STEPS',
  SET_SELECTED_STEP_NOTE: 'SET_SELECTED_STEP_NOTE',
  SET_SELECTED_STEP_NOTE_DURATION: 'SET_SELECTED_STEP_NOTE_DURATION',
  SET_SELECTED_STEP_NOTE_VELOCITY: 'SET_SELECTED_STEP_NOTE_VELOCITY',
};

/**
 * This component directly accesses `currentStepIndex` from StepIndexContext
 * as it changes on every step tick. This bypasses other components, making
 * it better for performance.
 */
const StepsHeader = ({ emptyArray, stepIndexOffset }) => {
  const { currentStepIndex } = React.useContext(StepIndexContext);

  return (
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
  );
};

const DAWStepsEditor: React.FC<Props> = ({
  clipId,
  clipName,
  stepIndexOffset = 0,
  steps = [],
  subdivision = 8,
  startNote = 'C2',
  endNote = 'B4',
  disableScrollIntoView = false,
  className,
  onStepEditorChange,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { localSteps, selectedStepNoteName, selectedStepIndex } = state;

  const selectedStepNote =
    localSteps[selectedStepIndex] &&
    localSteps[selectedStepIndex].find((s) => s.name === selectedStepNoteName);

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
    dispatch({
      type: types.SET_LOCAL_STEPS,
      localSteps: steps,
    });
  }, [clipId]);

  // --------------------------------------------------------------------------
  // Run onStepEditorChange callback whenever localSteps change
  // --------------------------------------------------------------------------

  React.useEffect(() => {
    if (typeof onStepEditorChange === 'function') {
      onStepEditorChange(localSteps);
    }
  }, [JSON.stringify(localSteps)]);

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

  const handleStepClick = (stepNote, index) => {
    const stepNotes = [
      ...(localSteps[index] ? localSteps[index] : []),
      stepNote,
    ];
    const shouldRemove =
      stepNotes.filter((s) => s.name === stepNote.name).length >= 2;
    const newStepNotes = shouldRemove
      ? stepNotes.filter((s) => s.name !== stepNote.name)
      : stepNotes;

    const newSteps = [...localSteps];
    newSteps[index] = newStepNotes;

    dispatch({
      type: types.SET_LOCAL_STEPS,
      localSteps: newSteps,
    });

    dispatch({
      type: types.SET_SELECTED_STEP_NOTE,
      index,
      stepNote,
    });
  };

  const handleStepFocus = (stepNote, index) => {
    dispatch({
      type: types.SET_SELECTED_STEP_NOTE,
      index,
      stepNote,
    });
  };

  const handleStepDurationChange = (event) => {
    dispatch({
      type: types.SET_SELECTED_STEP_NOTE_DURATION,
      duration: event.target.value,
    });
  };

  // const handleStepVelocityChange = (event) => {
  //   dispatch({
  //     type: types.SET_SELECTED_STEP_NOTE_VELOCITY,
  //     velocity: event.target.value,
  //   });
  // };

  const emptyArray = [...new Array(1 + subdivision)];

  return (
    <div className={[css.stepsEditor, className || ''].join(' ')}>
      {clipName && (
        <div className={css.info}>
          <p>
            {clipName}
            {/* Hide this for now, still some performance issues */}
            {false && selectedStepNote && (
              <>
                <span>{selectedStepNoteName}</span>

                <input
                  type="text"
                  value={selectedStepNote?.duration ?? ''}
                  onChange={(event) => handleStepDurationChange(event)}
                />

                {/* <input
                  type="text"
                  value={selectedStepNote?.velocity ?? ''}
                  onChange={(event) => handleStepVelocityChange(event)}
                /> */}
              </>
            )}{' '}
          </p>
        </div>
      )}

      <div className={css.steps} ref={stepsRef}>
        {/* --------------------------------------------------------------- */}
        {/* Steps Header */}
        {/* --------------------------------------------------------------- */}

        <StepsHeader
          emptyArray={emptyArray}
          stepIndexOffset={stepIndexOffset}
        />

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

                const currentStepNote =
                  localSteps[index] &&
                  localSteps[index].find(
                    (stepNote) => stepNote.name === noteName,
                  );

                const isCurrent = Boolean(currentStepNote);

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
                    onFocus={() => {
                      handleStepFocus(currentStepNote, index);
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
    </div>
  );
};

export default DAWStepsEditor;
