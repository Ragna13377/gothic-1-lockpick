"use client";

import { Fragment } from "react";
import type { LinkMode } from "@/src/lib/puzzle-solver";
import { cn } from "@/src/lib/utils";

type LinksMatrixProps = {
  links: LinkMode[][];
  onChange: (controller: number, target: number, mode: LinkMode) => void;
};

const modeLabels: Record<LinkMode, string> = {
  none: "0",
  same: "+",
  opposite: "-",
};

const modeClasses: Record<LinkMode, string> = {
  none: "border-white/10 bg-[#20242d] text-[#7f8794]",
  same: "border-[#45a29e] bg-[#45a29e] text-white",
  opposite: "border-[#b43b31] bg-[#b43b31] text-white",
};

function nextMode(mode: LinkMode): LinkMode {
  if (mode === "none") {
    return "same";
  }

  if (mode === "same") {
    return "opposite";
  }

  return "none";
}

export function LinksMatrix({ links, onChange }: LinksMatrixProps) {
  const plateCount = links.length;

  return (
    <div className="flex flex-1 items-center justify-center rounded-md border border-white/10 bg-[#101218] p-3">
      <div>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${plateCount + 1}, minmax(0, 2.75rem))`,
        }}
      >
        <div className="h-10" />
        {links.map((_, target) => (
          <div
            key={`target-${target}`}
            className="flex h-10 items-center justify-center rounded-md bg-[#20242d] text-sm font-black text-[#d7b56d]"
          >
            {target + 1}
          </div>
        ))}

        {links.map((row, controller) => (
          <Fragment key={`row-${controller}`}>
            <div
              key={`controller-${controller}`}
              className="flex h-10 items-center justify-center rounded-md bg-[#20242d] text-sm font-black text-[#d7b56d] shadow-sm"
            >
              {controller + 1}
            </div>

            {row.map((mode, target) => {
              const diagonal = controller === target;
              const displayMode = diagonal ? "same" : mode;

              return (
                <button
                  key={`${controller}-${target}`}
                  type="button"
                  disabled={diagonal}
                  onClick={() => onChange(controller, target, nextMode(mode))}
                  className={cn(
                    "h-10 rounded-md border text-sm font-black uppercase tracking-normal shadow-sm transition",
                    modeClasses[displayMode],
                    diagonal
                      ? "cursor-not-allowed opacity-75"
                      : "hover:brightness-95 active:scale-[0.98]",
                  )}
                >
                  {modeLabels[displayMode]}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#a9b0bb]">
        <span className="rounded-full border border-white/10 bg-[#20242d] px-3 py-1">
          0 не двигает
        </span>
        <span className="rounded-full border border-[#45a29e]/50 bg-[#45a29e]/20 px-3 py-1 text-white">
          + туда же
        </span>
        <span className="rounded-full border border-[#b43b31]/60 bg-[#b43b31]/10 px-3 py-1 text-[#ff8b82]">
          - против
        </span>
      </div>
      </div>
    </div>
  );
}
