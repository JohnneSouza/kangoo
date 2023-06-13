import React from "react";

import './App.css';
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/main/navbar/Navbar";

function App() {

  return (
    <div>
      < Navbar />
      < Outlet />
    </div>
  );
}

export default App;
