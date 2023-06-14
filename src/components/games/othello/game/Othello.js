import React, { useState } from "react";
import { OthelloBoard } from "../board/OthelloBoard";
import { Counter } from "../counter/Counter";
import { OthelloScoreBoard } from "../score/OthelloScoreBoard";


export default function Othello() {

    let initialBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    initialBoard[3][3] = "white";
    initialBoard[3][4] = "black";
    initialBoard[4][3] = "black";
    initialBoard[4][4] = "white";


    const [board, setBoard] = useState(initialBoard);
    const [pieces, setPieces] = useState({ black: 2, white: 2 });
    const [blackPlaying, setBlackPlaying] = useState(true);
    const [scores, setScores] = useState({ blackScore: 0, whiteScore: 0, tieScore: 0 })
    const [gameOver, setGameOver] = useState(false);

    const handleSquareClick = (squareIdx) => {
        const updatedBoard = board.map((col, colIdx) => {
            return col.map((row, rowIdx) => {
                if (`${[colIdx]},${[rowIdx]}` === `${squareIdx}`) {
                    return blackPlaying ? "black" : "white";
                } else {
                    return row;
                }
            })
        })

        const winner = checkWinner(updatedBoard);
        const tie = checkTie(updatedBoard);

        if (winner) {
            if (winner === "white") {
                let { whiteScore } = scores;
                whiteScore += 1;
                setScores({ ...scores, whiteScore })
            } else {
                let { blackScore } = scores;
                blackScore += 1;
                setScores({ ...scores, blackScore })
            }
        } else if (tie) {
            let { tieScore } = scores;
            tieScore += 1;
            setScores({ ...scores, tieScore })
        }

        updatePieces(updatedBoard);
        setBlackPlaying(!blackPlaying);
        setBoard(updatedBoard);
    }

    const updatePieces = (board) => {
        const black = board.flat().filter((piece) => piece === "black").length;
        const white = board.flat().filter((piece) => piece === "white").length;
        setPieces({ black, white });
    }

    const checkWinner = (board) => {
        // TODO: Check for winner
        if (board[0][0]) {
            setGameOver(true);
            return board[0][0];
        }
    }

    const checkTie = (board) => {
        //TODO: Check for tie
        if (board[7][7]) {
            setGameOver(true);
            return true;
        }
    }

    const resetGame = () => {
        setGameOver(false);
        setBoard(initialBoard);
        setPieces({ black: 2, white: 2 });
        setBlackPlaying(true);
    }

    return (
        <div>
            <OthelloScoreBoard scores={scores} />
            <Counter pieces={pieces} />
            <OthelloBoard board={board} onClick={gameOver ? resetGame : handleSquareClick} />
        </div>
    )
}
