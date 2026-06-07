"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Move } from "@/src/lib/puzzle-solver";

type SolutionPanelProps = {
  solved: boolean;
  moves: Move[];
};

function moveText(move: Move) {
  return `${move.plate + 1} ${move.direction === "right" ? "вправо" : "влево"}`;
}

export function SolutionPanel({ solved, moves }: SolutionPanelProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171a21]/95 p-4 shadow-xl shadow-black/10">
      <div className="mb-4 flex items-center gap-3">
        {solved ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-700" aria-hidden />
        )}
        <h2 className="text-lg font-black text-white">
          {solved ? "Решение найдено" : "Решения нет"}
        </h2>
      </div>

      {solved ? (
        moves.length > 0 ? (
          <ol className="grid max-w-lg gap-2">
            {moves.map((move, index) => (
              <li
                key={`${move.plate}-${move.direction}-${index}`}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-[#20242d] px-3 py-2 text-sm font-bold text-white shadow-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs text-[#a9b0bb]">
                  {index + 1}
                </span>
                <span>{moveText(move)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-md border border-[#45a29e]/50 bg-[#45a29e]/10 px-3 py-2 text-sm font-bold text-[#7ad0ca]">
            Все пластины уже стоят в позиции 4.
          </p>
        )
      ) : (
        <p className="text-sm text-[#a9b0bb]">
          Для текущих начальных позиций и связей система сравнений несовместна.
        </p>
      )}
    </section>
  );
}
