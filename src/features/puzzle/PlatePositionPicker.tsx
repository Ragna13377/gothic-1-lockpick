"use client";

import { cn } from "@/src/lib/utils";

type PlatePositionPickerProps = {
  plateIndex: number;
  position: number;
  onChange: (position: number) => void;
};

export function PlatePositionPicker({
  plateIndex,
  position,
  onChange,
}: PlatePositionPickerProps) {
  return (
    <div className="grid grid-cols-[6.25rem_auto] items-center justify-center gap-3 border-b border-white/10 px-3 py-2 last:border-b-0">
      <div className="whitespace-nowrap text-xs font-black uppercase tracking-normal text-[#a9b0bb]">
        Пластина {plateIndex + 1}
      </div>

      <div className="grid grid-cols-7 gap-1.5" role="radiogroup">
        {Array.from({ length: 7 }, (_, index) => {
          const value = index + 1;
          const selected = value === position;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Пластина ${plateIndex + 1}, позиция ${value}`}
              onClick={() => onChange(value)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition sm:h-8 sm:w-8",
                selected
                  ? "border-[#c9473d] bg-[#c9473d] text-white shadow-md shadow-black/20"
                  : "border-white/10 bg-[#20242d] text-[#c5cad3] hover:border-[#45a29e] hover:bg-[#223135]",
              )}
            >
              <span className={selected ? "font-black" : ""}>{value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
