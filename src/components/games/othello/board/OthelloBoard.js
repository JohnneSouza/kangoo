import React from "react";

import { Square } from '../square/Square'
import './OthelloBoard.css'

export const OthelloBoard = ({ board, onClick }) => {

    function isBoardFull() {
        return board.every((value) => value !== null);
    }

    return (
        <div className="board">
            {board.map((value, idx) => {
                return <Square key={idx} value={value} onClick={() => (value === null || isBoardFull()) && onClick(idx)} />
            })}
        </div>
    )
}