export function getDuration(totalBeats: number, bpm: number): number {
  return (60 / bpm) * totalBeats;
}
