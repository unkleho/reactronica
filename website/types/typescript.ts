import { MidiNote } from '../configs/midiConfig';

export type Clip = {
  id: string;
  name: string;
  bars: number;
  notes: TimeNote[];
};

export type Step = {
  name: string;
  duration?: number;
}[];

export interface TimeNote {
  start: string;
  end?: string;
  name: MidiNote;
  duration?: number | string;
  velocity?: number;
}
