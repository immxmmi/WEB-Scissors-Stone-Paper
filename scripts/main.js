import {HANDS, isConnected, getRankings, evaluateHand, setConnected} from './game-service.js';
// QUERY SELECTOR
// START
const form = document.querySelector('#form');
const play = document.querySelector('#play');
const highScoreTable = document.querySelector('#highScore');
const status = document.querySelector('#status');
// GAME
const reception = document.querySelector('#reception');
const username = document.querySelector('#username');
const messageOutput = document.querySelector('#message');
const history = document.querySelector('#history');
const startSection = document.querySelector('#start');
const gameSection = document.querySelector('#gameSection');
const backButton = document.querySelector('#back');
// CHOICE
const scissor = document.querySelector('#scissor');
const stone = document.querySelector('#stone');
const paper = document.querySelector('#paper');

// AFTER CREATE
let historyTable = document.querySelector('#historyTable');

// INSERT RANKING in LIST
getRankings((rankings) => rankings.forEach((rankingEntry) => {
    const row = highScoreTable.insertRow();

    switch (rankingEntry.rank) {
        case 1:
            row.setAttribute('class', 'table-success');
            break;
        case rankings.length:
            row.setAttribute('class', 'table-danger');
            break;
        default:
            row.setAttribute('class', 'table-light');
    }

    const rank = row.insertCell(0);
    const name = row.insertCell(1);
    const score = row.insertCell(2);
    rank.innerHTML = rankingEntry.rank;
    name.innerHTML = rankingEntry.name;
    score.innerHTML = rankingEntry.win;
    console.log(rankings.length);
}));

// TODO: How to keep track of App state?

// ENUM: PAGE
const PAGE = {
    START: 0,
    GAME: 1,
};

// ENUM: Player
const PLAYER = {
    Player: -1,
    None: 0, // DRAW
    Computer: 1,
};

// STATE (Local Storage)
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
        status.removeAttribute('class');
        status.setAttribute('class', 'btn btn-danger');
        app.online = false;
        setConnected(false);
    } else {
        status.innerHTML = 'Online';
        status.removeAttribute('class');
        status.setAttribute('class', 'btn btn-success');
        // CODE --> ONLINE
        app.online = true;
        setConnected(true);
    }
}

// STATUS ON - OFF Button
status.onclick = function () {
    changeStatus();
};

let i = 0;
const txt = 'Schnick Schnack Schnuck - davon krieg ich nie genug';

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

// Render The massage
function renderStartMessage() {
    i = 0;
    reception.innerHTML = '';
}

// Reload Start
function renderStart() {
    renderStartMessage();
    displayStartPage();
}

// Create History
function renderHistory() {
    history.innerHTML = '<table id="historyTable" class="table table-dark table-hover"><tr> <th>Runde</th> <th>Spieler</th> <th>Gegner</th><th>Gewiner</th></t></tr></table>';
}

// Clean History
function cleanHistory() {
    if (historyTable !== null) {
        historyTable.remove();
    }
}

// Reload Notification of Game
function renderMessage(appState) {
    if (!appState.finished) {
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
function renderGame(appState) {
    displayGamePage();
    renderHistory();
    renderMessage(appState);
}

// VAR --> Render Pages
const RENDER = {
    [PAGE.START]: renderStart,
    [PAGE.GAME]: renderGame,
};

// Reload currentPage
function renderView(appState) {
    RENDER[app.currentPage](appState);
}

// TODO: Register Event Handlers

// RESET GAME
function resetGame() {
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
        console.log('Input of Username is empty !!!');
        return;
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
function insertIntoHistory(playerHand, systemHand, winner) {
    historyTable = document.querySelector('#historyTable');
    app.round = historyTable.rows.length;
    const row = historyTable.insertRow();
    const round = row.insertCell(0);
    const hand1 = row.insertCell(1);
    const hand2 = row.insertCell(2);
    const win = row.insertCell(3);

    round.innerHTML = app.round;
    hand1.innerHTML = playerHand;
    hand2.innerHTML = systemHand;
    switch (winner) {
        case -1:
            row.setAttribute('class', 'table-success');
            win.innerHTML = 'Winner';
            break;
        case 1:
            row.setAttribute('class', 'table-danger');
            win.innerHTML = 'Loser';
            break;
        default:
            row.setAttribute('class', 'table-light');
            win.innerHTML = 'Gleichstand';
    }
}

function printWinner(hand, didWin) {
    insertIntoHistory(hand, didWin, app.winner);
    console.log(hand, didWin);
}

// START GAME
function startGame(handNumber) {
    // console.log(name, playerHand);
    const playerHand = HANDS[handNumber];
    // eslint-disable-next-line max-len
    app.winner = evaluateHand(app.username, playerHand, (
        {
            systemHand,
            gameEval,
        },
    ) => printWinner(playerHand, systemHand, gameEval));
    app.finished = true;
    renderMessage(app);
}

// CHOICE SCISSOR
scissor.onclick = function () {
    startGame(0);
};

// CHOICE STONE
stone.onclick = function () {
    startGame(1);
};
// CHOICE PAPER
paper.onclick = function () {
    startGame(2);
};

renderView(app);

function typeWriter() {
    if (i < txt.length) {
        reception.innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
    }
}

play.onclick = function () {
    typeWriter();
};
