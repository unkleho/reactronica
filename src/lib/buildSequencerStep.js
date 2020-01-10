export default function buildSequencerStep(step, i) {
  if (typeof step === 'string') {
    return {
      notes: [
        {
          name: step,
        },
      ],
      index: i,
    };
  } else if (step && step.note) {
    return {
      notes: [
        {
          name: step.name,
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
            name: s,
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
