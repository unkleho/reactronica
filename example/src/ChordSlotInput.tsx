import React, { useState, useEffect } from 'react';

interface ChordSlotInputProps {
  label: string;
  /** The chord symbol for this slot, derived from the sequencer's notes. */
  value: string;
  onCommit: (chordSymbol: string) => void;
  className?: string;
}

/**
 * A chord-symbol text box that's normally a read-out of whatever notes are
 * active in its slot (so toggling steps by hand keeps it in sync), but
 * becomes an editable draft while focused - committed on blur/Enter, at
 * which point it hands the typed symbol back up to be turned into notes.
 *
 * Sized to 108px (4 step buttons at w-6 plus 3 internal 4px gaps) so it lines
 * up with the four-step group it drives on the sequencer below.
 */
function ChordSlotInput({
  label,
  value,
  onCommit,
  className = '',
}: ChordSlotInputProps) {
  const [draft, setDraft] = useState<string | null>(null);

  // Drop any in-progress draft once the derived value moves on - covers both
  // a successful commit (the detected name replaces the raw typed text) and
  // the notes changing from elsewhere (manual step toggles, a new key).
  useEffect(() => {
    setDraft(null);
  }, [value]);

  function commit() {
    if (draft !== null && draft !== value) {
      onCommit(draft);
    }

    setDraft(null);
  }

  return (
    <label className={`flex flex-col gap-1 w-27 shrink-0 ${className}`}>
      <span className="text-[10px] uppercase tracking-wide text-white/40">
        {label}
      </span>
      <input
        type="text"
        value={draft ?? value}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
        className="w-full min-w-0 bg-white/5 rounded px-2 py-1 text-sm"
      />
    </label>
  );
}

export default ChordSlotInput;
