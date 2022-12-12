import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';

function App() {
  const [count, setCount] = useState(0);
  const host = 'https://0488-144-48-178-172.in.ngrok.io';

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home host={host}/>}></Route>
        <Route exact path='/cart' element={<Cart host={host} />}></Route>
        <Route path='*' element={<>Not Found</>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
