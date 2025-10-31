import type { GameState, Card, Player, Suit, Rank } from "./types";
import { HeuristicAgent } from './HeuristicAgent';

export function initializeGame(): GameState {
    const players: Player[] = [
        { name: "You", hand: [], isDealer: false, tricksWon: 0, isAI: false, id: 0, CurrentTurn: false },
        { name: "Left", hand: [], isDealer: false, tricksWon: 0, isAI: true, agent: new HeuristicAgent("Left"), id: 1, CurrentTurn: false },
        { name: "Partner", hand: [], isDealer: false, tricksWon: 0, isAI: true, agent: new HeuristicAgent("Partner"), id: 2, CurrentTurn: false },
        { name: "Right", hand: [], isDealer: true, tricksWon: 0, isAI: true, agent: new HeuristicAgent("Right"), id: 3, CurrentTurn: false },
    ];

    return {
        players,
        deck: createDeck(),
        trumpSuit: null,
        currentPlayer: 0,
        phase: 'dealing',
        biddingRound: 1,
        passCount: 0,
        dealer: 3,
        score: { team1: 0, team2: 0 },
        currentTrick: [],
        tricksWon: { team1: 0, team2: 0 }, 
    };
}

export function createDeck(): Card[] {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['9', '10', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ suit, rank, id: `${rank}_of_${suit}` });
        });
    });

    return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/*
 * deal cards takes the current game state and deals 6 cards to
 * each player. It removes the dealt cards from the deck and updates
 * the game phase to 'bidding'.The new state is returned
 */

export function dealCards(gameState: GameState): GameState {
    const newState = { ...gameState };
    const deck = [...newState.deck];

    // Deal 5 cards to each player
    newState.players.forEach(player => {
        player.hand = deck.splice(0, 5);
    });
    
    newState.deck = deck;
    newState.phase = 'bidding';
    return newState;
}

export function processBid(gameState: GameState, bid: Suit | 'pass'): GameState {
    const newState = { ...gameState };
    const currentPlayer = newState.players[newState.currentPlayer];

    if (bid !== 'pass') {
        // Player chose trump
        newState.trumpSuit = bid;
        newState.phase = 'playing';
        newState.currentPlayer = (newState.dealer + 1) % 4; // Player left of dealer leads
        return newState;
    }

    // Player passed
    newState.passCount++;
    
    // Move to next player
    newState.currentPlayer = (newState.currentPlayer + 1) % 4;

    // Check if all players passed in round 1
    if (newState.passCount === 4 && newState.biddingRound === 1) {
        newState.biddingRound = 2;
        newState.passCount = 0;
        newState.currentPlayer = (newState.dealer + 1) % 4;
        return newState;
    }

    // Check if all players passed in round 2 - dealer must call
    if (newState.passCount === 3 && newState.biddingRound === 2) {
        // Dealer is forced to call trump
        const dealer = newState.players[newState.dealer];
        if (dealer.isAI && dealer.agent) {
            const upCard = newState.deck[0];
            const chosenTrump = dealer.agent.chooseTrump(dealer.hand, upCard.suit);
            newState.trumpSuit = (chosenTrump as Suit) || 'hearts'; // Fallback
        } else {
            // Human dealer - they must choose
            return newState;
        }
        newState.phase = 'playing';
        newState.currentPlayer = (newState.dealer + 1) % 4;
        return newState;
    }

    // Check if dealer needs to pick up (round 1, dealer's turn)
    if (newState.biddingRound === 1 && newState.currentPlayer === newState.dealer) {
        if (currentPlayer.isAI && currentPlayer.agent) {
            const upCard = newState.deck[0];
            const decision = currentPlayer.agent.shouldPickUp(currentPlayer.hand, upCard);
            if (decision.pickup) {
                // Pick up card and discard
                newState.trumpSuit = upCard.suit;
                currentPlayer.hand.push(upCard);
                if (decision.discard) {
                    const discardIndex = currentPlayer.hand.findIndex(c => c.id === decision.discard!.id);
                    if (discardIndex !== -1) {
                        currentPlayer.hand.splice(discardIndex, 1);
                    }
                }
                newState.phase = 'playing';
                newState.currentPlayer = (newState.dealer + 1) % 4;
                return newState;
            }
        }
    }

    return newState;
}

export function playCard(gameState: GameState, cardId: string): GameState {
    const newState = { 
        ...gameState,
        currentTrick: [...gameState.currentTrick], // Deep copy the trick array
        players: gameState.players.map(p => ({ ...p, hand: [...p.hand] })) // Deep copy players
    };
    
    const currentPlayer = newState.players[newState.currentPlayer];
    
    // Find and remove the card from current player's hand
    const cardIndex = currentPlayer.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return newState; // Invalid card
    
    const playedCard = currentPlayer.hand.splice(cardIndex, 1)[0];
    newState.currentTrick.push({
        ...playedCard,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name
    });
    
    // Check if trick is complete (4 cards played)
    if (newState.currentTrick.length === 4) {
        // Evaluate who won the trick
        const winnerOffset = evaluateTrickWinner(newState.currentTrick, newState.trumpSuit!);
        
        // Calculate who led the trick (first player in this trick)
        const trickLeader = (newState.currentPlayer - 3 + 4) % 4;
        const winnerIndex = (trickLeader + winnerOffset) % 4;
        
        // Award trick to winner
        newState.players[winnerIndex].tricksWon++;
        
        // Update team tricks (deep copy this too)
        newState.tricksWon = { ...newState.tricksWon };
        const winnerTeam = winnerIndex % 2 === 0 ? 'team1' : 'team2';
        newState.tricksWon[winnerTeam]++;
        
        // DON'T clear trick yet - set phase to trickComplete
        newState.phase = 'trickComplete';
        
        // Store winner for next trick leader
        newState.currentPlayer = winnerIndex;
    } else {
        // Move to next player
        newState.currentPlayer = (newState.currentPlayer + 1) % 4;
    }
    
    return newState;
}

// Add simple function to continue after trick is shown
export function continuePlaying(gameState: GameState): GameState {
    const newState = { 
        ...gameState,
        currentTrick: [], // Create NEW empty array, don't mutate
        tricksWon: { ...gameState.tricksWon },
        score: { ...gameState.score },
        players: gameState.players.map(p => ({ ...p }))
    };
    
    // Check if hand is over (all 5 tricks played)
    const totalTricks = newState.tricksWon.team1 + newState.tricksWon.team2;
    if (totalTricks === 5) {
        // Calculate score
        const team1Score = newState.tricksWon.team1;
        const team2Score = newState.tricksWon.team2;
        
        if (team1Score >= 3) {
            newState.score.team1 += team1Score === 5 ? 2 : 1;
        } else {
            newState.score.team2 += team2Score === 5 ? 2 : 1;
        }
        
        newState.phase = 'scoring';
        
        if (newState.score.team1 >= 10 || newState.score.team2 >= 10) {
            newState.phase = 'gameOver';
        }
    } else {
        // Continue to next trick
        newState.phase = 'playing';
    }
    
    return newState;
}

export function getCardValue(card: Card, trumpSuit: Suit, leadSuit: Suit): number {
    const rankValues: { [key in Rank]: number } = {
        '9': 1,
        '10': 2,
        'J': 3,
        'Q': 4,
        'K': 5,
        'A': 6,
    };

    const getLeftSuit = (trump: Suit): Suit => {
        switch (trump) {
            case 'hearts': return 'diamonds';
            case 'diamonds': return 'hearts';
            case 'clubs': return 'spades';
            case 'spades': return 'clubs';
        }
    }

    if (card.suit === trumpSuit && card.rank === 'J') {
        return 16;
    }

    if (card.suit === getLeftSuit(trumpSuit) && card.rank === 'J') {
        return 15;
    }

    if (card.suit === trumpSuit) {
        return 8 + rankValues[card.rank];
    }
    
    // check if card is of lead suit
    if (leadSuit && card.suit === leadSuit) {
        return rankValues[card.rank];
    }

    // off suit cards have value 0
    return 0;   
}


export function evaluateTrickWinner(trick: Card[], trumpSuit: Suit): number {
    let winningPlayer = 0;
    let max = getCardValue(trick[0], trumpSuit, trick[0].suit); // Initialize with first card

    for(let i = 1; i < trick.length; i++) {
        const val = getCardValue(trick[i], trumpSuit, trick[0].suit);
        if (val > max) {
            max = val;
            winningPlayer = i;
        }
    }

    return winningPlayer;
}

export function startNewHand(gameState: GameState): GameState {
    const newState = { ...gameState}
    newState.tricksWon = { team1: 0, team2: 0 };
    newState.currentTrick = [];
    newState.trumpSuit = null;
    newState.passCount = 0;
    newState.biddingRound = 1;

    // Rotate dealer
    newState.dealer = (newState.dealer + 1) % 4;
    newState.currentPlayer = (newState.dealer + 1) % 4;

    newState.players.forEach(player => {
        player.hand = [];
        player.tricksWon = 0;
        player.isDealer = false;
    });
    newState.players[newState.dealer].isDealer = true;

    // Create and shuffle new deck
    newState.deck = createDeck();
    newState.phase = 'dealing';
    return newState;

}