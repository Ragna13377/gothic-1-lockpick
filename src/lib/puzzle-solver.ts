export type LinkMode = "none" | "same" | "opposite";

export type PuzzleState = {
  plateCount: number;
  positions: number[];
  links: LinkMode[][];
};

export type Move = {
  plate: number;
  direction: "left" | "right";
};

export function mod(value: number, m = 7): number {
  return ((value % m) + m) % m;
}

export function modeToCoeff(mode: LinkMode): number {
  if (mode === "same") {
    return 1;
  }

  if (mode === "opposite") {
    return 6;
  }

  return 0;
}

export function buildMatrix(links: LinkMode[][]): number[][] {
  const plateCount = links.length;

  return Array.from({ length: plateCount }, (_, target) =>
    Array.from({ length: plateCount }, (_, controller) => {
      if (target === controller) {
        return 1;
      }

      return modeToCoeff(links[controller]?.[target] ?? "none");
    }),
  );
}

export function buildTargetDelta(positions: number[]): number[] {
  return positions.map((position) => mod(4 - position, 7));
}

function inverseMod(value: number, modBase: number): number {
  const normalized = mod(value, modBase);

  for (let candidate = 1; candidate < modBase; candidate += 1) {
    if (mod(normalized * candidate, modBase) === 1) {
      return candidate;
    }
  }

  throw new Error(`No modular inverse for ${value} under modulo ${modBase}`);
}

export function solveModLinearSystem(
  A: number[][],
  b: number[],
  modBase = 7,
): number[] | null {
  const rows = A.length;
  const cols = A[0]?.length ?? 0;
  const matrix = A.map((row, rowIndex) => [
    ...row.map((value) => mod(value, modBase)),
    mod(b[rowIndex] ?? 0, modBase),
  ]);

  const pivotColumns: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < cols && pivotRow < rows; col += 1) {
    const selectedRow = matrix.findIndex(
      (row, rowIndex) => rowIndex >= pivotRow && row[col] !== 0,
    );

    if (selectedRow === -1) {
      continue;
    }

    [matrix[pivotRow], matrix[selectedRow]] = [
      matrix[selectedRow],
      matrix[pivotRow],
    ];

    const inverse = inverseMod(matrix[pivotRow][col], modBase);
    matrix[pivotRow] = matrix[pivotRow].map((value) =>
      mod(value * inverse, modBase),
    );

    for (let row = 0; row < rows; row += 1) {
      if (row === pivotRow || matrix[row][col] === 0) {
        continue;
      }

      const factor = matrix[row][col];
      matrix[row] = matrix[row].map((value, index) =>
        mod(value - factor * matrix[pivotRow][index], modBase),
      );
    }

    pivotColumns[pivotRow] = col;
    pivotRow += 1;
  }

  const inconsistent = matrix.some((row) => {
    const allCoefficientsZero = row
      .slice(0, cols)
      .every((value) => mod(value, modBase) === 0);

    return allCoefficientsZero && mod(row[cols], modBase) !== 0;
  });

  if (inconsistent) {
    return null;
  }

  const solution = Array.from({ length: cols }, () => 0);

  for (let row = 0; row < pivotColumns.length; row += 1) {
    const col = pivotColumns[row];

    if (col !== undefined) {
      solution[col] = mod(matrix[row][cols], modBase);
    }
  }

  return solution;
}

export function solutionToMoves(solution: number[]): Move[] {
  const moves: Move[] = [];

  solution.forEach((count, index) => {
    const normalized = mod(count, 7);

    if (normalized === 0) {
      return;
    }

    if (normalized <= 3) {
      for (let moveIndex = 0; moveIndex < normalized; moveIndex += 1) {
        moves.push({ plate: index, direction: "right" });
      }

      return;
    }

    for (let moveIndex = 0; moveIndex < 7 - normalized; moveIndex += 1) {
      moves.push({ plate: index, direction: "left" });
    }
  });

  return moves;
}

export function applyMove(
  positions: number[],
  links: LinkMode[][],
  move: Move,
): number[] {
  return positions.map((position, target) => {
    const mode = target === move.plate ? "same" : links[move.plate]?.[target] ?? "none";
    const rightDelta = modeToCoeff(mode);
    const signedDelta =
      move.direction === "right" ? rightDelta : mod(-rightDelta, 7);

    return mod(position - 1 + signedDelta, 7) + 1;
  });
}

function modeToSignedCoeff(mode: LinkMode): number {
  if (mode === "same") {
    return 1;
  }

  if (mode === "opposite") {
    return -1;
  }

  return 0;
}

export function applyBoundedMove(
  positions: number[],
  links: LinkMode[][],
  move: Move,
): number[] | null {
  const directionSign = move.direction === "right" ? 1 : -1;
  const next = positions.map((position, target) => {
    const mode =
      target === move.plate ? "same" : links[move.plate]?.[target] ?? "none";

    return position + modeToSignedCoeff(mode) * directionSign;
  });

  if (next.some((position) => position < 1 || position > 7)) {
    return null;
  }

  return next;
}

function stateKey(positions: number[]): string {
  return positions.join(",");
}

export function solveBoundedPuzzle(
  positions: number[],
  links: LinkMode[][],
  target = 4,
): Move[] | null {
  const goal = Array.from({ length: positions.length }, () => target);
  const startKey = stateKey(positions);
  const goalKey = stateKey(goal);

  if (startKey === goalKey) {
    return [];
  }

  const queue: number[][] = [positions];
  const previous = new Map<string, string | null>([[startKey, null]]);
  const previousMove = new Map<string, Move>();

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const state = queue[cursor];

    for (let plate = 0; plate < positions.length; plate += 1) {
      for (const direction of ["right", "left"] as const) {
        const move: Move = { plate, direction };
        const next = applyBoundedMove(state, links, move);

        if (next === null) {
          continue;
        }

        const key = stateKey(next);

        if (previous.has(key)) {
          continue;
        }

        previous.set(key, stateKey(state));
        previousMove.set(key, move);

        if (key === goalKey) {
          const moves: Move[] = [];
          let currentKey = key;

          while (previous.get(currentKey) !== null) {
            const storedMove = previousMove.get(currentKey);

            if (storedMove === undefined) {
              return null;
            }

            moves.push(storedMove);
            currentKey = previous.get(currentKey) ?? startKey;
          }

          return moves.reverse();
        }

        queue.push(next);
      }
    }
  }

  return null;
}

export function buildTrace(
  initialPositions: number[],
  links: LinkMode[][],
  moves: Move[],
): number[][] {
  return moves.reduce<number[][]>(
    (trace, move) => [...trace, applyMove(trace[trace.length - 1], links, move)],
    [initialPositions],
  );
}

export function createDefaultLinks(plateCount: number): LinkMode[][] {
  return Array.from({ length: plateCount }, (_, row) =>
    Array.from({ length: plateCount }, (_, col) =>
      row === col ? "same" : "none",
    ),
  );
}

export function createExampleState(): PuzzleState {
  const plateCount = 5;
  const links = createDefaultLinks(plateCount);

  links[0][1] = "opposite";
  links[0][2] = "same";
  links[0][3] = "same";
  links[1][3] = "same";
  links[2][3] = "opposite";
  links[3][0] = "same";
  links[3][1] = "same";
  links[3][4] = "same";

  return {
    plateCount,
    positions: [4, 4, 1, 4, 7],
    links,
  };
}
