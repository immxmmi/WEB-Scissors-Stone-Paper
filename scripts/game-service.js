import {Player} from './player.js';

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
export const HANDS = ['Schere', 'Stein', 'Papier', 'Brunnen', 'Streichholz'];

// LIST WITH ALL LOGIC
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


// Get Anser form Server
function getGameFromServer(playerName, playerHand) {
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

function getRangingFromServer() {
    const url = 'https://stone.sifs0005.infs.ch/ranking';
    const listPlayer = [];
    let playerList;
    fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((json) => {
            playerList = Object.values(json);
            let rank = 1;
            playerList.sort((a, b) => ((a.win < b.win) ? 1 : -1));
            playerList.forEach((player) => {
                if (listPlayer.length !== 0) {
                    if (listPlayer[listPlayer.length - 1].win !== player.win) {
                        rank++;
                    }
                }
                if (player.win > 2) {
                    listPlayer.push(
                        new Player(rank, player.user, player.win, player.lost),
                    );
                }
            });
        });
    return listPlayer;
}

// GET LOCAL RANKING
function getRangingFromLocal() {
    // offline
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
    let rankingsArray;
    if (isConnected()) {
        rankingsArray = getRangingFromServer();
    } else {
        rankingsArray = getRangingFromLocal();
    }
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
    const gameValue = {true: 1, false: '-1', draw: 0};
    let systemHand;
    let gameEval;
    if (isConnected()) {
        getGameFromServer(playerName, playerHand).then((data) => data.json())
            .then((json) => {
                systemHand = json.choice;
                if (json.choice !== playerHand) {
                    gameEval = gameValue[json.win];
                } else {
                    gameEval = gameValue.draw;
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
