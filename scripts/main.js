import {HANDS, isConnected, getRankings, evaluateHand} from './game-service.js';
// TODO: Create DOM references
// TODO: How to keep track of App state?

// TODO: Create View functions

// TODO: Register Event Handlers

// TODO: Replace the following demo code. It should not be included in the final solution

console.log('isConnected:', isConnected());

getRankings((rankings) => rankings.forEach((rankingEntry) => console.log(
  `Rank ${rankingEntry.rank} (${rankingEntry.wins} wins): ${rankingEntry.players}`,
)));

function pickHand() {
  const handIndex = Math.floor(Math.random() * 3);
  return HANDS[handIndex];
}

let count = 1;

function printWinner(hand, didWin) {
  console.log(count++, hand, didWin);
}

for (let i = 1; i < 10; i++) {
  const playerHand = pickHand();
  evaluateHand('peter', playerHand,
    ({
       systemHand,
       gameEval,
     }) => printWinner(playerHand, systemHand, gameEval));
}
