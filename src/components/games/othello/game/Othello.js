import React, { useState } from "react";
import { OthelloBoard } from "../board/OthelloBoard";
import { OthelloScoreBoard } from "../score/OthelloScoreBoard";


export default function Othello() {

    const [board, setBoard] = useState(Array(64).fill(null))
    const [blackPlaying, setBlackPlaying] = useState(true);
    const [scores, setScores] = useState({ blackScore: 0, whiteScore: 0, tieScore: 0 })

    const handleSquareClick = (squareIdx) => {
        const updatedBoard = board.map((value, idx) => {
            if (squareIdx === idx) {
                return blackPlaying ? "black" : "white";
            } else {
                return value;
            }
        })

        setScores({ ...scores, blackScore: scores.blackScore + 0 })
        setBlackPlaying(!blackPlaying);
        setBoard(updatedBoard);
    }

    return (
        <div>
            <OthelloScoreBoard scores={scores} />
            <OthelloBoard board={board} onClick={handleSquareClick} />
        </div>
    )
}
