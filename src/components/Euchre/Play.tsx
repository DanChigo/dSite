import React, { useEffect } from 'react';
import type { GameState } from './types';
import Card from './Card';

interface PlayingPhaseProps {
  gameState: GameState;
  onPlayCard: (cardId: string) => void;
}

export default function PlayingPhase({ gameState, onPlayCard }: PlayingPhaseProps) {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const isHumanTurn = gameState.currentPlayer === 0;

  // Handle AI turns
  useEffect(() => {
    if (!isHumanTurn && currentPlayer.isAI && currentPlayer.agent) {
      const agent = currentPlayer.agent;
      const timer = setTimeout(() => {
        const leadSuit = gameState.currentTrick.length > 0 
          ? gameState.currentTrick[0].suit 
          : undefined;
        
        const cardToPlay = agent.chooseCard(
          currentPlayer.hand,
          gameState.trumpSuit!,
          leadSuit,
          gameState.currentTrick
        );
        
        onPlayCard(cardToPlay.id);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, isHumanTurn, currentPlayer, gameState, onPlayCard]);

  return (
    <div className="playing-phase">
      <h3>Playing Phase - Trump: {gameState.trumpSuit}</h3>
      
      <div className="game-info">
        <p>Current Turn: {currentPlayer.name}</p>
      </div>

      <div className="current-trick">
        <h4>Current Trick:</h4>
        <div className="trick-cards">
          {gameState.currentTrick.map((card, index) => (
            <div key={card.id} className="trick-card-wrapper">
              <Card card={card} />
              <span className="player-label">Player {index}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="players-info">
        {gameState.players.map((player, index) => (
          <div key={index} className={`player-info ${index === gameState.currentPlayer ? 'active' : ''}`}>
            <h4>{player.name} {player.isAI && '🤖'}</h4>
            <p>Cards: {player.hand.length}</p>
            <p>Tricks Won: {player.tricksWon}</p>
          </div>
        ))}
      </div>

      {isHumanTurn && (
        <div className="player-hand">
          <h4>Your Hand (click to play):</h4>
          <div className="hand-cards">
            {gameState.players[0].hand.map(card => (
              <Card 
                key={card.id} 
                card={card} 
                onClick={() => onPlayCard(card.id)}
                className="playable-card"
              />
            ))}
          </div>
        </div>
      )}

      {!isHumanTurn && (
        <div className="ai-turn-indicator">
          <p>Waiting for {currentPlayer.name} to play...</p>
        </div>
      )}
    </div>
  );
}