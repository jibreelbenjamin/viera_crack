import type { Metadata } from "next";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { parseOption, PART_LABELS } from "@/lib/config";
import { getAnswerKey } from "@/lib/exam";

export const metadata: Metadata = { title: "Kunci Jawaban" };

export default function AnswerKeyPage() {
  const key = getAnswerKey();
  const parts = [...new Set(key.map((q) => q.part))];
  const maxPoints = key.reduce((sum, q) => sum + q.weight, 0);

  return (
    <>
      <Banner />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-brand">Kunci Jawaban</h1>
              <p className="mt-1 text-sm text-slate-600">
                {key.length} soal · nilai maksimal {maxPoints}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              ← Kembali
            </Link>
          </div>

          <nav aria-label="Pilih part" className="flex flex-wrap gap-2">
            {parts.map((part) => (
              <a
                key={part}
                href={`#part-${part}`}
                className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 hover:bg-sky-100"
              >
                Part {part}
              </a>
            ))}
          </nav>

          {parts.map((part) => {
            const list = key.filter((q) => q.part === part);
            return (
              <section
                key={part}
                id={`part-${part}`}
                className="scroll-mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <h2 className="border-b border-slate-200 bg-slate-50 px-5 py-3 font-semibold">
                  Part {part} — {PART_LABELS[part]}
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({part <= 4 ? "Listening" : "Reading"})
                  </span>
                </h2>
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-500 uppercase">
                    <tr>
                      <th className="w-14 px-5 py-2">No</th>
                      <th className="px-2 py-2">Soal</th>
                      <th className="px-2 py-2">Jawaban</th>
                      <th className="w-16 px-5 py-2 text-right">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.map((q) => {
                      const option = q.options.map(parseOption).find((o) => o.letter === q.answer);
                      const question = q.question.replace(/^\d+\.\s*/, "");
                      return (
                        <tr key={q.id} className="align-top">
                          <td className="px-5 py-2.5 font-semibold tabular-nums">{q.number}</td>
                          <td className="px-2 py-2.5 text-slate-600">{question || "—"}</td>
                          <td className="px-2 py-2.5">
                            <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                              {q.answer}
                            </span>
                            {option?.text}
                          </td>
                          <td className="px-5 py-2.5 text-right tabular-nums">{q.weight}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
