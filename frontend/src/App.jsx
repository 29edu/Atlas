import { useState } from 'react'
import './App.css'
import LoginForm from './components/auth/LoginForm'
import {Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/dashboard' element={ <Dashboard />} />
        <Route path='/login' element={<LoginForm />} />
        <Login />
      </Routes>
    </>
  )
}

export default App
