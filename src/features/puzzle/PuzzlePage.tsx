"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  createDefaultLinks,
  type LinkMode,
  type Move,
  type PuzzleState,
  solveBoundedPuzzle,
} from "@/src/lib/puzzle-solver";
import { PlatePositionPicker } from "./PlatePositionPicker";
import { LinksMatrix } from "./LinksMatrix";
import { SolutionPanel } from "./SolutionPanel";

type SolveResult =
  | {
      status: "idle";
    }
  | {
      status: "solved";
      moves: Move[];
    }
  | {
      status: "none";
    };

function createState(plateCount: number): PuzzleState {
  return {
    plateCount,
    positions: Array.from({ length: plateCount }, () => 4),
    links: createDefaultLinks(plateCount),
  };
}

export function PuzzlePage() {
  const [puzzle, setPuzzle] = useState<PuzzleState>(() => createState(5));
  const [result, setResult] = useState<SolveResult>({ status: "idle" });

  function updatePlateCount(value: number) {
    const nextCount = Math.max(1, Math.min(12, Math.trunc(value || 1)));
    setPuzzle(createState(nextCount));
    setResult({ status: "idle" });
  }

  function updatePosition(index: number, position: number) {
    setPuzzle((current) => ({
      ...current,
      positions: current.positions.map((item, itemIndex) =>
        itemIndex === index ? position : item,
      ),
    }));
    setResult({ status: "idle" });
  }

  function updateLink(controller: number, target: number, mode: LinkMode) {
    if (controller === target) {
      return;
    }

    setPuzzle((current) => ({
      ...current,
      links: current.links.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === colIndex) {
            return "same";
          }

          return rowIndex === controller && colIndex === target ? mode : cell;
        }),
      ),
    }));
    setResult({ status: "idle" });
  }

  function solve() {
    const moves = solveBoundedPuzzle(puzzle.positions, puzzle.links);

    if (moves === null) {
      setResult({ status: "none" });
      return;
    }

    setResult({ status: "solved", moves });
  }

  function reset() {
    setPuzzle(createState(puzzle.plateCount));
    setResult({ status: "idle" });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#171a21]/95 p-3 text-stone-50 shadow-2xl shadow-black/25 sm:flex-row sm:items-end sm:justify-between sm:p-4">
        <label className="grid gap-1 text-xs font-bold uppercase tracking-normal text-[#a9b0bb] sm:w-40">
          Количество пластин
          <input
            type="number"
            min={1}
            max={12}
            value={puzzle.plateCount}
            onChange={(event) => updatePlateCount(Number(event.target.value))}
            className="h-10 w-full rounded-md border border-white/10 bg-[#0f1115] px-3 text-base font-bold text-white outline-none transition focus:border-[#d7b56d] focus:ring-2 focus:ring-[#d7b56d]/20"
          />
        </label>

        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white transition hover:bg-white/[0.08]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Сбросить
        </button>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <section className="flex h-full min-h-[28rem] flex-col rounded-lg border border-white/10 bg-[#171a21] p-3 shadow-xl shadow-black/10 sm:p-4">
        <div className="mb-3 flex h-10 items-center justify-center rounded-md bg-[#101218]">
          <h2 className="text-lg font-black text-white">Пластины</h2>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#101218] p-3 shadow-inner">
          <div className="w-full max-w-md overflow-hidden rounded-md border border-white/10 bg-[#171a21]">
          {puzzle.positions.map((position, index) => (
            <PlatePositionPicker
              key={index}
              plateIndex={index}
              position={position}
              onChange={(nextPosition) => updatePosition(index, nextPosition)}
            />
          ))}
          </div>
        </div>
      </section>

      <section className="flex h-full min-h-[28rem] flex-col rounded-lg border border-white/10 bg-[#171a21] p-3 shadow-xl shadow-black/10 sm:p-4">
        <div className="mb-3 flex h-10 items-center justify-center rounded-md bg-[#101218]">
            <h2 className="text-lg font-black text-white">Связи</h2>
        </div>

        <LinksMatrix links={puzzle.links} onChange={updateLink} />
      </section>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={solve}
          className="inline-flex h-11 min-w-56 items-center justify-center rounded-md bg-[#b43b31] px-8 text-base font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#c9473d]"
        >
          Решить
        </button>
      </div>

      {result.status === "solved" ? (
        <SolutionPanel solved moves={result.moves} />
      ) : null}

      {result.status === "none" ? (
        <SolutionPanel solved={false} moves={[]} />
      ) : null}
    </main>
  );
}
