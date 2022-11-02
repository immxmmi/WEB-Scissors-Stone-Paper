import {HANDS, isConnected, getRankings, evaluateHand, setConnected} from './game-service.js';

const playButton = document.querySelector('#play');
const table = document.querySelector('#highscore');
// eslint-disable-next-line camelcase
const server_Button = document.querySelector('#server');
const username = document.querySelector('#username');
// eslint-disable-next-line camelcase
const player_name = document.querySelector('#player_name');
const back = document.querySelector('#back');
const start = document.querySelector('#start');
const game = document.querySelector('#game');

// TODO: Create DOM references
// TODO: How to keep track of App state?

// TODO: Create View functions

// TODO: Register Event Handlers

// TODO: Replace the following demo code. It should not be included in the final solution

// RANKING //
getRankings((rankings) => rankings.forEach((rankingEntry) => {
    const row = table.insertRow();
    const rank = row.insertCell(0);
    const name = row.insertCell(1);
    const score = row.insertCell(2);
    rank.innerHTML = rankingEntry.rank;
    score.innerHTML = rankingEntry.wins;
    name.innerHTML = rankingEntry.players;
}));

server_Button.onclick = function () {
    if (isConnected()) {
        server_Button.innerHTML = 'Offline';
        setConnected(false);
    } else {
        server_Button.innerHTML = 'Online';
        setConnected(true);
    }

    console.log('Connection: ', isConnected());
};

playButton.onclick = function () {
    player_name.innerHTML = username.value;
    start.style.display = 'none';
    game.style.display = '';
};

back.onclick = function () {
    player_name.innerHTML = username.value;
    game.style.display = 'none';
    start.style.display = '';
};

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
