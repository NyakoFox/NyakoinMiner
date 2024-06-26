import { useRef, useCallback, useState, useEffect } from 'react'
import logo from './assets/nyakoin.png'
import './App.css'
import * as party from "party-js";
import { abbreviateNumber } from "js-abbreviation-number";
import NavigationBar from '/src/components/NavigationBar';

function App() {

  party.resolvableShapes["coin"] = `<img style="width: 20px;" src="nyakoin.png"/>`;

  const upgradeList = [
    {
      upgrade: 'Double',
      name: 'Increase',
      cost: 20,
      description: 'Increase the amount of Nyakoin you get per click'
    },
    {
      upgrade: 'Auto',
      name: 'Auto',
      cost: 100,
      description: 'Automatically get 1 Nyakoin per second'
    },
    {
      upgrade: 'DoubleAuto',
      name: 'Auto Increase',
      cost: 1000,
      description: 'Increase the amount of Nyakoin you get per second'
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

  const coinRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  const increaseUpgrade = (upgradeName, amount = 1) => {
    const newUpgrades = [...upgrades];
    // Ok, if we don't have any already, just add it to the end with an amount of 1
    const upgrade = newUpgrades.find(upgrade => upgrade.upgrade === upgradeName);
    if (upgrade) {
      upgrade.amount += amount;
    } else {
      newUpgrades.push({ upgrade: upgradeName, amount: amount });
    }
    setUpgrades(newUpgrades);
  }

  const getUpgradeAmount = useCallback((upgradeName) => {
    const upgrade = upgrades.find(upgrade => upgrade.upgrade === upgradeName);
    return upgrade ? upgrade.amount : 0;
  }, [upgrades]);

  useEffect(() => {
    const interval = setInterval(() => {
      const autoUpgrade = upgrades.find(upgrade => upgrade.upgrade === 'Auto');
      if (autoUpgrade) {
        setCount(count + autoUpgrade.amount * (getUpgradeAmount('DoubleAuto') + 1));
        party.confetti(coinRef.current, {
          count: party.variation.range(1, 10),
          shapes: ["coin"]
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }
  , [count, upgrades, getUpgradeAmount]);

  const buyUpgrade = (upgradeName, amount = 1) => {
    const upgrade = upgradeList.find(upgrade => upgrade.upgrade === upgradeName);
    if (upgrade && count >= upgrade.cost * amount) {
      setCount(count - upgrade.cost * amount);
      increaseUpgrade(upgradeName, amount);
    }
  }

  const abbrMoney = (amt, dec = 1) => {
    if (largeNumbers) {
      return amt;
    }
    try
    {
      return abbreviateNumber(amt, dec, {symbols: ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d", "U", "D", "T", "Qt", "Qd"]});
    }
    catch (e)
    {
      return amt;
    }
  }

  const [largeNumbers, setLargeNumbers] = useState(() => {
    const largeNumbers = localStorage.getItem('largeNumbers');
    return largeNumbers ? JSON.parse(largeNumbers) : false;
  });

  useEffect(() => {
      localStorage.setItem('largeNumbers', JSON.stringify(largeNumbers));
  }, [largeNumbers]);

  return (
    <>
      <NavigationBar largeNumbers={largeNumbers} setLargeNumbers={setLargeNumbers}/>
      <main>
        <h1>Nyakoin Miner</h1>
        <p>
          <span>NYAKOIN MINED: <span className="amount">{abbrMoney(count)}</span></span>
        </p>
        <div>
            <img draggable="false" src={logo} className="logo" alt="Nyakoin Logo" ref={coinRef} onClick={
            (event) => {
              // increase based on amount
              const amt = getUpgradeAmount('Double') + 1;
              setCount(count + amt);
              party.confetti(event.target, {
                count: party.variation.range(Math.min(amt, 10), Math.min(amt, 10)),
                shapes: ["coin"]
              });
            }
          }/>
          <div className="upgradelist">
          {
            /* filter for what you can buy */
            upgradeList.filter(upgrade => count >= upgrade.cost).map((upgrade, index) => {
              return (
                <div className="upgrade" key={index}>
                  <h2>{upgrade.name}</h2>
                  <p>{upgrade.description}</p>
                  <p>Cost: {upgrade.cost}</p>
                  <p>Owned: {upgrades.find(upg => upg.upgrade === upgrade.upgrade)?.amount ?? 0}</p>
                  <div className="upgrade-buttons">
                    {[1, 10, 100, 1000, 10000, 100000, 1000000].map((num) => {
                      return (count >= (upgrade.cost * num)) && <button key={num} onClick={
                        () => {
                            buyUpgrade(upgrade.upgrade, num);
                          }
                        }>
                        Buy {abbrMoney(num, 0)}
                      </button>
                    })
                  }
                    <button onClick={
                      () => {
                          buyUpgrade(upgrade.upgrade, Math.floor(count / upgrade.cost));
                        }
                      }>
                      Buy Max
                    </button>
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </main>
    </>
  )
}

export default App
