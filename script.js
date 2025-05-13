const board = Array.from({ length: 9 }, () => Array(9).fill(0));
const grid = document.getElementById("sudoku-grid");

function createGrid() {
  grid.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;
      grid.appendChild(cell);
    }
  }
}

async function startSolving() {
  // Read user input into board
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = document.getElementById(`cell-${r}-${c}`).value;
      board[r][c] = val === '' ? 0 : parseInt(val);
    }
  }

  if (!isInitialBoardValid()) {
    alert("❌ Invalid Sudoku: conflicting numbers detected.");
    return;
  }

  if (!await solveSudoku(0, 0)) {
    alert("❌ No solution exists!");
  } else {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        document.getElementById(`cell-${r}-${c}`).value = board[r][c];
      }
    }
  }
}

function isInitialBoardValid() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0) {
        board[row][col] = 0; // Temporarily clear to validate
        if (!isSafe(row, col, num)) {
          board[row][col] = num; // Restore
          return false;
        }
        board[row][col] = num; // Restore
      }
    }
  }
  return true;
}

async function solveSudoku(row, col) {
  if (row === 9) return true;
  if (col === 9) return solveSudoku(row + 1, 0);
  if (board[row][col] !== 0) return solveSudoku(row, col + 1);

  for (let num = 1; num <= 9; num++) {
    if (isSafe(row, col, num)) {
      board[row][col] = num;
      updateCell(row, col, num);
      await sleep(1);  // Faster animation

      if (await solveSudoku(row, col + 1)) return true;

      board[row][col] = 0;
      updateCell(row, col, '');
      await sleep(1);
    }
  }
  return false;
}

function isSafe(row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[startRow + i][startCol + j] === num)
        return false;
  return true;
}

function updateCell(row, col, value) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  cell.value = value;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearBoard() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      document.getElementById(`cell-${r}-${c}`).value = '';
      board[r][c] = 0;
    }
  }
}

createGrid();
