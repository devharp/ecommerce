import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home/>}></Route>
        <Route exact path='/cart' element={<Cart/>}></Route>
        <Route path='*' element={<>Not Found</>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
