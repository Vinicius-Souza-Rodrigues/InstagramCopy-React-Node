import { useState } from 'react'
import styles from './app.module.css'

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './pages/Home/Home'
import Register from './pages/Auth/Register'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import { useTheme } from '../context/ThemeContext'

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}className={styles.tema}>
        {theme === 'light' ? ' Modo Escuro' : ' Modo Claro'}
      </button>

      <BrowserRouter>
        <Navbar />
        <div className={styles.container}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
