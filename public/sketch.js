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
    gameState = res
    gameStateDataReceived = true;
    boardWidth = gameState.board.length;
    boardHeight = gameState.board[0].length
});

var boardWidth = 0;
var boardHeight = 0;

function draw() {
    background(51);

    if (gameStateDataReceived) {
        //Draw board
        push();
        translate(40, 40)
        fill(80)
        rect(0, 0, 1000, 1000)
        var temp = 1000 / boardWidth
        for (var x = 0; x < boardWidth; x++) {
            line(0, Math.floor(x*temp), 1000, Math.floor(x*temp))
            line(Math.floor(x*temp), 0, Math.floor(x*temp), 1000)
        }
        
        //Draw players
        for (var x = 0; x < gameState.players.length; x++) {
            fill(255)
            rect(gameState.players[x].x*temp,gameState.players[x].y*temp,temp, temp)
        }
        
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

