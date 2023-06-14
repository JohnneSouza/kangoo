import React from "react";

import { Square } from '../square/Square'
import './OthelloBoard.css'

export const OthelloBoard = ({ board, onClick }) => {

    function isBoardFull() {
        return board.every((x) => x.every((y) => y !== null));
    }

    return (
        <div className="board">
            {board.map((row, ridx) => row.map((col, cidx) => {
                return <Square key={`${ridx}+${cidx}}`} value={col} onClick={() => (col === null || isBoardFull()) && onClick([ridx, cidx])} />
            }))}
        </div>
    )
}