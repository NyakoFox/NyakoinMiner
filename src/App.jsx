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

  const [upgrades, setUpgrades] = useState(() => {
    const upgrades = localStorage.getItem('upgrades');
    return upgrades ? JSON.parse(upgrades) : [];
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  const increaseUpgrade = (upgradeName) => {
    const newUpgrades = [...upgrades];
    // Ok, if we don't have any already, just add it to the end with an amount of 1
    const upgrade = newUpgrades.find(upgrade => upgrade.upgrade === upgradeName);
    if (upgrade) {
      upgrade.amount++;
    } else {
      newUpgrades.push({ upgrade: upgradeName, amount: 1 });
    }
    setUpgrades(newUpgrades);
  }

  return (
    <>
      <h1>Nyakoin Miner</h1>
      <p>
        NYAKOIN MINED: {count}
      </p>
      <div>
        <div onClick={
          (event) => {
            // increase based on amount
            setCount(count + 1 * ( (upgrades.find(upgrade => upgrade.upgrade === 'Double')) ?? [] ).amount);
            party.confetti(event.target, {
              count: party.variation.range(1, 1),
              shapes: cookie
            });
          }
        }>
          <img src={logo} className="logo" alt="Nyakoin Logo" />
        </div>
        {
          (count >= 20) && (
            <button onClick={
              () => {
                setCount(count - 20);
                increaseUpgrade('Double');
              }
            }>
              Double Nyakoin
            </button>
          )
        }
      </div>
    </>
  )
}

export default App
