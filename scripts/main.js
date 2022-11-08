import {HANDS, isConnected, getRankings, evaluateHand, setConnected} from './game-service.js';

const playButton = document.querySelector('#play');
const playerName = document.querySelector('#name');
const backButton = document.querySelector('#back');
const messageOutput = document.querySelector('#message');
const highscoreTable = document.querySelector('#highscore');
const history = document.querySelector('#history');
const status = document.querySelector('#status');
const username = document.querySelector('#username');
const startSection = document.querySelector('#start');
const gameSection = document.querySelector('#gameSection');
const scissor = document.querySelector('#scissor');
const stone = document.querySelector('#stone');
const paper = document.querySelector('#paper');
const form = document.querySelector('#form');
let historyTable;

// TEST
console.assert(playButton != null);
console.assert(backButton != null);
console.assert(playerName != null);

// INSERT RANKING in LIST
getRankings((rankings) => rankings.forEach((rankingEntry) => {
    const row = highscoreTable.insertRow();
    const rank = row.insertCell(0);
    const name = row.insertCell(1);
    const score = row.insertCell(2);
    rank.innerHTML = rankingEntry.rank;
    name.innerHTML = rankingEntry.name;
    score.innerHTML = rankingEntry.win;
}));

// TODO: How to keep track of App state?

// GLOBAL VAR PAGE
const PAGE = {
    START: 0,
    GAME: 1,
};

// GLOBAL VAR  PLAYER
const PLAYER = {
    Player: -1,
    None: 0, // DRAW
    Computer: 1,
};

// STATE (Lokaler Speicher)
function newAppState() {
    return {
        online: false,
        finished: false,
        round: 0,
        username: '',
        currentPage: PAGE.START,
        winner: PLAYER.Player,
    };
}

// INSTANCE of Game
const app = newAppState();

// Change Online Status
function changeStatus() {
    if (isConnected()) {
        status.innerHTML = 'Offline';
        app.online = false;
        setConnected(false);
    } else {
        status.innerHTML = 'Online';
        // CODE --> ONLINE
        app.online = true;
        setConnected(true);
    }
}

// STATUS ON - OFF Button
status.onclick = function () {
    changeStatus();
};

// Display Game Page and Hide Start Page
function displayGamePage() {
    startSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
}

// Display Start Page and Hide Game Page
function displayStartPage() {
    gameSection.classList.add('hidden');
    startSection.classList.remove('hidden');
}

// TODO: Create View functions

// Reload Start
function renderStart() {
    displayStartPage();
}

// Create History
function renderHistory() {
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const round = document.createElement('th');
    const playerHand = document.createElement('th');
    const systemHand = document.createElement('th');
    const winner = document.createElement('th');

    table.setAttribute('id', 'historyTable');

    round.innerHTML = 'Runde ';
    tr.appendChild(round);
    playerHand.innerHTML = 'Spieler ';
    tr.appendChild(playerHand);
    systemHand.innerHTML = 'Gegner ';
    tr.appendChild(systemHand);
    winner.innerHTML = 'Gewinner ';
    tr.appendChild(winner);

    table.appendChild(tr);
    history.appendChild(table);
    historyTable = document.querySelector('#historyTable');
}
// Clean History
function cleanHistory() {
    historyTable.remove();
}

// Reload Player
function renderPlayer(app) {
}

// Reload Notification of Game
function renderMessage(app) {
    if (!app.finished) {
        messageOutput.innerHTML = '';
        return;
    }

    if (app.winner === PLAYER.None) {
        messageOutput.innerHTML = 'It\'s a draw!';
        return;
    }

    if (app.winner === PLAYER.Player) {
        messageOutput.innerHTML = '<span class="player">You</span> are the winner. Congrats';
    }

    if (app.winner === PLAYER.Computer) {
        messageOutput.innerHTML = 'Sorry. You lost. Try again.';
    }
}

// Reload the full Game
function renderGame(app) {
    displayGamePage();
    renderHistory();
    renderPlayer(app);
    renderMessage(app);
}

// VAR --> Render Pages
const RENDER = {
    [PAGE.START]: renderStart,
    [PAGE.GAME]: renderGame,
};

// Reload currentPage
function renderView(app) {
    RENDER[app.currentPage](app);
}

// TODO: Register Event Handlers

// RESET GAME
function resetGame(app) {
    app.currentPlayer = PLAYER.Player;
    app.finished = false;
    app.winner = PLAYER.Player;
    app.round = 0;
    cleanHistory();
}

// Start Playing: Check Input of Username and set AppState
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = username.value;
    if (user === '') {
        return console.log('Input of Username is empty !!!');
    }
    app.username = username;
    app.currentPage = PAGE.GAME;
    renderView(app);
});

// Return to startPage
backButton.addEventListener('click', (event) => {
    event.preventDefault();
    resetGame(app);
    app.currentPage = PAGE.START;
    renderView(app);
});

// Insert new History
function insertIntoHistory(turn, playerHand, systemHand, winner) {
    const row = historyTable.insertRow();
    const round = row.insertCell(0);
    const hand1 = row.insertCell(1);
    const hand2 = row.insertCell(2);
    const win = row.insertCell(3);

    round.innerHTML = turn;
    hand1.innerHTML = playerHand;
    hand2.innerHTML = systemHand;
    win.innerHTML = winner;
}

function printWinner(hand, didWin) {
    insertIntoHistory(app.round, hand, didWin, app.winner);
    console.log(hand, didWin);
}

// START GAME
function startGame(playerHand) {
    // console.log(name, playerHand);
    app.round++;
    app.winner = evaluateHand(app.username, playerHand, ({
                                                             systemHand,
                                                             gameEval,
                                                         }) => printWinner(playerHand, systemHand, gameEval));
    app.finished = true;
    renderMessage(app);
}

// CHOICE SCISSOR
scissor.onclick = function () {
    startGame(HANDS[0]);
};
// CHOICE STONE
stone.onclick = function () {
    startGame(HANDS[1]);
};

// CHOICE PAPER
paper.onclick = function () {
    startGame(HANDS[2]);
};

renderView(app);
