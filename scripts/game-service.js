import {Player} from './player.js';

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
export const HANDS = ['Schere', 'Stein', 'Papier', 'Brunnen', 'Streichholz'];

// Random Hand
function pickHand() {
    return HANDS[Math.floor(Math.random() * HANDS.length)];
}

// List of the Rules
const evalLookup = {
    Schere: {
        Papier: 1,
        Streichholz: 1,
        Schere: 0,
        Stein: -1,
        Brunnen: -1,
    },
    Stein: {
        Schere: 1,
        Streichholz: 1,
        Stein: 0,
        Papier: -1,
        Brunnen: -1,
    },
    Papier: {
        Schere: -1,
        Streichholz: -1,
        Papier: 0,
        Brunnen: 1,
        Stein: 1,
    },
    Brunnen: {
        Papier: -1,
        Streichholz: -1,
        Brunnen: 0,
        Schere: 1,
        Stein: 1,
    },
    Streichholz: {
        Schere: -1,
        Stein: -1,
        Streichholz: 0,
        Papier: 1,
        Brunnen: 1,
    },
};

// Game Value
function getGameEval(playerHand, systemHand) {
    return evalLookup[playerHand][systemHand];
}
function sortPlayerList(playerList) {
    return playerList.sort((a, b) => ((a.win < b.win) ? 1 : -1));
}
function getRightRank(currentRank, currentLustPlayer, win) {
    let rank = currentRank;
    if (currentLustPlayer.length !== 0) {
        if (currentLustPlayer[currentLustPlayer.length - 1].win !== win) {
            rank++;
        }
    }
    return rank;
}

// Get Ranking List Local
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

function getRankingFromLocal() {
    // offline
    let playerList = Object.values(playerStats);
    let rank = 1;
    const listPlayer = [];
    playerList = sortPlayerList(playerList);
    playerList.forEach((player) => {
        rank = getRightRank(rank, listPlayer, player.win);
        listPlayer.push(new Player(rank, player.user, player.win, player.lost));
    });
    return listPlayer;
}

export function addResultToRanking(playerName, gameResult) {
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

// Get Data form The Server
function getGameDataFromServer(playerName, playerHand) {
    const params = {
        playerName,
        playerHand,
    };
    const query = Object.keys(params)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');

    const url = `https://stone.sifs0005.infs.ch/play?${query}`;

    return fetch(url);
}

function getRankingFromServer() {
    const url = 'https://stone.sifs0005.infs.ch/ranking';
    const listPlayer = [];
    let playerList;
    let rank = 1;
    fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((json) => {
            playerList = Object.values(json);
            playerList = sortPlayerList(playerList);
            playerList.forEach((player) => {
                rank = getRightRank(rank, listPlayer, player.win);
                if (!player.user.includes('<')) {
                    listPlayer.push(
                        new Player(rank, player.user, player.win, player.lost),
                    );
                }
            });
        });
    return listPlayer;
}

// Ranking Handler (Local or Server)
export function getRankings(rankingsCallbackHandlerFn) {
    let rankingsArray;
    if (isConnected()) {
        rankingsArray = getRankingFromServer();
    } else {
        rankingsArray = getRankingFromLocal();
    }
    setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
}

// Game Handler (Local or Server)
export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
    const gameValue = {true: 1, false: '-1', draw: 0};
    let systemHand;
    let gameEval;
    if (isConnected()) {
        getGameDataFromServer(playerName, playerHand).then((data) => data.json())
            .then((json) => {
                systemHand = json.choice;
                if (json.choice === playerHand) {
                    gameEval = gameValue.draw;
                } else {
                    gameEval = gameValue[json.win];
                }
            });
    } else {
        systemHand = pickHand();
        gameEval = getGameEval(playerHand, systemHand);
    }
    addResultToRanking(playerName, gameEval);
    setTimeout(() => gameRecordHandlerCallbackFn({
        playerHand,
        systemHand,
        gameEval,
    }), DELAY_MS);
}
