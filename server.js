var config = {
    "port": 3000
};

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

vLog("log", "Tank Tactics server starting")
// Express Setup
const express = require('express');
const app = express();
const http = require('http');
vLog("log", "Express server booted up")

// Socket.io Setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
vLog("log", "Socket.io server booted up")

// Discord.js Setup
var token = "NDM3NjY2MjExMTQ5NTEyNzE0.WtzGbA.gLgTfL5XGtF8biYI6V-9GS7ntKM"

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] }); //create new client

app.use(express.static('public'))
vLog("log", "Changed Express to serve in static mode")

// Socket.io Run
io.on('connection', (socket) => {
    vLog("log", "A new user connected through socket.io")

    socket.on("getGamestate", (res) => { // Board information
        vLog("player", "Player " + playerNames[res.id] + " has requested the game state");
        var gameState = {
            "players": playerList,
            "gameBoard": gameBoard
        }
        socket.emit("getGamestateResponse", gameState)
    });
});
// Express Run
server.listen(config.port, () => {
    vLog("info", "Express listening on port " + config.port)
});

// Discord.js Run
client.once('ready', () => {
    vLog("info", "Discord logged in")
});

client.on('messageCreate', function(msg){
    console.log(msg)
    if(msg.content == "register"){
        msg.reply('Hello ' + msg.author.username + '. I have just registered you for this round of Tank Tac Toe. Once the game starts you will receive a private message from me');
        playerList.push(createPlayer(createID(), msg.author.username, 0, 0))
    }
});

client.login(token)



var playerNames = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-Ray", "Yankee", "Zulu"]

var gameBoard = [];
var playerList = [];

/**
 * This function boots up all functions to setup before the game 
 * @method
 * @param {number} boardWidth Board width in tiles
 * @param {number} boardHeight Board height in tiles
 * @param {number} players Amount of players in the game
 * @param {*} options Other options 
 */
function initGame(boardWidth = 10, boardHeight = 10, players = 4, options = {}) {
    vLog("info", "Board creation started")
    gameBoard = createBoard(boardWidth, boardHeight)
}

/**
 * Create the board array
 * @method
 * @param {number} boardWidth Board width in tiles
 * @param {number} boardHeight Board height in tiles
 * @returns Array of board
 */
function createBoard(boardWidth, boardHeight) {
    var temp = [];
    for (var x = 0; x < boardWidth; x++) {
        temp[x] = []
        for (var y = 0; y < boardHeight; y++) {
            temp[x][y] = Math.ceil(Math.random() * 50)
        }
    }
    return temp
}

/**
 * Create a player object
 * @method
 * @param {number} id 
 * @param {string} name 
 * @param {number} x 
 * @param {number} y 
 * @param {*} options 
 * @returns Player object
 */
function createPlayer(id, name, x = 0, y = 0, options = {}) {
    var temp = {
        x: x,
        y: y,
        id: id,
        health: 3,
        actionPoints: 3,
        shootRange: 3,
        options: options
    }
    return temp
}
var tempH = 20;
var tempW = Math.floor(tempH * 1.80769230769)
initGame(tempW, tempH, 10);

function createID(){
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    var randomID = "";
    for(var x = 0; x < 64; x++){
        randomID += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return randomID
}