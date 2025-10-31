// Types for Euchre game components
import { HeuristicAgent } from './HeuristicAgent';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface PlayedCard extends Card {
  playerId: number;
  playerName: string;
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  isDealer: boolean;
  isAI: boolean;
  agent?: HeuristicAgent;
  tricksWon: number;
  CurrentTurn: boolean;

}

export interface GameState {
  players: Player[];
  deck: Card[];
  trumpSuit: Suit | null;
  currentPlayer: number;
  dealer: number;
  /*
   * DEALING - cards dealt
   * BIDDING - players bid for trump
   * PLAYING - players play cards
   * SCORING - points tallied after hand
   * TRICKCOMPLETE - trick completed, allows for user to see all 4 cards played
   * GAMEOVER - game has been won by a team
   */
  phase: 'dealing' | 'bidding' | 'playing' | 'scoring' | 'trickComplete' | 'gameOver';
  biddingRound: 1 | 2; 
  passCount: number;
  score: { team1: number; team2: number };
  currentTrick: PlayedCard[];
  tricksWon: { team1: number; team2: number };
}
