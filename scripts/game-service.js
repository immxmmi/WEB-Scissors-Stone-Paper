import {Player} from './player.js';

export const computer = document.querySelector('#computer');

// LOCAL RANK DATA
const playerStats = {
    Markus: {
        user: 'Markus',
        win: 4,
        lost: 6,
    },
    Michael: {
        user: 'Michael',
        win: 4,
        lost: 5,
    },
    Lisa: {
        user: 'Lisa',
        win: 2,
        lost: 5,
    },
};

// TIMER
export const DELAY_MS = 1000;

// CONNECTION
let isConnectedState = false;
export function setConnected(newIsConnected) {
    isConnectedState = Boolean(newIsConnected);
}
export function isConnected() {
    return isConnectedState;
}

// HANDS
export const HANDS = ['scissors', 'stone', 'paper', 'fountain', 'match'];

// LIST WITH ALL LOGIC
const evalLookup = {
    scissors: {
        paper: 1,
        match: 1,
        scissors: 0,
        stone: -1,
        fountain: -1,
    },
    stone: {
        scissors: 1,
        match: 1,
        stone: 0,
        paper: -1,
        fountain: -1,
    },
    paper: {
        scissors: -1,
        match: -1,
        paper: 0,
        fountain: 1,
        stone: 1,
    },
    fountain: {
        paper: -1,
        match: -1,
        fountain: 0,
        scissors: 1,
        stone: 1,
    },
    match: {
        scissors: -1,
        stone: -1,
        match: 0,
        paper: 1,
        fountain: 1,
    },
};

// GET LOCAL RANKING
function getRankingsFromPlayerStats() {
    const playerList = Object.values(playerStats);
    let rank = 1;
    const listPlayer = [];
    playerList.sort((a, b) => ((a.win < b.win) ? 1 : -1));

    playerList.forEach((player) => {
        if (listPlayer.length !== 0) {
            if (listPlayer[listPlayer.length - 1].win !== player.win) {
               rank++;
            }
        }
        listPlayer.push(
            new Player(rank, player.user, player.win, player.lost),
        );
    });
    return listPlayer;
}
export function getRankings(rankingsCallbackHandlerFn) {
    const rankingsArray = getRankingsFromPlayerStats();
    setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
}
export function addResultToRanking(playerName, gameResult) {
    // Game is a draw don´t save it in the playerStats
    if (gameResult === 0) {
        return;
    }

    const result = {'-1': 'lost', 1: 'win'};
    const key = result[gameResult];

    // Name is not in the PlayerStats --> Create new One
    if (!(playerName in playerStats)) {
        playerStats[playerName] = {user: playerName, win: 0, lost: 0};
    }
    playerStats[playerName][key] += 1;
}

// Random Hand
function pickHand() {
    return HANDS[Math.floor(Math.random() * HANDS.length)];
}

function getGameEval(playerHand, systemHand) {
    return evalLookup[playerHand][systemHand];
}

export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
    // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
    const systemHand = pickHand();
    const gameEval = getGameEval(playerHand, systemHand);
    addResultToRanking(playerName, gameEval);
    setTimeout(() => gameRecordHandlerCallbackFn({
        playerHand,
        systemHand,
        gameEval,
    }), DELAY_MS);
}
