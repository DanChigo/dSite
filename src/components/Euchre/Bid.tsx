import React from 'react';
import type { GameState, Suit } from './types';
import Card from './Card';

interface BiddingPhaseProps {
  gameState: GameState;
  onBid: (bid: Suit | 'pass') => void;
}

export default function BiddingPhase({ gameState, onBid }: BiddingPhaseProps) {
  const upCard = gameState.deck[0];
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const isHumanTurn = gameState.currentPlayer === 0;
  const humanPlayer = gameState.players[0];

  const availableSuits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    .filter(suit => gameState.biddingRound === 1 ? suit === upCard.suit : suit !== upCard.suit) as Suit[];

  return (
    <div className="bidding-phase">
      <h3>Bidding Phase - Round {gameState.biddingRound}</h3>
      
      <div className="trump-card">
        <p>Trump card:</p>
        <Card card={upCard} />
      </div>

      {/* Always show human's hand */}
      <div className="player-hand">
        <h4>Your Hand:</h4>
        <div className="hand-cards">
          {humanPlayer.hand.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>

      {isHumanTurn ? (
        <div className="bidding-options">
          <p>Choose Trump {gameState.biddingRound === 1 ? '(cannot choose ' + upCard.suit + ')' : ''}:</p>
          <div className="bid-buttons">
            {availableSuits.map(suit => (
              <button key={suit} onClick={() => onBid(suit)}>
                {suit === 'hearts' && '♥ Hearts'}
                {suit === 'diamonds' && '♦ Diamonds'}
                {suit === 'clubs' && '♣ Clubs'}
                {suit === 'spades' && '♠ Spades'}
              </button>
            ))}
            <button onClick={() => onBid('pass')}>Pass</button>
          </div>
        </div>
      ) : (
        <div className="waiting-indicator">
          <p>Waiting for {currentPlayer.name} to bid...</p>
        </div>
      )}
    </div>
  );
}