const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setMark };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
    let message = "Player 1's turn (X)";
    const playRound = (index) => {
        if (gameOver) {
            console.log("Game over! Reset to play again.");
            return;
        }

        if (Gameboard.setMark(index, currentPlayer.marker)) {
            printBoard();

            if (checkWin(currentPlayer.marker)) {
                console.log(` ${currentPlayer.name} wins!`);
                gameOver = true;
                message = `${currentPlayer.name} wins!`;
                return;
            }

            if (checkTie()) {
                console.log("It's a tie!");
                gameOver = true;
                message = "It's a tie!";
                return;
            }

            switchTurn();
        }
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        message = `${currentPlayer.name}'s turn (${currentPlayer.marker})`;
    };

    const checkWin = (marker) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => Gameboard.getBoard()[index] === marker)
        );
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        message = "Player 1's turn (X)";
        printBoard();
    };
    const getMessage = () => message;
    const printBoard = () => {
        const board = Gameboard.getBoard();
        console.log(`
 ${board[0] || "-"} | ${board[1] || "-"} | ${board[2] || "-"}
---+---+---
 ${board[3] || "-"} | ${board[4] || "-"} | ${board[5] || "-"}
---+---+---
 ${board[6] || "-"} | ${board[7] || "-"} | ${board[8] || "-"}
        `);
    };

    return { playRound, resetGame, printBoard, getMessage };
})();

const displayController = (() => {
    const boardElement = document.getElementById("board");
    const messageElement = document.getElementById("message");

    const render = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });

        messageElement.textContent = GameController.getMessage();
    };

    boardElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            const index = Number(e.target.dataset.index);
            GameController.playRound(index);
            render();
        }
    });

    GameController.resetGame();
    render();
})();
