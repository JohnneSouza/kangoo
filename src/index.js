import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Contact } from './components/main/contact/Contact';
import { Home } from './components/main/home/Home';

import App from './App';
import { TicTacToe } from './components/tictactoe/game/TicTacToe';

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
