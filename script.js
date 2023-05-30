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

for (const shipType of SHIPS) {
  placeShipRandomly(shipType);
}

const table = document.createElement("table");

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
      handleCellClick(i, j, cell);
    });

    row.appendChild(cell);
  }

  table.appendChild(row);
}

document.getElementById("game").appendChild(table);

document.body.appendChild(table);

function placeShipRandomly(shipType) {
  let isHorizontal = Math.random() < 0.5;
  let shipLength = shipType.length;
  let shipCoords;

  do {
    let row = Math.floor(Math.random() * ROWS);
    let col = Math.floor(Math.random() * COLS);
    shipCoords = generateShipCoords(row, col, shipLength, isHorizontal);
  } while (!checkShipPlacement(shipCoords));

  for (const [row, col] of shipCoords) {
    board[row][col] = "ship";
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

function checkShipPlacement(shipCoords) {
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

let statusDisplay = null;

function createStatusDisplay() {
  if (!statusDisplay) {
    statusDisplay = document.createElement("div");
    statusDisplay.id = "status-display";
    document.getElementById("game").appendChild(statusDisplay);
  }
}

function updateStatusDisplay(status) {
  if (!statusDisplay) {
    createStatusDisplay();
  }
  statusDisplay.textContent = status;
}

function handleCellClick(row, col, cell) {
  if (board[row][col] === "hit" || board[row][col] === "miss") {
    return;
  }

  if (board[row][col] === "ship") {
    board[row][col] = "hit";
    cell.classList.add("hit");
    cell.textContent = "X";
    updateStatusDisplay("Player " + currentPlayer + " has hit a ship!");
    checkGameOver();
  } else {
    board[row][col] = "miss";
    cell.classList.add("miss");
    cell.textContent = "X";
    updateStatusDisplay("Player " + currentPlayer + " has missed.");

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayCurrentPlayerTurn();
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

displayCurrentPlayerTurn();
