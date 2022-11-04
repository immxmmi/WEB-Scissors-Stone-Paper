/*
 * You are allowed to change the code here.
 * However, you are not allowed to change the signature of the exported functions and objects.
 */
const computer = document.querySelector('#computer');

// Player Class
class Player {
    constructor(rank, name, win) {
        this.rank = rank;
        this.name = name;
        this.win = win;
    }
}

// LOCAL RANK DATA
const playerStats = {
    Markus: {
        user: 'Markus',
        win: 4,
        lost: 6,
    },
    Michael: {
        user: 'Michael',
        win: 3,
        lost: 5,
    },
    Lisa: {
        user: 'Lisa',
        win: 2,
        lost: 5,
    },
};

// TIMER
const DELAY_MS = 1000;

// CONNECTION
let isConnectedState = false;

export function setConnected(newIsConnected) {
    isConnectedState = Boolean(newIsConnected);
}

export function isConnected() {
    return isConnectedState;
}

// HANDS
export const HANDS = ['scissors', 'stone', 'paper'];

// LOGIC
const evalLookup = {
    scissors: {
        paper: -1,
        scissors: 0,
        stone: 1,
    },
    stone: {
        scissors: -1,
        stone: 0,
        paper: 1,
    },
    paper: {
        stone: -1,
        paper: 0,
        scissors: 1,
    },
};

function getGameEval(playerHand, systemHand) {
    return evalLookup[playerHand][systemHand];
}

// GET LOCAL RANKING
function getRankingsFromPlayerStats() {
    const list = Object.values(playerStats);
    let rank = 1;
    const listPlayer = [];
    list.sort((a, b) => ((a.win < b.win) ? 1 : -1));
    list.forEach((player) => listPlayer.push(new Player(rank++, player.user, player.win)));
    return listPlayer;
}

export function getRankings(rankingsCallbackHandlerFn) {
    const rankingsArray = getRankingsFromPlayerStats();
    setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
}

// Random Hand
function pickHand() {
    const handIndex = Math.floor(Math.random() * 3);
    return HANDS[handIndex];
}

export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
    // TODO: Replace calculation of didWin and update rankings while doing so. ??

    // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
    const systemHand = pickHand();
    const gameEval = Math.floor(Math.random() * 3) - 1; // eval and hand do not match yet ->//
    computer.innerHTML = systemHand;

    // TODO

    console.log('GAME: ', getGameEval(playerHand, systemHand));

    setTimeout(() => gameRecordHandlerCallbackFn({
        playerHand,
        systemHand,
        gameEval,
    }), DELAY_MS);
}
