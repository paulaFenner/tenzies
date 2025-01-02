import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import Die from './Die';

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const buttonRef = useRef(null);

  const gameWon = dice.every((die) => die.isHeld) && dice.every((die) => die.value === dice[0].value);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
    /* return a new Array with 10 elements
    and then we map over the array and return a random number from 1 - 6  */
  }

  function rollDice() {
    setDice((prevDice) =>
      prevDice.map((item) => {
        return item.isHeld ? item : { ...item, value: Math.ceil(Math.random() * 6) };
      })
    );
  }

  function hold(id) {
    setDice((prevDice) =>
      prevDice.map((item) => {
        return item.id === id ? { ...item, isHeld: !item.isHeld } : item;
      })
    );
  }

  function newGame() {
    setDice(generateAllNewDice());
  }

  const diceElements = dice.map((dieObj) => (
    <Die hold={hold} key={dieObj.id} value={dieObj.value} isHeld={dieObj.isHeld} id={dieObj.id} />
  ));

  return (
    <>
      <main>
        {gameWon && <Confetti />}

        <div aria-live="polite" className="sr-only">
          {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
        </div>

        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
        <section className="dice-container">{diceElements}</section>
        <button ref={buttonRef} className="roll-btn" onClick={gameWon ? newGame : rollDice}>
          {gameWon ? 'New Game' : 'Roll'}
        </button>
      </main>
    </>
  );
}
