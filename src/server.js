// console.log("Running");
const Lissajous = require('./js/Model/LissajousModel');
const CommandSerializer = require('./js/remote/CommandSerializer');

const lissajousCurve = new Lissajous();
const commandSerializer = new CommandSerializer(lissajousCurve);

/// SOCKET.IO + EXPRESS
const app = require('express')();

var connectedCounter = 0;
var clients_connected = [];
var noClientsFlag = true;
// server.listen(8081, '0.0.0.0', () =>{
//     console.log("Server listening on port 8081");
// });

//HTTPS
const fs = require('fs');
const https = require('https');
const { client } = require('websocket');
const options = {
    key: fs.readFileSync('dev.emergences.com.key'),
    cert: fs.readFileSync('dev.emergences.com.crt')
};

var server = https.createServer(options, app);

server.listen(3001, '0.0.0.0', () => {
    console.log("Server listening on port 3001");
});
const io = require('socket.io').listen(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.end("Ciao, dal server");
});

///OSC Connection
// Osc communication
var osc = require("osc");
var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the osc connection
udpPort.open();

// likes array for python
var likesArray = []

io.on('connection', (socket) => {
    noClientsFlag = false;
    alreadyConnected = false;
    console.log('Client connected');
    console.log("noclientsflag: " + noClientsFlag)
    // Assign ID to client connected, clientID is the position of the client in the clients_connected array
    for (i = 0; i < clients_connected.length; i++) {
        if (clients_connected[i] == socket.handshake.address) {
            alreadyConnected = true;
            return;
        }
    }
    if (!alreadyConnected) {
        var inserted = false;
        connectedCounter++;
        for(i = 0; i < clients_connected.length; i++){
            if(clients_connected[i] == null){
                clients_connected[i] = socket.handshake.address;
                inserted = true;
                break;
            }
        }
        if(!inserted){
            clients_connected.push(socket.handshake.address);
        }
        console.log(clients_connected);
    } else {
        console.log("Client is already connected");
    }

    var pos = clients_connected.indexOf(socket.handshake.address);
    io.to(socket.id).emit('client ID', {
        position: pos,
        address: socket.handshake.address,
        lissajous: lissajousCurve,
    });

    // start superCollider oscillator controlled by client ID
    var msg = {
        address: "/button/1",
        args: [
            {
                type: "f",
                value: 1
            },
            {
                type: "i",
                value: pos
            }
        ]
    };
    
    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);


    var terminationCommand = null;

    socket.on('message', function incoming(message) {
        var payload = JSON.parse(message);
        // console.log("Message: \n", payload);
        var serializedCommand = JSON.stringify(payload.command);
        if (payload.type == 'RUN') {
            executeCommand(JSON.parse(serializedCommand));
            // console.log(serializedCommand);
            socket.broadcast.send(serializedCommand);
        } else if (payload.type == 'ON_DISCONNECT') {
            terminationCommand = serializedCommand;
        }
    });

    socket.on('clickedLike', function getLike(message) {
        /// HERE Elaboration of likeing should be made: lissajousCurve contains state of curve at the moment of like.
        // console.log("Lissajous actual state: " + lissajousCurve.fx, +" " + lissajousCurve.fy + " " + lissajousCurve.fz);

        // Build actual state to send to python: {[fx, ax, phx], [fy, ay, phy], [fz, az, phz]}
        var xAxis = [lissajousCurve.fx, lissajousCurve.sizeX, lissajousCurve.phaseX];
        var yAxis = [lissajousCurve.fy, lissajousCurve.sizeY, lissajousCurve.phaseY];
        var zAxis = [lissajousCurve.fz, lissajousCurve.sizeZ, lissajousCurve.phaseZ];

        var status = [xAxis, yAxis, zAxis];
        // EDIT WITH STATUS ARRAY
        likesArray.push([lissajousCurve.fx, lissajousCurve.fy, lissajousCurve.fz])
        console.log(status);
    });

    // Clients should be initialized to actual state

    socket.on('disconnect', function() {
        var pos;
        noClientsFlag = true; 
        for (var i = 0; i < clients_connected.length; i++) {

            if (clients_connected[i] === socket.handshake.address) {
                clients_connected.splice(i, 1, null);
                pos = i;
            } 
            else if(clients_connected[i] != null){
                noClientsFlag = false;
            }
        }

        // stop superCollider oscillator associated to client ID
        if(pos!=null){
            // Osc stop
            var msg = {
                address: "/button/2",
                args: [
                    {
                        type: "f",
                        value: 0
                    },
                    {
                        type: "i",
                        value: pos
                    }
                ]
            };
            
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);
        }

        console.log("Client disconnected");
        console.log(clients_connected);

        if(noClientsFlag){
            //Reset lissajousCurve to initial state
            console.log("Resetting curve");
            lissajousCurve.resetInitialState();
        }

    });
});

function executeCommand(serializedCommand) {
    const command = commandSerializer.deserialize(serializedCommand);
    
    if (command) {
        var type = command.className;
        //If freq command send change freq message to SC
        if(type == 'ChangeFrequencyCommand'){
            // send message
            var msg = {
                address: "/slider/freq",
                args: [
                    {
                        type: "f",
                        value: command.freq
                    },
                    {
                        type: "i",
                        value: command.id
                    }
                ]
            };
            
            // console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);    
        }


        //If amp command send change amp message to SC
        else if(type == 'ChangeAmplitudeCommand'){
            // send message
            var msg = {
                address: "/slider/amp",
                args: [
                    {
                        type: "f",
                        value: command.amp
                    },
                    {
                        type: "i",
                        value: command.id
                    }
                ]
            };
            
            // console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);
        }

        //execute command on server curve
        command.execute();
    } else {
        console.error('Invalid Command', serializedCommand);
    }
}



//// COMMUNICATION WITH PYTHON

function sendToPy(){
    //creates the new likes array every session

var spawn = require('child_process').spawn,
    py    = spawn('python', ['./python_script/compute.py']),
    data = likesArray,
    dataString = '';

    py.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

py.stdout.on('data', function(data){
  dataString += data.toString();
});
py.stdout.on('end', function(){
  console.log('i will perform: ',dataString);
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