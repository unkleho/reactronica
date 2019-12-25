export default function buildSequencerStep(step, i) {
  if (typeof step === 'string') {
    return {
      notes: [
        {
          note: step,
        },
      ],
      index: i,
    };
  } else if (step && step.note) {
    return {
      notes: [
        {
          note: step.note,
          duration: step.duration,
          velocity: step.velocity,
        },
      ],
      index: i,
    };
  } else if (Array.isArray(step)) {
    return {
      notes: step.map((s) => {
        if (typeof s === 'string') {
          return {
            note: s,
          };
        }

        return s;
      }),
      index: i,
    };
  }

  return {
    notes: [],
    index: i,
  };
}
