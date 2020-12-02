import React, { useState, useEffect, useReducer, useCallback } from 'react';
import Gameboard from './Gameboard';
import { createCards } from '../cards';
import { cardsReducer } from '../reducers';
import { formatTime } from '../helpers';

import '../style.css';
import GameInfo from './GameInfo';
import GameCompleted from './GameCompleted';

import logo from '../SVG/pokemon-logo.svg';

const App = () => {
  const [cards, cardsDispatch] = useReducer(cardsReducer, null);
  const [matched, setMatched] = useState(0);
  const [attempts, setAttempts] = useState(20);
  const [timer, setTimer] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedMsg, setCompletedMsg] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const maxScore = 8;
  const maxAttempts = 20;

  const requestCards = async () => {
    const cards = await createCards();
    cardsDispatch({
      type: 'RESET_CARDS',
      payload: cards,
    });
  };

  const addToMatched = () => {
    setMatched(matched + 1);
  };
  const addToAttempts = () => {
    setAttempts(attempts - 0.5);
  };

  const calculateProgress = () => {
    return `${(matched / maxScore) * 100}%`;
  };

  const onNewGame = () => {
    if (gameCompleted) {
      setGameCompleted(false);
      requestCards();
      setMatched(0);
      setTimer(0);
      setCompletedMsg('');
      setAttempts(maxAttempts);
    }
  };

  const getScore = useCallback(() => {
    return Math.round(matched * Math.floor(attempts / 2) * 125);
  }, [matched]);
  const getAttempts = () => {
    return `${Math.round(attempts)} / ${maxAttempts}`;
  };
  const attemptMultiplier = () => {
    return `${Math.floor(attempts / 2)}x`;
  };
  const getTime = () => {
    return formatTime(timer);
  };

  useEffect(() => {
    setScore(getScore());
  }, [matched, getScore]);
  useEffect(() => {
    if (gameCompleted) {
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameCompleted, matched, highScore, score]);
  useEffect(() => {
    requestCards();
  }, []);

  useEffect(() => {
    if (!gameCompleted) {
      const interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [gameCompleted, setTimer, timer]);

  useEffect(() => {
    if (cards) {
      if (attempts === 0 || (cards.every((card) => card.guessed) && timer > 2)) {
        setGameCompleted(true);
      }
    }
  }, [timer, cards, attempts, gameCompleted]);

  useEffect(() => {
    if (gameCompleted) {
      if (cards.every((card) => card.guessed)) {
        setCompletedMsg('You Won!');
      } else {
        setCompletedMsg('You Lost!');
      }
    }
  }, [cards, gameCompleted]);

  return (
    <div className="fluid-container">
      <div className=" bg-dark pt-3 pb-0 mb-4">
        <div className=" container row mx-auto">
          <div className="col-md-2 text-center mb-4">
            <img src={logo} className="img-fluid logo mt-2" alt="logo" />
          </div>
          <div className="col-md-8 px-0">
            <GameInfo
              attempts={attempts}
              maxAttempts={maxAttempts}
              matched={matched}
              maxScore={maxScore}
              calculateProgress={calculateProgress}
              getTime={getTime}
            />
          </div>
        </div>
      </div>

      {gameCompleted && (
        <GameCompleted
          gameCompleted={gameCompleted}
          onNewGame={onNewGame}
          getScore={getScore}
          highScore={highScore}
          getAttempts={getAttempts}
          getTime={getTime}
          completedMsg={completedMsg}
          attempts={attempts}
          maxAttempts={maxAttempts}
          attemptMultiplier={attemptMultiplier}
        />
      )}
      <Gameboard
        cardsDispatch={cardsDispatch}
        addToMatched={addToMatched}
        cards={cards}
        addToAttempts={addToAttempts}
        gameCompleted={gameCompleted}
      />
    </div>
  );
};
export default App;
