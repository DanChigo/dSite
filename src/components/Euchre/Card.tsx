import React from 'react';
import type { Card as CardType } from './types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  faceDown?: boolean;
  className?: string;
}

export default function Card({ card, onClick, faceDown = false, className = '' }: CardProps) {
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  if (faceDown) {
    return (
      <div className={`card card-back ${className}`} onClick={onClick}>
        <div className="card-pattern">🂠</div>
      </div>
    );
  }

  return (
    <div 
      className={`card card-face ${className}`} 
      onClick={onClick}
      style={{ color: getSuitColor(card.suit) }}
    >
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">{getSuitSymbol(card.suit)}</div>
    </div>
  );
}