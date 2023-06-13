import React from 'react'
import './ScoreBoard.css'


export const ScoreBoard = ({ scores }) => {
    const { xScore, oScore, tScore } = scores;
    return (
        <div className='scoreboard'>
            <span className={'score x-score'}>X - {xScore}</span>
            <span className={'score t-score'}>Tie - {tScore}</span>
            <span className={'score o-score'}>O - {oScore}</span>
        </div>
    )
}