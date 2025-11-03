import React, { useState } from 'react';
import { Modal, TitleBar } from "@react95/core";
import type { GameState, Suit } from './types';
import { initializeGame, dealCards, processBid, playCard, continuePlaying, startNewHand } from './gameLogic';
import BiddingPhase from './Bid';
import PlayingPhase from './Play';
import { useWindowSize } from '../WindowSizeProvider';
import './Euchre.css';

interface EuchreProps {
  show: boolean;
  toggle: () => void;
}

export default function Euchre({ show, toggle }: EuchreProps) {
  const { isMobile, isTablet } = useWindowSize();
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  // Auto-handle AI bidding
  React.useEffect(() => {
    if (gameState.phase === 'bidding') {
      const currentPlayer = gameState.players[gameState.currentPlayer];
      if (currentPlayer.isAI && currentPlayer.agent) {
        const agent = currentPlayer.agent;
        const timer = setTimeout(() => {
          const upCard = gameState.deck[0];
          
          if (gameState.biddingRound === 1) {
            const shouldOrder = agent.shouldOrderUp(
              currentPlayer.hand,
              upCard,
              gameState.currentPlayer
            );
            handleBid(shouldOrder ? upCard.suit : 'pass');
          } else {
            const chosenTrump = agent.chooseTrump(currentPlayer.hand, upCard.suit);
            handleBid((chosenTrump as Suit) || 'pass');
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.phase, gameState.currentPlayer, gameState.biddingRound]);

  // Auto-handle AI playing cards
  React.useEffect(() => {
    if (gameState.phase === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayer];
      if (currentPlayer.isAI && currentPlayer.agent) {
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
          
          handlePlayCard(cardToPlay.id);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.phase, gameState.currentPlayer]); // REMOVE currentTrick.length dependency!

  const clearingTrickRef = React.useRef(false);

  // Handle trick completion
  React.useEffect(() => {
    if (gameState.phase === 'trickComplete' && !clearingTrickRef.current) {
        clearingTrickRef.current = true;
        const timer = setTimeout(() => {
            const newGameState = continuePlaying(gameState);
            setGameState(newGameState);
            clearingTrickRef.current = false;
        }, 2000);
        
        return () => {
          clearTimeout(timer);
          clearingTrickRef.current = false;
        };
    }
  }, [gameState.phase, gameState.currentTrick.length]);

  // Handle scoring phase - auto-start new hand after delay
  React.useEffect(() => {
    if (gameState.phase === 'scoring') {
      const timer = setTimeout(() => {
        const newGameState = startNewHand(gameState);
        setGameState(newGameState);
        
        // Auto-deal after starting new hand
        setTimeout(() => {
          const dealtState = dealCards(newGameState);
          setGameState(dealtState);
        }, 500);
      }, 3000); // Show scores for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [gameState.phase]);

  // Handle game over
  React.useEffect(() => {
    if (gameState.phase === 'gameOver') {
      // Could add confetti or celebration here
      console.log('Game Over!');
    }
  }, [gameState.phase]);

  const getModalDimensions = () => {
    if (isMobile) {
      return { width: "90vw", height: "80vh" };
    } else if (isTablet) {
      return { width: "75vw", height: "75vh" };
    } else {
      return { width: "700px", height: "550px" };
    }
  };

  const { width, height } = getModalDimensions();

  const handleCloseEuchre = () => {
    toggle();
  };

  const handleDealCards = () => {
    const newGameState = dealCards(gameState);
    setGameState(newGameState);
  };

  const handleBid = (bid: Suit | 'pass') => {
    const newGameState = processBid(gameState, bid);
    setGameState(newGameState);
  };

  const handlePlayCard = (cardId: string) => {
    const newGameState = playCard(gameState, cardId);
    setGameState(newGameState);
  };

  return (
    <>
      {show && (
        // @ts-ignore
        <Modal
          width={width}
          height={height}
          title="Euchre"
          dragOptions={{ defaultPosition: { x: 0, y: 0 } }}
          titleBarOptions={[
            <TitleBar.Close key="close" onClick={handleCloseEuchre} />
          ]}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Modal.Content style={{ 
            flex: 1, 
            overflow: 'hidden', 
            padding: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="euchre-container">
              <div className="game-info">
                <p>Score: Team 1: {gameState.score.team1} | Team 2: {gameState.score.team2}</p>
              </div>
              
              {gameState.phase === 'dealing' && (
                <div className="game-controls">
                  <button onClick={handleDealCards}>Deal Cards</button>
                </div>
              )}

              {gameState.phase === 'bidding' && (
                <BiddingPhase gameState={gameState} onBid={handleBid} />
              )}

              {(gameState.phase === 'playing' || gameState.phase === 'trickComplete') && (
                <PlayingPhase gameState={gameState} onPlayCard={handlePlayCard} />
              )}

              {gameState.phase === 'scoring' && (
                <div className="scoring-phase">
                  <h3>Hand Complete!</h3>
                  <p>Team 1 won {gameState.tricksWon.team1} tricks</p>
                  <p>Team 2 won {gameState.tricksWon.team2} tricks</p>
                  <h4>Current Score:</h4>
                  <p>Team 1: {gameState.score.team1}</p>
                  <p>Team 2: {gameState.score.team2}</p>
                  <p>Starting next hand...</p>
                </div>
              )}

              {gameState.phase === 'gameOver' && (
                <div className="game-over">
                  <h2>Game Over!</h2>
                  <h3>{gameState.score.team1 >= 10 ? 'Team 1 Wins!' : 'Team 2 Wins!'}</h3>
                  <p>Final Score: {gameState.score.team1} - {gameState.score.team2}</p>
                  <button onClick={() => setGameState(initializeGame())}>New Game</button>
                </div>
              )}
            </div>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}