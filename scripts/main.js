import {HANDS, isConnected, getRankings, evaluateHand, setConnected} from './game-service.js';

const playButton = document.querySelector('#play');
const playerName = document.querySelector('#playerName');
const table = document.querySelector('#highscore');
const status = document.querySelector('#status');
const username = document.querySelector('#username');
const back = document.querySelector('#back');
const start = document.querySelector('#start');
const game = document.querySelector('#game');
const scissor = document.querySelector('#scissor');
const stone = document.querySelector('#stone');
const paper = document.querySelector('#paper');

// TODO: How to keep track of App state?

// TODO: Create View functions

// TODO: Register Event Handlers

// TODO: Replace the following demo code. It should not be included in the final solution

// STATUS ON - OFF Button
status.onclick = function () {
    if (isConnected()) {
        status.innerHTML = 'Offline';
        setConnected(false);
    } else {
        status.innerHTML = 'Online';
        // CODE --> ONLINE
        setConnected(true);
    }
};

// INSERT RANKING in LIST
getRankings((rankings) => rankings.forEach((rankingEntry) => {
    const row = table.insertRow();
    const rank = row.insertCell(0);
    const name = row.insertCell(1);
    const score = row.insertCell(2);
    rank.innerHTML = rankingEntry.rank;
    name.innerHTML = rankingEntry.name;
    score.innerHTML = rankingEntry.win;
}));

// Start Button Funktion
playButton.onclick = function () {
    start.classList.add('hidden');
    game.classList.remove('hidden');
    playerName.innerHTML = username.value;
    evaluateHand(playerName.innerHTML, 'stone');
};

// Back to Start Button
back.onclick = function () {
    playerName.innerHTML = '';
    start.classList.remove('hidden');
    game.classList.add('hidden');
};

// PRINT WINNWER
let count = 1;

function printWinner(hand, didWin) {
    console.log(count++, hand, didWin);
}

// START GAME
function startGame(name, playerHand) {
    console.log('hello');
    console.log(name, playerHand);
    evaluateHand(name, playerHand, ({
                                        systemHand,
                                        gameEval,
                                    }) => printWinner(playerHand, systemHand, gameEval));
}

// CHOICE SCISSOR
scissor.onclick = function () {
    startGame(username.value, HANDS[0]);
};
// CHOICE STONE
stone.onclick = function () {
    startGame(username.value, HANDS[1]);
};

// CHOICE PAPER
paper.onclick = function () {
    startGame(username.value, HANDS[2]);
};
