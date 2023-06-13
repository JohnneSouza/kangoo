import React from "react";
import { Link } from "react-router-dom";

import './Navbar.css'

export const Navbar = () => {
    return (
        <nav className="navbar">
            <img className="img" src="/favicon.ico" alt="icon"></img>
            <Link className="link" to="/">Home</Link>
            <Link className="link" to="/tictactoe">Tic Tac Toe</Link>
        </nav>
    )
}