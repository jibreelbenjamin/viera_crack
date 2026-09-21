export const LETTERS = ["A", "B", "C", "D"] as const;
export type Letter = (typeof LETTERS)[number];

export type DirectionItem = {
  id: string;
  type: "direction";
  audio?: string;
};

export type QuestionItem = {
  id: string;
  type: "listening" | "reading";
  part: number;
  number: number;
  question: string;
  options: string[];
  image?: string;
  groupImage?: string;
  audio?: string;
};

export type ExamItem = DirectionItem | QuestionItem;

/** Jawaban peserta: id soal → huruf pilihan. */
export type Answers = Record<string, Letter>;

/** correct/total = jumlah soal; points/maxPoints = nilai berbobot. */
export type Score = { correct: number; total: number; points: number; maxPoints: number };

export type ResultDetail = {
  id: string;
  number: number;
  part: number;
  answer: Letter | null;
  key: Letter;
  weight: number;
  correct: boolean;
};

export type ExamResult = Score & {
  listening: Score;
  reading: Score;
  parts: ({ part: number } & Score)[];
  details: ResultDetail[];
};

export type Participant = {
  std_code: string;
  std_name: string;
};

/** Hasil yang disimpan di localStorage setelah submit. */
export type StoredResult = ExamResult & {
  submittedAt: string;
  timeUsed: number;
  timedOut: boolean;
};

export function isQuestion(item: ExamItem): item is QuestionItem {
  return item.type !== "direction";
}
