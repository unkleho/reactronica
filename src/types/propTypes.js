import PropTypes from 'prop-types';
import { instruments, effects } from '../config';

export const NoteType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  velocity: PropTypes.number,
  // pitch: PropTypes.string,
  // octave: PropTypes.number,
  // accidental: PropTypes.string,
  // midi: PropTypes.number,
});

export const StepNoteType = PropTypes.shape({
  name: PropTypes.oneOfType([NoteType, PropTypes.string]),
  // position: PropTypes.number,
  duration: PropTypes.number,
  velocity: PropTypes.number,
});

export const StepType = PropTypes.oneOfType([
  StepNoteType,
  PropTypes.arrayOf(StepNoteType),
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.string,
]);

export const InstrumentTypes = PropTypes.oneOf(
  instruments.map((effect) => effect.id),
);

export const EffectTypes = PropTypes.oneOf(effects.map((effect) => effect.id));
