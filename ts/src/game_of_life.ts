function neighborCountFor(board: number[][], x: number, y: number): number {
  const
    rows = board.length,
    cols = rows ? board[0].length : 0,
    ymin = y > 0 ? y - 1 : 0,
    ymax = y < (rows - 1) ? y + 1 : y,
    xmin = x > 0 ? x - 1 : 0,
    xmax = x < (cols - 1) ? x + 1 : x;

  let result = 0;
  for (let xpos = xmin; xpos <= xmax; xpos++) {
    for (let ypos = ymin; ypos <= ymax; ypos++) {
      if (ypos === y && xpos === x) {
        continue;
      }
      result += board[ypos][xpos];
    }
  }
  return result;
}

function shouldSurvive(cell, neighbors) {
  return cell && neighbors > 1 && neighbors < 4;
}

function shouldSpawn(cell, neigbors) {
  return cell === 0 && neigbors === 3;
}

function shouldBeAlive(cell, neigbors) {
  return shouldSpawn(cell, neigbors) ||
          shouldSurvive(cell, neigbors);
}

export function tick(board: number[][]): number[][] {
  const result: number[][] = [];
  board.forEach((row, y) => {
    const newRow: number[] = [];
    row.forEach((cell, x) => {
      const neigbors = neighborCountFor(board, x, y);
      newRow.push(shouldBeAlive(cell, neigbors) ? 1 : 0);
    });
    result.push(newRow);
  });
  return result;
}