import React from 'react'

import './ResetButton.css'

export const ResetButtonScore = ({ resetScore }) => {
    return (
        <button className='reset-btn' onClick={resetScore}>Reset Score</button>
    )
}