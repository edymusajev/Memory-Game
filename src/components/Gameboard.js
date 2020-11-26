import React, { useState, useEffect } from 'react';
import Card from './Card';

const Gameboard = ({ addToScore, cards, onSetCards, setAttempts, attempts, cardsDispatch }) => {
  const [flippedCardTimeout, setFlippedCardTimeout] = useState(false);

  const onFlipCard = (id) => {
    if (!flippedCardTimeout) {
      cardsDispatch({ type: 'FLIP_CARD', payload: id });
    }
    const flippedCards = cards.filter((card) => card.flipped).filter((card) => !card.guessed);
    if (flippedCards.length === 1) {
      if (cards.find((card) => card.id === id).img === flippedCards[0].img) {
        cardsDispatch({ type: 'COMPARE_CARDS' });
        addToScore();
      } else {
        setFlippedCardTimeout(true);
        const timeout = setTimeout(() => {
          setFlippedCardTimeout(false);
          cardsDispatch({ type: 'COMPARE_CARDS' });
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  };

  const renderCards = () => {
    if (cards) {
      return cards.map((card) => {
        return <Card key={card.id} card={card} flipCard={onFlipCard} />;
      });
    }
  };

  return (
    <div className="d-flex flex-wrap" style={{ maxWidth: '600px' }}>
      {renderCards()}
    </div>
  );
};

export default Gameboard;
