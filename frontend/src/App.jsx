import { useState } from 'react'

// Router
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './pages/Home/Home'
import Register from './pages/Auth/Register'

//components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
