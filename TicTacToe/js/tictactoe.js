const messageOutput = document.querySelector("#message-output");
const gameboard = document.querySelector("#game-board");
const fields = document.querySelectorAll("#game-board td");
const playButton = document.querySelector("#play");
const resetButton = document.querySelector("#reset");
const loginForm = document.querySelector("#form");
const usernameField = document.querySelector("#form > input");
const gameSection = document.querySelector("#game");
const startSection = document.querySelector("#login");
const backButton = document.querySelector("#back");

console.assert(messageOutput != null);
console.assert(gameboard != null);
console.assert(fields != null);
console.assert(playButton != null);
console.assert(resetButton != null);
console.assert(loginForm != null);
console.assert(usernameField != null);
console.assert(gameSection != null);
console.assert(startSection != null);
console.assert(backButton != null);

/* Helper Functions */
function getEmptyField() {
    return [
            FIELD.Empty, FIELD.Empty, FIELD.Empty,
            FIELD.Empty, FIELD.Empty, FIELD.Empty,
            FIELD.Empty, FIELD.Empty, FIELD.Empty,
        ];
}
function newAppState() {
    return {
        gameState: getEmptyField(),
        winner: PLAYER.Player,
        finished: false,
        username: "",
        currentPage: PAGE.START,
    }
};
function resetGame(app) {
    app.gameState = getEmptyField();
    app.currentPlayer = PLAYER.Player;
    app.finished = false;
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const PAGE = {
    START: 0,
    GAME: 1,
};
const FIELD = {
    Cross: "X",
    Circle: "O",
    Empty: "-",
};
const RENDER_MAP = {
    [PAGE.START]: renderStart,
    [PAGE.GAME]: renderGame,
}
const PLAYER_FIELD_MAP = [FIELD.Cross, FIELD.Circle];
const PLAYER = {
    Player: 0,
    CPU: 1,
    None: 2,
};
const app = newAppState();


/* View / Rendering */
function renderGameboard(app) {
    app.gameState.forEach((element, index) => {
        fields[index].innerHTML = element;
    });
}
function renderPlayer(app) {
}
function renderMessage(app) {
    if (!app.finished) {
        messageOutput.innerHTML = "";
        return;
    }

    if (app.winner === PLAYER.None) {
        messageOutput.innerHTML = "It's a draw!";
        return;
    }

    if (app.winner === PLAYER.Player) {
        messageOutput.innerHTML = "<span class=\"player\">You</span> are the winner. Congrats";
    }

    if (app.winner === PLAYER.CPU) {
        messageOutput.innerHTML = "Sorry. You lost. Try again."
    }
}
function displayGamePage() {
    gameSection.classList.remove("hidden");
    startSection.classList.add("hidden");
}




function displayStartPage() {
    gameSection.classList.add("hidden");
    startSection.classList.remove("hidden");
}
function renderGame(app) {
    displayGamePage();
    renderGameboard(app);
    renderPlayer(app);
    renderMessage(app);
}
function renderStart(app) {
    displayStartPage();
}
function renderView(app) {
    RENDER_MAP[app.currentPage](app);
}

/* Business Logic */
function checkWinConditions(app) {
    // row
    if (app.gameState[0] === app.gameState[1] && app.gameState[1] === app.gameState[2] && app.gameState[0] != FIELD.Empty) return true;
    if (app.gameState[3] === app.gameState[4] && app.gameState[4] === app.gameState[5] && app.gameState[3] != FIELD.Empty) return true;
    if (app.gameState[6] === app.gameState[7] && app.gameState[7] === app.gameState[8] && app.gameState[6] != FIELD.Empty) return true;

    // columns
    if (app.gameState[0] === app.gameState[3] && app.gameState[3] === app.gameState[6] && app.gameState[0] != FIELD.Empty) return true;
    if (app.gameState[1] === app.gameState[4] && app.gameState[4] === app.gameState[7] && app.gameState[1] != FIELD.Empty) return true;
    if (app.gameState[2] === app.gameState[5] && app.gameState[5] === app.gameState[8] && app.gameState[2] != FIELD.Empty) return true;

    // diagonally
    if (app.gameState[0] === app.gameState[4] && app.gameState[4] === app.gameState[8] && app.gameState[0] != FIELD.Empty) return true;
    if (app.gameState[0] === app.gameState[4] && app.gameState[4] === app.gameState[8] && app.gameState[0] != FIELD.Empty) return true;
    if (app.gameState[2] === app.gameState[4] && app.gameState[4] === app.gameState[6] && app.gameState[2] != FIELD.Empty) return true;

    return false;
}
function checkForDraw(app) {
    return app.gameState.filter((element) => element === FIELD.Empty).length === 0;
}
function performPlayerMove(app, fieldIndex) {
    performMove(app, fieldIndex, PLAYER.Player);
}
function performPcMove(app) {
    const emptyFields = Object
        .entries(app.gameState)
        .filter((element) => element[1] === FIELD.Empty);
    if (emptyFields.length === 0) return;

    const index = Math.round(randomNumber(0, emptyFields.length-1));
    const field = emptyFields[index][0];
    performMove(app, field, PLAYER.CPU);
}
function performMove(app, fieldIndex, player) {
    app.gameState[fieldIndex] = PLAYER_FIELD_MAP[player];
}
function runGameRound(app, fieldIndex) {
    performPlayerMove(app, fieldIndex);
    if (checkWinConditions(app)) {
        app.finished = true;
        app.winner = PLAYER.Player;
        return;
    }

    performPcMove(app);
    if (checkWinConditions(app)) {
        app.finished = true;
        app.winner = PLAYER.CPU;
        return;
    }

    if (checkForDraw(app)) {
        app.finished = true;
        app.winner = PLAYER.None;
    }
}

/* Register all event handlers */
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = usernameField.value;
    if (username === "") { return; /* TODO: Error message */}

    app.username = username;
    app.currentPage = PAGE.GAME;
    renderView(app);
});
resetButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetGame(app);
    renderView(app);
});
backButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetGame(app);
    app.currentPage = PAGE.START;
    renderView(app);
});
gameboard.addEventListener("click", (event) => {
    const {field} = event.target.dataset;
    const fieldIndex = parseInt(field);

    if (app.gameState[fieldIndex] !== FIELD.Empty || app.finished) {
        return;
    }

    runGameRound(app, fieldIndex);
    renderView(app);
});

renderView(app);
