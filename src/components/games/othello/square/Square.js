import React from "react";

import './Square.css'

export const Square = ({ value, onClick }) => {
    const style = `${value}-piece`
    return (
        <button className='square' onClick={onClick}>
            <div className={style}></div>
        </button>
    )
}