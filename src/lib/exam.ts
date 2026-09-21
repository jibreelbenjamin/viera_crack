import "server-only";

import raw from "@/data/test.json";
import {
  LETTERS,
  type Answers,
  type ExamItem,
  type ExamResult,
  type Letter,
  type QuestionItem,
} from "./types";

type RawItem = {
  id: string;
  type: string;
  part?: number;
  question?: string;
  options?: string[];
  image?: string;
  groupImage?: string;
  audio?: string;
  answer?: string;
  weight?: number;
};

type KeyedQuestion = QuestionItem & { answer: Letter; weight: number };

const numberOf = (id: string) => Number(id.replace(/\D/g, ""));

const questions: KeyedQuestion[] = (raw as RawItem[])
  .filter((it) => it.type !== "direction")
  .map((it) => ({
    id: it.id,
    type: it.type as QuestionItem["type"],
    part: it.part ?? 0,
    number: numberOf(it.id),
    question: it.question ?? "",
    options: it.options ?? [],
    image: it.image,
    groupImage: it.groupImage,
    audio: it.audio,
    answer: it.answer as Letter,
    weight: it.weight ?? 1,
  }));

const questionById = new Map(questions.map((q) => [q.id, q]));

/**
 * Urutan item tes (direction + soal) untuk dikirim ke browser.
 * Kunci jawaban sengaja tidak ikut — penilaian dilakukan di server.
 */
export function getExamItems(): ExamItem[] {
  return (raw as RawItem[]).map((it): ExamItem => {
    const q = questionById.get(it.id);
    if (!q) return { id: it.id, type: "direction", audio: it.audio };
    return {
      id: q.id,
      type: q.type,
      part: q.part,
      number: q.number,
      question: q.question,
      options: q.options,
      image: q.image,
      groupImage: q.groupImage,
      audio: q.audio,
    };
  });
}

function sanitize(input: unknown): Answers {
  const answers: Answers = {};
  if (!input || typeof input !== "object") return answers;
  for (const [id, value] of Object.entries(input)) {
    if (questionById.has(id) && LETTERS.includes(value as Letter)) {
      answers[id] = value as Letter;
    }
  }
  return answers;
}

export function gradeAnswers(input: unknown): ExamResult {
  const answers = sanitize(input);
  const details = questions.map((q) => {
    const answer = answers[q.id] ?? null;
    return {
      id: q.id,
      number: q.number,
      part: q.part,
      answer,
      key: q.answer,
      weight: q.weight,
      correct: answer === q.answer,
    };
  });

  const tally = (list: typeof details) => ({
    correct: list.filter((d) => d.correct).length,
    total: list.length,
    points: list.reduce((sum, d) => sum + (d.correct ? d.weight : 0), 0),
    maxPoints: list.reduce((sum, d) => sum + d.weight, 0),
  });
  const partNumbers = [...new Set(details.map((d) => d.part))];

  return {
    ...tally(details),
    listening: tally(details.filter((d) => d.part <= 4)),
    reading: tally(details.filter((d) => d.part >= 5)),
    parts: partNumbers.map((part) => ({
      part,
      ...tally(details.filter((d) => d.part === part)),
    })),
    details,
  };
}
