import { useState, useEffect } from 'react'
import logo from './assets/nyakoin.png'
import './App.css'
import * as party from "party-js";

function App() {

  party.resolvableShapes["coin"] = `<img style="width: 20px;" src="nyakoin.png"/>`;

  const upgradeList = [
    {
      upgrade: 'Double',
      cost: 20,
      description: 'Double the amount of Nyakoin you get per click'
    },
    {
      upgrade: 'Auto',
      cost: 100,
      description: 'Automatically get 1 Nyakoin per second'
    }
  ]

  const [count, setCount] = useState(() => {
    const count = localStorage.getItem('count');
    // make sure its not NAN
    if (isNaN(count)) {
      return 0;
    }
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

  useEffect(() => {
    const interval = setInterval(() => {
      const autoUpgrade = upgrades.find(upgrade => upgrade.upgrade === 'Auto');
      if (autoUpgrade) {
        setCount(count + autoUpgrade.amount);
      }
    }, 1000);
    return () => clearInterval(interval);
  }
  , [count, upgrades]);

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
            const amt = 1 * (upgrades.find(upgrade => upgrade.upgrade === 'Double') ?? {amount: 0}).amount + 1;
            setCount(count + amt);
            party.confetti(event.target, {
              count: party.variation.range(Math.min(amt, 10), Math.min(amt, 10)),
              shapes: ["coin"]
            });
          }
        }>
          <img src={logo} className="logo" alt="Nyakoin Logo" />
        </div>
        <div className="upgradelist">
        {
          /* filter for what you can buy */
          upgradeList.filter(upgrade => count >= upgrade.cost).map((upgrade, index) => {
            return (
              <div className="upgrade" key={index}>
                <h2>{upgrade.upgrade}</h2>
                <p>{upgrade.description}</p>
                <p>Cost: {upgrade.cost}</p>
                <p>Owned: {upgrades.find(upg => upg.upgrade === upgrade.upgrade)?.amount ?? 0}</p>
                <div className="upgrade-buttons">
                <button onClick={
                  () => {
                    setCount(count - upgrade.cost);
                    increaseUpgrade(upgrade.upgrade);
                  }
                }>
                  Buy
                </button>
                {
                  (count >= (upgrade.cost * 10)) && <button onClick={
                    () => {
                      setCount(count - upgrade.cost * 10);
                      for (let i = 0; i < 10; i++)
                        increaseUpgrade(upgrade.upgrade);
                    }
                  }>
                    Buy 10
                  </button>
                }
                {
                  (count >= (upgrade.cost * 100)) && <button onClick={
                    () => {
                      setCount(count - upgrade.cost * 100);
                      for (let i = 0; i < 100; i++)
                        increaseUpgrade(upgrade.upgrade);
                    }
                  }>
                    Buy 100
                  </button>
                }
                </div>
              </div>
            )
          })
        }
        </div>
      </div>
    </>
  )
}

export default App
