import {
    HANDS, isConnected, getRankings, evaluateHand, setConnected, DELAY_MS,
} from './game-service.js';
// QUERY SELECTOR

// START
const form = document.getElementById('form');
const play = document.getElementById('play');
const highScoreTable = document.getElementById('highScore');
const status = document.getElementById('status');

// GAME
const reception = document.getElementById('reception');
const username = document.getElementById('username-input');
const displayName = document.getElementById('displayName');
const history = document.getElementById('history');
const startSection = document.getElementById('start');
const gameSection = document.getElementById('gameSection');
const backButton = document.getElementById('back');

// CHOICE
const scissor = document.getElementById('scissor');
const stone = document.getElementById('stone');
const paper = document.getElementById('paper');
const fountain = document.getElementById('fountain');
const match = document.getElementById('match');
const timer = document.getElementById('timer');
const computer = document.getElementById('computer');

// AFTER CREATE
let historyTable = document.getElementById('historyTable');

// INSERT RANKING in LIST
function reloadRanking() {
    highScoreTable.innerHTML = '';
    highScoreTable.innerHTML = '<tr><td>Rank</td><td>Player</td><td>Win</td><td>Lost</td></tr>';
    getRankings((rankings) => rankings.forEach((rankingEntry) => {
        let tableColor;
        if (rankingEntry.rank === 1) {
            tableColor = 'success';
        } else {
            tableColor = 'light';
        }
        highScoreTable.innerHTML += `<tbody class="table-${tableColor}"><td> ${rankingEntry.rank} </td> <td> ${rankingEntry.name}</td><td>${rankingEntry.win}</td><td>${rankingEntry.lost}</td></tbody>`;
    }));
}

// ENUM: PAGE
const PAGE = {
    START: 0, GAME: 1,
};

// ENUM: Player
const PLAYER = {
    Player: 1,
    None: 0, // DRAW
    Computer: -1,
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
        systemChoice: '|?|',
        status: 'light',
    };
}

// INSTANCE of Game
const app = newAppState();



function setComputerChoice() {
    computer.innerHTML = app.systemChoice;
}

function renderComputerChoice() {
    computer.innerHTML = '|?|';
}

// Hide Element
function showElement(element) {
    element.classList.remove('hidden');
}

// Show Element
function hideElement(element) {
    element.classList.add('hidden');
}

// Display Game Page and Hide Start Page
function displayGamePage() {
    displayName.innerHTML = app.username;
    renderComputerChoice();
    hideElement(startSection);
    showElement(gameSection);
}

// Display Start Page and Hide Game Page
function displayStartPage() {
    reloadRanking();
    hideElement(gameSection);
    showElement(startSection);
}

// Render The massage
let letterIndex = 0;

function renderStartMessage() {
    letterIndex = 0;
    reception.innerHTML = '';
}

// Reload Start
function renderStart() {
    renderStartMessage();
    displayStartPage();
    status.disabled = false;
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

// Reload the full Game
function renderGame() {
    displayGamePage();
    renderHistory();
    status.disabled = true;
}

// VAR --> Render Pages
const RENDER = {
    [PAGE.START]: renderStart, [PAGE.GAME]: renderGame,
};

// Reload currentPage
function renderView(appState) {
    RENDER[app.currentPage](appState);
}

// RESET GAME
function resetGame() {
    app.currentPlayer = PLAYER.Player;
    app.finished = false;
    app.winner = PLAYER.Player;
    app.round = 0;
    username.value = '';
    cleanHistory();
}

// Result of Game
function setGameStatus(result) {
    const alert = {'-1': 'danger', 0: 'light', 1: 'success'};
    app.status = alert[result];
}

// Insert new History
function insertIntoHistory(playerHand, systemHand) {
    historyTable = document.querySelector('#historyTable');
    app.round = historyTable.rows.length;
    const notice = {danger: 'Computer', light: 'Draw', success: app.username};
    historyTable.innerHTML += `<tr class="table-${app.status}">
    <td>${app.round}</td>
    <td>${playerHand}</td>
    <td>${systemHand}</td>
    <td>${notice[app.status]}</td>
  </tr>`;
}

// DISABLE BUTTONS
function disableGameButtons() {
    scissor.disabled = true;
    stone.disabled = true;
    paper.disabled = true;
    fountain.disabled = true;
    match.disabled = true;
}

// ENABLE BUTTONS
function enableGameButtons() {
    scissor.disabled = false;
    stone.disabled = false;
    paper.disabled = false;
    fountain.disabled = false;
    match.disabled = false;
}

function loadGame(handNumber) {
    const playerHand = HANDS[handNumber];
    app.finished = true;
    evaluateHand(app.username, playerHand, ({systemHand, gameEval}) => {
        app.winner = gameEval;
        app.systemChoice = systemHand;
        setComputerChoice();
        setGameStatus(app.winner);
        insertIntoHistory(playerHand, systemHand, app.winner);
    });
}

// START GAME
function startGame(handNumber) {
    app.finished = false;
    disableGameButtons();
    let count = 3;
    loadGame(handNumber);
    const countdown = setInterval(() => {
        if (count < 0) {
            clearInterval(countdown);
            enableGameButtons();
        } else {
            timer.innerText = `Nächste Runde startet in ${count} Sekunden`;
            count--;
        }
    }, DELAY_MS);
}

// Auto Type Title
const txt = 'Schnick Schnack Schnuck - davon krieg ich nie genug';

function typeWriter() {
    if (letterIndex < txt.length) {
        reception.innerHTML += txt.charAt(letterIndex);
        letterIndex++;
        setTimeout(typeWriter, 80);
    }
}

// Change Online Status
function changeStatus() {
    if (isConnected()) {
        status.innerHTML = 'Offline';
        status.removeAttribute('class');
        status.setAttribute('class', 'btn btn-danger');
        app.online = false;
        setConnected(false);
        reloadRanking();
    } else {
        status.innerHTML = 'Online';
        status.removeAttribute('class');
        status.setAttribute('class', 'btn btn-success');
        // CODE --> ONLINE
        app.online = true;
        setConnected(true);
        reloadRanking();
    }
}
// EventListener

// STATUS ON - OFF Button
status.addEventListener('click', () => {
    changeStatus();
});
// Start Playing: Check Input of Username and set AppState
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = username.value;
    app.username = user;
    app.currentPage = PAGE.GAME;
    renderView(app);
});
// Start Playing
play.addEventListener('click', () => {
    typeWriter();
});
// CHOICE SCISSOR
scissor.addEventListener('click', () => {
    startGame(0);
});
// CHOICE STONE
stone.addEventListener('click', () => {
    startGame(1);
});
// CHOICE PAPER
paper.addEventListener('click', () => {
    startGame(2);
});
// CHOICE FOUNTAIN
fountain.addEventListener('click', () => {
    startGame(3);
});
// CHOICE MATCH
match.addEventListener('click', () => {
    startGame(4);
});
// Return to startPage
backButton.addEventListener('click', (event) => {
    event.preventDefault();
    resetGame(app);
    app.currentPage = PAGE.START;;
    renderView(app);
});

renderView(app);
