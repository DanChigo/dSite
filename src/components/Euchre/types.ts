// Types for Euchre game components
import { HeuristicAgent } from './HeuristicAgent';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
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
  phase: 'dealing' | 'bidding' | 'playing' | 'scoring';
  biddingRound: 1 | 2; 
  passCount: number;
  score: { team1: number; team2: number };
  currentTrick: Card[];
  tricksWon: { team1: number; team2: number };
}
