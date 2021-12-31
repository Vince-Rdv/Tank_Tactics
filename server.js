var config = {
    "port": 3000
};

// Random libraries
var colors = require('colors'); // Colored console output (colors is not used, require extends the string Prototype)

console.clear();

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
        console.log(output)
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
// Logo on boot in console
console.log("*************************************************************************************\n*        _____                _      _____               _    _                     *\n*       |_   _|              | |    |_   _|             | |  (_)                    *\n*         | |    __ _  _ __  | | __   | |    __ _   ___ | |_  _   ___  ___          *\n*         | |   / _` || '_ \\ | |/ /   | |   / _` | / __|| __|| | / __|/ __|         *\n*         | |  | (_| || | | ||   <    | |  | (_| || (__ | |_ | || (__ \\__ \\         *\n*         \\_/   \\__,_||_| |_||_|\\_\\   \\_/   \\__,_| \\___| \\__||_| \\___||___/         *\n*                                                                                   *\n*                                                                                   *\n*    _   _                   _                 __      _____     _____     _____    *\n*   | | | |                 (_)               /  |    |  _  |   |  _  |   |  _  |   *\n*   | | | |  ___  _ __  ___  _   ___   _ __   `| |    | |/' |   | |/' |   | |/' |   *\n*   | | | | / _ \\| '__|/ __|| | / _ \\ | '_ \\   | |    |  /| |   |  /| |   |  /| |   *\n*   \\ \\_/ /|  __/| |   \\__ \\| || (_) || | | | _| |_ _ \\ |_/ / _ \\ |_/ / _ \\ |_/ /   *\n*    \\___/  \\___||_|   |___/|_| \\___/ |_| |_| \\___/(_) \\___/ (_) \\___/ (_) \\___/    *\n*                                                                                   *\n*************************************************************************************")

vLog("info", "Tank Tactics server starting")

const express = require('express');
const app = express();
const http = require('http');
vLog("info", "Express server booted up")

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
vLog("info", "Socket.io server booted up")

app.use(express.static('public'))
vLog("info", "Changed Express to serve in static mode")

io.on('connection', (socket) => {
    vLog("info", "A new user connected through socket.io")
});

server.listen(config.port, () => {
    vLog("info", "Express listening on port " + config.port)
});