import { useState } from 'react'
import styles from './app.module.css'

// Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './pages/Home/Home'
import Register from './pages/Auth/Register'
import EditProfile from './pages/EditProfile/EditProfile'
import Profile from './pages/Profile/Profile'

//Hooks
import { useAuth } from './hooks/useAuth'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import { useTheme } from '../context/ThemeContext'

function App() {

  const { theme, toggleTheme } = useTheme();
  const { auth, loading } = useAuth()

  console.log(loading)
  console.log("auth" + auth)

  if (loading) {
    return  <p>Carregando!...</p>
  }

  return (
    <div>
      <button onClick={toggleTheme}className={styles.tema}>
        {theme === 'light' ? ' Modo Escuro' : ' Modo Claro'}
      </button>

      <BrowserRouter>
        <Navbar />
        <div className={styles.container}>
          <Routes>
            <Route path='/' element={auth ? <Home /> : <Navigate to="/login"/>} />
            <Route path='/profile' element={auth ? <EditProfile /> : <Navigate to="/login"/>} />
            <Route path='/user/:id' element={auth ? <Profile /> : <Navigate to="/login"/>} />
            <Route path='/login' element={!auth ? <Login /> : <Navigate to="/"/>} />
            <Route path='/register' element={!auth ? <Register /> : <Navigate to="/"/>} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
