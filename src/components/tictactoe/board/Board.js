import React from "react";

import { Box } from '../box/Box'
import './Board.css'

export const Board = ({ board, onClick }) => {

    function isBoardFull() {
        return board.every((value) => value !== null);
    }

    return (
        <div className="board">
            {board.map((value, idx) => {
                return <Box key={idx} value={value} onClick={() => (value === null || isBoardFull()) && onClick(idx)} />
            })}
        </div>
    )
}