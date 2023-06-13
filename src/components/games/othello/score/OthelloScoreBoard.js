import React from 'react'

import './OthelloScoreBoard.css'

export const OthelloScoreBoard = ({ scores }) => {
    const { blackScore, whiteScore, tieScore } = scores;
    return (
        <div className='otello-scoreboard'>
            <span className={'score black-score'}>Black - {blackScore}</span>
            <span className={'score tie-score'}>Tie - {tieScore}</span>
            <span className={'score white-score'}>White - {whiteScore}</span>
        </div>
    )
}