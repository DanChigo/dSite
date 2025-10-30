import type { Card } from './types';

export class HeuristicAgent {
  private name: string;

  constructor(name: string = 'Heuristic Player') {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  // Main decision: choose a card to play
  chooseCard(
    hand: Card[], 
    trump: string, 
    leadSuit?: string,
    _cardsPlayed?: Card[],
    isPartnerWinning?: boolean
  ): Card {
    // Strategy hierarchy:
    // 1. Must follow suit if possible
    // 2. If partner is winning, play low
    // 3. If can't follow, play trump to win
    // 4. Otherwise discard lowest card

    const validCards = this.getValidCards(hand, leadSuit);
    
    if (validCards.length === 1) {
      return validCards[0];
    }

    // If no lead suit (you're leading), play strategically
    if (!leadSuit) {
      return this.leadCard(hand, trump);
    }

    // If partner is winning, play low to save high cards
    if (isPartnerWinning && validCards.some(c => c.suit === leadSuit)) {
      const suitCards = validCards.filter(c => c.suit === leadSuit);
      return this.getLowestCard(suitCards);
    }

    // Try to win the trick
    const trumpCards = hand.filter(c => this.isTrump(c, trump));
    const suitCards = validCards.filter(c => c.suit === leadSuit);

    // Follow suit if possible
    if (suitCards.length > 0) {
      // Play high card to win if possible
      return this.getHighestCard(suitCards);
    }

    // Can't follow suit - play trump if we have it
    if (trumpCards.length > 0) {
      return this.getLowestCard(trumpCards);
    }

    // Discard lowest non-trump card
    return this.getLowestCard(validCards);
  }

  // Decide whether to order up trump (dealer's partner)
  shouldOrderUp(hand: Card[], upCard: Card, position: number): boolean {
    const trump = upCard.suit;
    const trumpCards = hand.filter(c => this.isTrump(c, trump));
    
    // Count strong trump cards
    const strongTrump = trumpCards.filter(c => 
      this.getTrumpValue(c, trump) >= 4
    ).length;

    // Order up if we have 2+ strong trump
    if (strongTrump >= 2) return true;

    // Order up if we have 3+ trump total and are dealer
    if (position === 0 && trumpCards.length >= 3) return true;

    return false;
  }

  // Decide whether to pick up trump (dealer only)
  shouldPickUp(hand: Card[], upCard: Card): { pickup: boolean; discard?: Card } {
    const trump = upCard.suit;
    const trumpCards = hand.filter(c => this.isTrump(c, trump));
    
    // Always pick up if right bower
    if (upCard.rank === 'J') {
      const lowestCard = this.getLowestCard(hand);
      return { pickup: true, discard: lowestCard };
    }

    // Pick up if we have 2+ trump already
    if (trumpCards.length >= 2) {
      const lowestCard = this.getLowestCard(hand);
      return { pickup: true, discard: lowestCard };
    }

    return { pickup: false };
  }

  // Decide what suit to call (when dealer turns down)
  chooseTrump(hand: Card[], excludeSuit?: string): string | null {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']
      .filter(s => s !== excludeSuit);

    let bestSuit = null;
    let bestScore = 2; // Minimum threshold

    for (const suit of suits) {
      const trumpCards = hand.filter(c => this.isTrump(c, suit));
      const score = trumpCards.reduce((sum, card) => 
        sum + this.getTrumpValue(card, suit), 0
      );

      if (score > bestScore) {
        bestScore = score;
        bestSuit = suit;
      }
    }

    return bestSuit;
  }

  // Helper: Get valid cards to play
  private getValidCards(hand: Card[], leadSuit?: string): Card[] {
    if (!leadSuit) return hand;
    
    const suitCards = hand.filter(c => c.suit === leadSuit);
    return suitCards.length > 0 ? suitCards : hand;
  }

  // Helper: Choose card when leading
  private leadCard(hand: Card[], trump: string): Card {
    const trumpCards = hand.filter(c => this.isTrump(c, trump));
    const offSuit = hand.filter(c => !this.isTrump(c, trump));

    // Lead trump if we have strong trump
    if (trumpCards.length >= 3) {
      return this.getHighestCard(trumpCards);
    }

    // Lead highest off-suit card
    if (offSuit.length > 0) {
      return this.getHighestCard(offSuit);
    }

    return this.getHighestCard(hand);
  }

  // Helper: Check if card is trump
  private isTrump(card: Card, trump: string): boolean {
    if (card.suit === trump) return true;
    // Left bower (Jack of same color)
    if (card.rank === 'J') {
      const oppositeColor = this.getOppositeColorSuit(trump);
      return card.suit === oppositeColor;
    }
    return false;
  }

  // Helper: Get trump value (higher = better)
  private getTrumpValue(card: Card, trump: string): number {
    if (!this.isTrump(card, trump)) return 0;

    // Right bower (Jack of trump)
    if (card.rank === 'J' && card.suit === trump) return 7;
    
    // Left bower (Jack of same color)
    if (card.rank === 'J') return 6;

    const rankValues: Record<string, number> = {
      'A': 5, 'K': 4, 'Q': 3, '10': 2, '9': 1
    };
    return rankValues[card.rank] || 0;
  }

  // Helper: Get card value (non-trump)
  private getCardValue(card: Card): number {
    const rankValues: Record<string, number> = {
      'A': 6, 'K': 5, 'Q': 4, 'J': 3, '10': 2, '9': 1
    };
    return rankValues[card.rank] || 0;
  }

  // Helper: Get highest card
  private getHighestCard(cards: Card[]): Card {
    return cards.reduce((highest, card) => 
      this.getCardValue(card) > this.getCardValue(highest) ? card : highest
    );
  }

  // Helper: Get lowest card
  private getLowestCard(cards: Card[]): Card {
    return cards.reduce((lowest, card) => 
      this.getCardValue(card) < this.getCardValue(lowest) ? card : lowest
    );
  }

  // Helper: Get opposite color suit for left bower
  private getOppositeColorSuit(suit: string): string {
    const opposites: Record<string, string> = {
      'hearts': 'diamonds',
      'diamonds': 'hearts',
      'clubs': 'spades',
      'spades': 'clubs'
    };
    return opposites[suit];
  }
}