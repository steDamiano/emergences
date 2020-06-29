/*
const Lissajous = require('./js/Model/LissajousModel');
const CommandSerializer = require('./js/remote/CommandSerializer');

const lissajousCurve = new Lissajous();
const commandSerializer = new CommandSerializer(lissajousCurve);

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8081});
var nextId = 0;
console.log("Running server");

wss.on('connection', function connection(ws) {
    console.log(wss.clients.length);
    ws._socket.setKeepAlive(true);

    var connectionId = nextId++;
    var terminationCommand = null;
    // wss.clients[wss.clients.length - 1].connectionId = connectionId;

    ws.on('message', function incoming(message){
        console.log("Message")
        var payload = JSON.parse(message);
        var serializedCommand = JSON.stringify(payload.command);

        if(payload.type == 'ON_DISCONNECT'){
            terminationCommand = serializedCommand;
        }
    });

    ws.on('close', function disconnect(){
        if(terminationCommand){
            broadcast(terminationCommand);
        }
    });

    function broadcast(serializedCommand){
        executeCommand(JSON.parse(serializedCommand));
        wss.clients.forEach(function each(client){
            if(client.connectionId != connectionId){
                client.send(serializedCommand);
            }
        });
    }
    //
    // for(const command of getInitCommands()){
    //     const serializedCommand = JSON.stringify(command);
    //     ws.send(serializedCommand);
    // }
    
});

function executeCommand(serializedCommand){
    const command = commandSerializer.deserialize(serializedCommand);

    if(command){
        command.execute();
    }
    else{
        console.error('Invalid Command', serializedCommand);
    }
}

function getInitCommands(){
    // Do we need it?
}
*/

var likesArray = []

/// SOCKET.IO + EXPRESS
// console.log("Running");
const Lissajous = require('./js/Model/LissajousModel');
const CommandSerializer = require('./js/remote/CommandSerializer');

const lissajousCurve = new Lissajous();
const commandSerializer = new CommandSerializer(lissajousCurve);


const app = require('express')();
// const server = require('http').createServer(app);

var connectedCounter = 0;
var clients_connected = [];
// server.listen(8081, '0.0.0.0', () =>{
//     console.log("Server listening on port 8081");
// });

//HTTPS
const fs = require('fs');
const https = require('https');
const options = {
    key: fs.readFileSync('dev.emergences.com.key'),
    cert: fs.readFileSync('dev.emergences.com.crt')
};

var server = https.createServer(options, app);

server.listen(3001, '0.0.0.0', () =>{
    console.log("Server listening on port 3001");
});
const io = require('socket.io').listen(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.end("Ciao, dal server");
});

io.on('connection', (socket) =>{
    alreadyConnected = false;
    console.log('Client connected');
    // Assign ID to client connected
    for(i = 0; i < clients_connected.length; i++){
        if(clients_connected[i] == socket.handshake.address){
            alreadyConnected = true;
        }
    }
    if(!alreadyConnected){
        connectedCounter++;
        clients_connected.push(socket.handshake.address);
        console.log(clients_connected);
    } else {
        console.log("Client is already connected");
    }
    
    var pos = clients_connected.indexOf(socket.handshake.address);
    io.to(socket.id).emit('client ID', {position: pos, address: socket.handshake.address});

    var terminationCommand = null;

    socket.on('message', function incoming(message){
        var payload = JSON.parse(message);
        // console.log("Message: \n", payload);
        var serializedCommand = JSON.stringify(payload.command);
        if(payload.type == 'RUN'){
            executeCommand(JSON.parse(serializedCommand));
            // console.log(serializedCommand);
            socket.broadcast.send(serializedCommand);
        }
        else if(payload.type == 'ON_DISCONNECT'){
            terminationCommand = serializedCommand;
        }
    });

    socket.on('clickedLike', function getLike(message){
        /// HERE Elaboration of likeing should be made: lissajousCurve contains state of curve at the moment of like.
        console.log("Lissajous actual state: " + lissajousCurve.fx, +" " +lissajousCurve.fy+" "+lissajousCurve.fz);

        // stores the likes in the array to later send them to Python
        likesArray.push([lissajousCurve.fx, lissajousCurve.fy, lissajousCurve.fz])
    });

    // Clients should be initialized to actual state

    socket.on('disconnect', function(){
        var pos;
        for( var i = 0; i < clients_connected.length; i++){ 
            if ( clients_connected[i] === socket.handshake.address) {
              clients_connected.splice(i, 1); 
              pos = i;
            }
        }
        console.log("Client disconnected");
        console.log(clients_connected);
    });
});

function executeCommand(serializedCommand){
    const command = commandSerializer.deserialize(serializedCommand);

    if(command){
        command.execute();
    }
    else{
        console.error('Invalid Command', serializedCommand);
    }
}




//// COMMUNICATION WITH PYTHON

function sendToPy(){
    //creates the new likes array every session

var spawn = require('child_process').spawn,
    py    = spawn('python', ['./python_script/compute.py']),
    data = likesArray,
    //data = [1,2,3,4,5,6,7,8,9]
    dataString = '';

    py.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

py.stdout.on('data', function(data){
  dataString += data.toString();
});
py.stdout.on('end', function(){
  console.log('i am (not) going to arpeggiate: ',dataString);
});


    py.stdin.write(JSON.stringify(data));
    py.stdin.end();
    askPython();
    likesArray = [];
}

// recursive function, it's asking python every tot ms
function askPython(){
    setTimeout(sendToPy, 10000); // ms of the repetition 
}

askPython()