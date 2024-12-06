import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React from 'react'

import Login from "./pages/Auth/Login";
import Singup from "./pages/Auth/Singup";
import Home from "./pages/Home/Home";
import Welcome from "./pages/MainHomepage/MainPage";


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Welcome/>}/>
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signup" exact element={<Singup/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App