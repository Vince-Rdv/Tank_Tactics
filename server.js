const serverConfig = require('./config')


// Random libraries
var colors = require('colors'); // Colored console output (colors is not used, require extends the string Prototype)
console.clear();
var simpleLog = false; //Don't log linenumber and time
function vLog(type, message) {

    var succes = true;

    //Create an error, so that line numbers etc can be found
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(e.stack.split("\n")[2]);
    lineNumber = {
        filepath: match[1],
        line: match[2],
        column: match[3]
    };

    //Get current time formatted
    var currentTime = new Date();
    var h = currentTime.getHours().toString();
    var m = currentTime.getMinutes().toString();
    var s = currentTime.getSeconds().toString();
    var ms = currentTime.getMilliseconds().toString();

    //Add leading zero's
    if (s.length < 2) { s = "0" + s }
    if (m.length < 2) { m = "0" + m }
    if (h.length < 2) { h = "0" + h }

    if (ms.length < 2) { ms = "0" + ms }
    if (ms.length < 3) { ms = "0" + ms }

    var output = ""
    if (lineNumber.line < 10000) { output += ("0").gray }
    if (lineNumber.line < 1000) { output += ("0").gray }
    if (lineNumber.line < 100) { output += ("0").gray }
    if (lineNumber.line < 10) { output += ("0").gray }
    output += (lineNumber.line + " ").gray;

    output += h + ":" + m + ":" + s + ":" + ms + " ";

    // Add color to message type
    if (type == "log") { output += "[" + (type).gray + "]     " }
    else if (type == "info") { output += "[" + (type).white + "]    " }
    else if (type == "player") { output += "[" + (type).green + "]  " }
    else if (type == "warning") { output += ("[" + type + "]").bgYellow.black + " " }
    else if (type == "error") { output += ("[" + type + "]").bgRed.white + "   " }
    else if (type == "debug") { output += "[" + (type).brightBlue + "]   " }
    else {
        succes = false; //If non existent type is found, set succes to false
    }

    output += message

    if (succes) {
        if (simpleLog) {
            console.log(message)
        } else {
            console.log(output)
        }
    } else {
        //Incorrect log type
        console.log(("Warning, incorrect type logged at " + lineNumber.line).bgRed.white)
        console.log(message)
        var temp = ""
        for (var x = 0; x < lineNumber.line.length; x++) {
            temp += "-"
        }
        console.log(("----------------------------------" + temp).bgRed.white)
    }

}

vLog("info", "Tank Tactics server starting")
// Express Setup
const express = require('express');
const app = express();
const http = require('http');
vLog("log", "Express server booted up");

// Socket.io Setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
vLog("log", "Socket.io server booted up"); 

// Discord.js Setup
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] }); //create new client

app.use(express.static('public'))
vLog("log", "Changed Express to serve in static mode");

// Socket.io Run
io.on('connection', (socket) => {
    vLog("log", "A new user connected through socket.io")

    socket.on("getGamestate", (res) => { // Board information
        // vLog("player", "Player " + playerList[res.id].name + " has requested the game state");
        // vLog("player", "Player " + playerList[0].name + " has requested the game state"); //TODO Remove on release
        socket.emit("getGamestateResponse", gameState)
    });
});
// Express Run
server.listen(serverConfig.port, () => {
    vLog("log", "Express listening on port " + serverConfig.port);
});

// Discord.js Run
client.once('ready', () => {
    vLog("log", "Discord logged in");
});

client.on('messageCreate', function(msg){
    console.log(msg)
    if(msg.content == "register"){
        msg.reply('Hello ' + msg.author.username + '. I have just registered you for this round of Tank Tac Toe. Once the game starts you will receive a private message from me');
        playerList.push(createPlayer(createID(), msg.author.username, 0, 0))
    }
});

client.login(serverConfig.discordToken)

var gameConfig = {
    "boardWidth": 30,
    "boardHeight": 30
}
vLog("info", "Setting up gamestates")
vLog("info", "Set up board with a size of " + gameConfig.boardWidth + " by " + gameConfig.boardHeight)

var gameState = {
    "board": [],
    "players": [],
    "license": "",
    "setup": new Date()
}
for(var x = 0; x < gameConfig.boardWidth; x++){
    gameState.board[x] = []
    for(var y = 0; y < gameConfig.boardHeight; y++){
        gameState.board[x][y] = 0
    }
}

gameState.players.push(new Player(0, "TankTest1", 10, 10));
gameState.players.push(new Player(0, "TankTest2", 20, 10));
gameState.players.push(new Player(0, "TankTest3", 10, 20));
gameState.players.push(new Player(0, "TankTest4", 20, 20));

function Player(id,playerName,posX,posY){
    this.x = posX;
    this.y = posY;
    this.name = playerName;
    this.id = id;
}