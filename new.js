const Player = (sign) => {
  function getPlayerSign() {
    return sign;
  }

  return { getPlayerSign };
};

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  function getBoard() {
    return board;
  }

  function getBoardField(field) {
    if (field >= 0 && field < board.length) {
      return board[field];
    }
    return null;
  }

  function setBoardField(sign, index) {
    board[index] = sign;
  }

  function resetBoardFields() {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  }

  return { getBoard, getBoardField, setBoardField, resetBoardFields };
})();

const displayController = (() => {
  const boardGrid = document.querySelectorAll('.box');
  const resetButton = document.getElementById('reset-button');
  const displayPlayer = document.getElementById('players-turn');

  boardGrid.forEach((grid) => {
    grid.addEventListener('click', () => {
      const gridIndex = Number(grid.dataset.value);
      console.log(gridIndex);
      if (
        gameBoard.getBoardField(gridIndex) !== '' ||
        gameController.gameOver()
      )
        return;
      gameController.playRound(gridIndex);
      updateGameBoard();
    });
  });

  resetButton.addEventListener('click', resetGame);

  function resetGame() {
    gameController.reset();
    updateGameBoard();
    setMessageElement(`Player X's Turn`);
  }

  function updateGameBoard() {
    for (let i = 0; i < boardGrid.length; i++) {
      boardGrid[i].textContent = gameBoard.getBoardField(i);
    }
  }

  function setWinnerMessage(result) {
    if (result === 'Draw') {
      setMessageElement(`It's a Draw`);
    } else {
      setMessageElement(`Player ${result}'s WINS!`);
    }
  }

  function setMessageElement(message) {
    displayPlayer.textContent = message;
  }

  return { setWinnerMessage, setMessageElement };
})();

const gameController = (() => {
  const playerOne = Player('X');
  const playerTwo = Player('O');
  let round = 1;
  let isOver = false;

  function playRound(index) {
    const currentPlayer = getTurn();
    gameBoard.setBoardField(currentPlayer, index);
    if (winnerController.checkWinner(index, currentPlayer)) {
      displayController.setWinnerMessage(currentPlayer);
      isOver = true;
      return;
    }

    if (round >= 9) {
      displayController.setWinnerMessage('Draw');
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(`Player ${getTurn()}'s Turn`);
  }

  function getTurn() {
    return round % 2 === 1
      ? playerOne.getPlayerSign()
      : playerTwo.getPlayerSign();
  }

  function reset() {
    gameBoard.resetBoardFields();
    round = 1;
    isOver = false;
  }

  function gameOver() {
    return isOver;
  }

  return { getTurn, playRound, gameOver, reset };
})();

const winnerController = (() => {
  const winnerSlots = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  function checkWinner(index, currentPlayer) {
    return winnerSlots
      .filter((possibleCombination) => possibleCombination.includes(index))
      .some((possibleWinnerSlot) =>
        possibleWinnerSlot.every(
          (slotIndex) => gameBoard.getBoardField(slotIndex) === currentPlayer
        )
      );
  }

  return { checkWinner };
})();
