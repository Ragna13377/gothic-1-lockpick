"use client";

import type { Move } from "@/src/lib/puzzle-solver";
import { cn } from "@/src/lib/utils";

type TraceTableProps = {
  moves: Move[];
  trace: number[][];
};

function moveLabel(move: Move) {
  return `${move.plate + 1}${move.direction === "right" ? "R" : "L"}`;
}

export function TraceTable({ moves, trace }: TraceTableProps) {
  if (trace.length === 0) {
    return null;
  }

  const plateCount = trace[0].length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 rounded-l-md bg-[#101218] px-3 py-2 text-left text-white">
              шаг
            </th>
            {Array.from({ length: plateCount }, (_, index) => (
              <th
                key={index}
                className="bg-[#101218] px-3 py-2 text-center text-[#d7b56d] last:rounded-r-md"
              >
                {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trace.map((positions, index) => {
            const final = index === trace.length - 1;
            const label =
              index === 0 ? "старт" : final ? "финал" : moveLabel(moves[index - 1]);

            return (
              <tr key={`${label}-${index}`}>
                <td className="sticky left-0 border-b border-white/10 bg-[#20242d] px-3 py-2 font-bold text-white">
                  {label}
                </td>
                {positions.map((position, plateIndex) => (
                  <td
                    key={plateIndex}
                    className={cn(
                      "border-b border-white/10 bg-[#20242d] px-3 py-2 text-center font-bold",
                      position === 4 ? "text-[#7ad0ca]" : "text-[#ff8b82]",
                    )}
                  >
                    {position}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
