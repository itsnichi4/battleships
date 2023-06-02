const ROWS = 10;
const COLS = 10;
const SHIPS = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];
const SHIP_COLOR = "gray";
const HIT_COLOR = "red";
const MISS_COLOR = "white";

const board = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));
const aiBoard = new Array(ROWS)
  .fill(null)
  .map(() => new Array(COLS).fill(null));

const playerBoard = document.createElement("div");
playerBoard.id = "player-board";
document.getElementById("game").appendChild(playerBoard);

const playerTable = document.createElement("table");
playerBoard.appendChild(playerTable);

for (let i = 0; i < ROWS; i++) {
  const row = document.createElement("tr");

  for (let j = 0; j < COLS; j++) {
    const cell = document.createElement("td");

    switch (board[i][j]) {
      case "ship":
        cell.classList.add("ship");
        break;
      case "hit":
        cell.classList.add("hit");
        break;
      case "miss":
        cell.classList.add("miss");
        break;
      default:
        break;
    }

    cell.addEventListener("click", () => {
      handleCellClick(i, j, cell, board);
    });

    row.appendChild(cell);
  }

  playerTable.appendChild(row);
}

const aiBoardElement = document.createElement("div");
aiBoardElement.id = "ai-board";
document.getElementById("game").appendChild(aiBoardElement);

const aiTable = document.createElement("table");
aiBoardElement.appendChild(aiTable);

for (let i = 0; i < ROWS; i++) {
  const row = document.createElement("tr");

  for (let j = 0; j < COLS; j++) {
    const cell = document.createElement("td");

    switch (aiBoard[i][j]) {
      case "hit":
        cell.classList.add("hit");
        break;
      case "miss":
        cell.classList.add("miss");
        break;
      default:
        break;
    }

    row.appendChild(cell);
  }

  aiTable.appendChild(row);
}

for (const shipType of SHIPS) {
  placeShipRandomly(shipType);
}

function placeShipRandomly(shipType) {
  let isHorizontal = Math.random() < 0.5;
  let shipLength = shipType.length;
  let playerShipCoords, aiShipCoords;

  do {
    let playerRow = Math.floor(Math.random() * ROWS);
    let playerCol = Math.floor(Math.random() * COLS);
    playerShipCoords = generateShipCoords(
      playerRow,
      playerCol,
      shipLength,
      isHorizontal
    );
  } while (!checkShipPlacement(playerShipCoords, board));

  do {
    let aiRow = Math.floor(Math.random() * ROWS);
    let aiCol = Math.floor(Math.random() * COLS);
    aiShipCoords = generateShipCoords(aiRow, aiCol, shipLength, isHorizontal);
  } while (!checkShipPlacement(aiShipCoords, aiBoard));

  for (const [row, col] of playerShipCoords) {
    board[row][col] = "ship";
  }

  for (const [row, col] of aiShipCoords) {
    aiBoard[row][col] = "ship";
  }

  for (const [row, col] of aiShipCoords) {
    const aiCell = aiTable.rows[row].cells[col];
    aiCell.classList.add("ship");
  }
}

function generateShipCoords(row, col, length, isHorizontal) {
  const coords = [];

  for (let i = 0; i < length; i++) {
    coords.push([row, col]);

    if (isHorizontal) {
      col++;
    } else {
      row++;
    }
  }

  return coords;
}

function checkShipPlacement(shipCoords, board) {
  for (const [row, col] of shipCoords) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return false;
    }

    if (board[row][col] === "ship") {
      return false;
    }

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          i < ROWS &&
          j >= 0 &&
          j < COLS &&
          board[i][j] === "ship"
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

function handleCellClick(row, col, cell, board) {
  if (!playerTurn || board[row][col] === "hit" || board[row][col] === "miss") {
    return;
  }

  if (board[row][col] === "ship") {
    board[row][col] = "hit";
    cell.classList.add("hit");
    cell.textContent = "X";
    updateStatusDisplay("Player " + currentPlayer + " has hit a ship!");
    aiBoard[row][col] = "hit";
    checkGameOver();
  } else {
    board[row][col] = "miss";
    cell.classList.add("miss");
    cell.textContent = "X";
    updateStatusDisplay("Player " + currentPlayer + " has missed.");

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayCurrentPlayerTurn();

    playerTurn = false;

    setTimeout(aiTurn, 2000);
  }
}

function checkGameOver() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j] === "ship") {
        return;
      }
    }
  }
  alert("Game Over!");

  playerTurn = false;
}

let currentPlayer = 1;
let currentTurnDisplay = null;

function displayCurrentPlayerTurn() {
  if (!currentTurnDisplay) {
    currentTurnDisplay = document.createElement("div");
    currentTurnDisplay.id = "current-turn";
    document.getElementById("game").appendChild(currentTurnDisplay);
  }

  currentTurnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function aiTurn() {
  let row, col;
  do {
    row = Math.floor(Math.random() * ROWS);
    col = Math.floor(Math.random() * COLS);
  } while (aiBoard[row][col] === "hit" || aiBoard[row][col] === "miss");

  const cell = aiTable.rows[row].cells[col];

  if (aiBoard[row][col] === "ship") {
    aiBoard[row][col] = "hit";
    cell.classList.add("hit");
    cell.textContent = "X";
    updateStatusDisplay("AI has hit a ship!");
    checkGameOver();
    setTimeout(aiTurn, 2000);
  } else {
    aiBoard[row][col] = "miss";
    cell.classList.add("miss");
    cell.textContent = "X";
    updateStatusDisplay("AI has missed.");

    currentPlayer = 1;
    displayCurrentPlayerTurn();

    playerTurn = true;
  }
}

function createStatusDisplay() {
  statusDisplay = document.createElement("div");
  statusDisplay.id = "status-display";
  document.getElementById("game").appendChild(statusDisplay);
}

function updateStatusDisplay(status) {
  let statusDisplay = document.getElementById("status-display");

  if (!statusDisplay) {
    createStatusDisplay();
    statusDisplay = document.getElementById("status-display");
  }

  statusDisplay.textContent = status;
}

function initializeGame() {
  displayCurrentPlayerTurn();
  playerTurn = true;
}

initializeGame();
