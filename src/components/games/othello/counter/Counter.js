import React from 'react'

import './Counter.css'

export const Counter = ({ pieces }) => {
    const { black, white } = pieces;
    return (
        <div className='counter'>
            <span className={'black-piece'}></span>
            <span>{black}</span>
            <span> - </span>
            <span>{white}</span>
            <span className={'white-piece'}></span>
        </div>
    )
}