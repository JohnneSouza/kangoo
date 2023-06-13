import React from "react";

import { Box } from '../box/Box'
import './Grid.css'

export const Grid = ({ board, onClick }) => {

    function isBoardFull() {
        return board.every((value) => value !== null);
    }

    return (
        <div className="grid">
            {board.map((value, idx) => {
                return <Box key={idx} value={value} onClick={() => (value === null || isBoardFull()) && onClick(idx)} />
            })}
        </div>
    )
}