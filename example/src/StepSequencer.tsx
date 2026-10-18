import React from 'react';

interface StepSequencerProps {
  /** One row per lane, one boolean per step. */
  pattern: boolean[][];
  /** Which step is currently playing (highlighted), or null when stopped. */
  currentStepIndex: number | null;
  onToggleStep: (laneIndex: number, stepIndex: number) => void;
  /** React key for a lane's row - notes/sample ids are stable, index isn't. */
  laneKey: (laneIndex: number) => React.Key;
  ariaLabel: (laneIndex: number, stepIndex: number) => string;
  /**
   * The left-hand cell for a lane - a sample picker for a drum-style
   * sequencer, or just the note name for a keyboard-style one. Kept as a
   * render prop so this component stays agnostic to which mode it's in.
   */
  renderLaneLabel: (laneIndex: number) => React.ReactNode;
  /**
   * Whether a lane's note belongs to the current key - dims inactive steps
   * on lanes outside it. Omit for sequencers with no notion of key (e.g. the
   * drum sequencer's sample lanes), which renders every lane at full
   * brightness.
   */
  isLaneInKey?: (laneIndex: number) => boolean;
}

function StepSequencer({
  pattern,
  currentStepIndex,
  onToggleStep,
  laneKey,
  ariaLabel,
  renderLaneLabel,
  isLaneInKey,
}: StepSequencerProps) {
  return (
    <>
      {pattern.map((lane, laneIndex) => {
        const inKey = isLaneInKey ? isLaneInKey(laneIndex) : true;

        return (
          <div key={laneKey(laneIndex)} className="flex items-center gap-3">
            {renderLaneLabel(laneIndex)}
            <div className="flex gap-1">
              {lane.map((active, stepIndex) => (
                <button
                  key={stepIndex}
                  type="button"
                  aria-pressed={active}
                  aria-label={ariaLabel(laneIndex, stepIndex)}
                  onClick={() => onToggleStep(laneIndex, stepIndex)}
                  className={[
                    'w-6 h-6 rounded',
                    active
                      ? 'bg-[#61dafb]'
                      : inKey
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-white/5 hover:bg-white/10',
                    stepIndex === currentStepIndex ? 'ring-2 ring-white' : '',
                    stepIndex !== 0 && stepIndex % 4 === 0 ? 'ml-2' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default StepSequencer;
