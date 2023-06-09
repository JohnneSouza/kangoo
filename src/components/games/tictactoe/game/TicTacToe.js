import React, { useState } from "react";
import { Grid } from "../grid/Grid";
import { ResetButtonGame } from "../reset/ResetButtonGame";
import { ResetButtonScore } from "../reset/ResetButtonScore";
import { ScoreBoard } from "../score/ScoreBoard";

export const TicTacToe = () => {

    const win_matrix = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const [board, setBoard] = useState(Array(9).fill(null))
    const [xPlaying, setXplaying] = useState(true);
    const [scores, setScores] = useState({ xScore: 0, oScore: 0, tScore: 0 })
    const [gameOver, setGameOver] = useState(false);

    const handleBoxClick = (boxIdx) => {
        const updatedBoard = board.map((value, idx) => {
            if (boxIdx === idx) {
                return xPlaying ? "X" : "O";
            } else {
                return value;
            }
        })

        const winner = checkWinner(updatedBoard);
        const tie = checkTie(updatedBoard);

        if (winner) {
            if (winner === "O") {
                let { oScore } = scores;
                oScore += 1;
                setScores({ ...scores, oScore })
            } else {
                let { xScore } = scores;
                xScore += 1;
                setScores({ ...scores, xScore })
            }
        } else if (tie) {
            let { tScore } = scores;
            tScore += 1;
            setScores({ ...scores, tScore })
        }

        setXplaying(!xPlaying);
        setBoard(updatedBoard);
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

    const checkTie = (board) => {
        let isTie = board.filter(box => box === null).length === 0;
        if (isTie) {
            setGameOver(true);
        }
        return isTie;
    }

    const resetGame = () => {
        setGameOver(false);
        setBoard(Array(9).fill(null));
    }

    const resetScore = () => {
        setScores({ xScore: 0, oScore: 0, tScore: 0 })
    }

    return (
        <div>
            <ScoreBoard scores={scores} />
            <Grid board={board} onClick={gameOver ? resetGame : handleBoxClick} />
            <ResetButtonGame resetGame={resetGame} />
            <ResetButtonScore resetScore={resetScore} />
        </div>
    )
}