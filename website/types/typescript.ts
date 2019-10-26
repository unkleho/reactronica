export type Clip = {
  id: string;
  name: string;
  bars: number;
  notes: any[];
};

export type Step = {
  note: string;
  duration: number;
}[];
