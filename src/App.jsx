import { useState, useEffect } from 'react'
import logo from './assets/nyakoin.png'
import './App.css'
import * as party from "party-js";

function App() {

  const cookie = document.createElement('span');
  cookie.innerText = '🪙';
  cookie.style.fontSize = '24px';


  const [count, setCount] = useState(() => {
    const count = localStorage.getItem('count');
    return count ? parseInt(count) : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <>
      <h1>Nyakoin Miner</h1>
      <p>
        NYAKOIN MINED: {count}
      </p>
      <div>
        <div href="https://vitejs.dev" target="_blank" onClick={
          (event) => {
            setCount(count + 1);
            party.confetti(event.target, {
              count: party.variation.range(1, 1),
              shapes: cookie
            });
          }
        }>
          <img src={logo} className="logo" alt="Vite logo" />
        </div>
      </div>
    </>
  )
}

export default App
