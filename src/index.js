import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Contact } from './components/main/contact/Contact';
import { Home } from './components/main/home/Home';

import App from './App';
import { TicTacToe } from './components/games/tictactoe/game/TicTacToe';
import Othello from './components/games/othello/game/Othello';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/tictactoe',
        element: <TicTacToe />
      },
      {
        path: '/othello',
        element: <Othello />
      },
      {
        path: '/contact',
        element: <Contact />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
