import React from 'react'

import './ResetButton.css'

export const ResetButton = ({ resetGame }) => {
    return (
        <button className='reset-btn' onClick={resetGame}>Reset Game</button>
    )
}