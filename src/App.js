import React, { useState } from "react";

import './App.css';
import { Board } from './components/tictactoe/board/Board';
import { ResetButton } from "./components/tictactoe/reset/ResetButton";
import { ScoreBoard } from "./components/tictactoe/score/ScoreBoard";

function App() {

  const win_matrix = [
    [0, 1, 2],
    [2, 3, 4],
    [3, 4, 5],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const [board, setBoard] = useState(Array(9).fill(null))
  const [xPlaying, setXplaying] = useState(true);
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 })
  const [gameOver, setGameOver] = useState(false);

  const handleBoxClick = (boxIdx) => {
    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying === true ? "X" : "O";
      } else {
        return value;
      }
    })

    const winner = checkWinner(updatedBoard);

    if (winner) {
      if (winner === "o") {
        let { oScore } = scores;
        oScore += 1;
        setScores({ ...scores, oScore })
      } else {
        let { xScore } = scores;
        xScore += 1;
        setScores({ ...scores, xScore })
      }
    }

    setBoard(updatedBoard);
    setXplaying(!xPlaying);

  }

  const checkWinner = (board) => {
    for (let i = 0; i < win_matrix.length; i++) {
      const [x, y, z] = win_matrix[i];
      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        setGameOver(true);
        return board[x];
      }
    }

  }

  const resetGame = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
  }

  return (
    <div className="App">
      <ScoreBoard scores={scores} xPlaying={xPlaying} />
      <Board board={board} onClick={gameOver ? resetGame : handleBoxClick} />
      <ResetButton resetGame={resetGame} />
    </div>
  );
}

export default App;
