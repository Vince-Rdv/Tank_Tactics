var socket = io();

function setup() {
    createCanvas(1920, 1080);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_id = urlParams.get('id')
    socket.emit('getGamestate', {id: page_id});
}

var gameState = {}
var gameStateDataReceived = false;

socket.on('getGamestateResponse', (res) => {
    gameStateDataReceived = true;
    gameState = res;
    boardWidth = gameState.gameBoard.length;
    boardHeight = gameState.gameBoard[0].length;
});

var boardWidth = 0;
var boardHeight = 0;

function draw() {
    background(51);

    if (gameStateDataReceived) {
        push();
        translate(20, 20)
        fill(80)
        rect(0, 0, width - 40, height - 40)
        for (var x = 0; x < boardWidth; x++) {
            line(Math.round(x * ((width - 40) / boardWidth)), 0, Math.round(x * ((width - 40) / boardWidth)), height - 40)
        }
        for (var y = 0; y < boardHeight; y++) {
            line(0, Math.round(y * ((height - 40) / boardHeight)), width - 40, Math.round(y * ((height - 40) / boardHeight)))
        }

        // line(Math.round(y * ((height - 40) / boardHeight)), 0, Math.round(y * ((height - 40) / boardHeight)), height - 40)
        pop();

    } else {
        textSize(64)
        textAlign(CENTER, CENTER)
        fill(255)
        if (Math.floor(frameCount / 40) % 3 == 0) text("Loading.", width / 2, height / 2)
        if (Math.floor(frameCount / 40) % 3 == 1) text("Loading..", width / 2, height / 2)
        if (Math.floor(frameCount / 40) % 3 == 2) text("Loading...", width / 2, height / 2)
    }
}

function drawPlayerStats(p) {
    var boxHeight = (boardHeight / players.length)
    fill(0)
    textSize(boxHeight / 4)
    text(players[p].name, 8, boxHeight / 4 + 4)
    if (true) { //TODO Create current player setting in player file
        noFill();
        rect(4, 4, ((width - boardWidth - 20 - 40)) - 8, (boardHeight / players.length) - 8)

    }
}

