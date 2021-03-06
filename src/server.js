const Lissajous = require('./js/Model/LissajousModel');
const CommandSerializer = require('./js/remote/CommandSerializer');

const ChangeFrequencyCommand = require('./js/Command/ChangeFrequencyCommand');
const ChangeAmplitudeCommand = require('./js/Command/ChangeAmplitudeCommand');
const ChangePhaseCommand = require('./js/Command/ChangePhaseCommand');
const { serialize } = require('v8');
const { count } = require('console');
const { exec } = require('child_process');

const lissajousCurve = new Lissajous();
const commandSerializer = new CommandSerializer(lissajousCurve);

/// SOCKET.IO + EXPRESS
const app = require('express')();

var connectedCounter = 0;
var clients_connected = [];
var noClientsFlag = true;

var time = 120;
var reset = false;
var state = 0;

// Parameters for automatic evolution
var numberOfRepresentedFigures = 0;
var statusTable = [];

function secondPassed() {

    if (time == 0 && reset == false) {
        //CONTROLS OFF
        time = 120;
        reset = !reset;
        state = 1;
        sendToPy();

        shoot()
    } else if (time == 0 && reset == true) {
        //CONTROLS ON
        time = 180;
        reset = !reset;
        state = 0;
        shoot()
    } else {
        time--;
        if (reset == true) {
            switch (time) {
                case 120:
                    state = 1;
                    break;
                case 90:
                    state = 2;
                    break;
                case 60:
                    state = 3;
                    break;
                case 30:
                    state = 4;
                    break;
            }
        } else {
            state = 0;
        }
        shoot()
    }
}
setInterval(secondPassed, 1000);

function shoot() {
    io.emit('Time', {
        time: time,
        reset: reset,
        state: state
    });
}

//HTTPS server setup
const fs = require('fs');
const https = require('https');
const {
    client
} = require('websocket');
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
});

///OSC Connection
// Osc communication setup
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
    // Assign ID to client connected, clientID is the position of the client in the clients_connected array
    for (i = 0; i < clients_connected.length; i++) {
        if (clients_connected[i] == socket.handshake.address) {
            alreadyConnected = true;
        }
    }

    if (!alreadyConnected) {
        var inserted = false;
        connectedCounter++;
        for (i = 0; i < clients_connected.length; i++) {
            if (clients_connected[i] == null) {
                clients_connected[i] = socket.handshake.address;
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            clients_connected.push(socket.handshake.address);
        }
        console.log(clients_connected);
    } else {
        console.log("Client is already connected");
    }

    var pos = clients_connected.indexOf(socket.handshake.address);

    // Client ID is used to identify client and send right commands to SC
    io.to(socket.id).emit('client ID', {
        position: pos,
        address: socket.handshake.address,
        lissajous: lissajousCurve,
    });

    // Get initial frequency of client, and send it to supercollider synth
    socket.on('InitialFreq', function getFreq(freq) {

        // Only first three users can control audio, others are just spectators who can put like
        if (pos < 3) {
            var msg = {
                address: "/button/1",
                args: [{
                        type: "f",
                        value: 1
                    },
                    {
                        type: "i",
                        value: pos
                    },
                    {
                        type: "i",
                        value: freq
                    }
                ]
            };
            // start superCollider oscillator controlled by client ID
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);

        }

    });

    io.to(socket.id).emit('Ispector', {
        position: pos,
        address: socket.handshake.address
    });

    var terminationCommand = null;

    // Evaluation of commands received by clients
    socket.on('message', function incoming(message) {
        var payload = JSON.parse(message);
        var serializedCommand = JSON.stringify(payload.command);
        // If command acts on curve execute it on server model and broadcast it to other clients
        if (payload.type == 'RUN') {
            executeCommand(JSON.parse(serializedCommand));
            socket.broadcast.send(serializedCommand);
        } else if (payload.type == 'ON_DISCONNECT') {
            terminationCommand = serializedCommand;
        }
    });

    socket.on('clickedLike', function getLike(message) {
        // Build actual status to send to python: {[fx, ax, phx], [fy, ay, phy], [fz, az, phz]}
        var xAxis = [lissajousCurve.fx, lissajousCurve.sizeX, lissajousCurve.phaseX];
        var yAxis = [lissajousCurve.fy, lissajousCurve.sizeY, lissajousCurve.phaseY];
        var zAxis = [lissajousCurve.fz, lissajousCurve.sizeZ, lissajousCurve.phaseZ];

        var status = [xAxis, yAxis, zAxis];
        // Liked status is pushed in the array of liked curves which will be used by python
        likesArray.push(status)
    });

    socket.on('disconnect', function() {
        var pos;
        noClientsFlag = true;
        for (var i = 0; i < clients_connected.length; i++) {

            if (clients_connected[i] === socket.handshake.address) {
                clients_connected.splice(i, 1, null);
                pos = i;
            } else if (clients_connected[i] != null) {
                noClientsFlag = false;
            }
        }

        // stop superCollider oscillator associated to client ID, only first 3 clients have active synth
        if (pos != null && pos < 3) {
            // Osc stop
            var msg = {
                address: "/button/2",
                args: [{
                        type: "f",
                        value: 0
                    },
                    {
                        type: "i",
                        value: pos
                    }
                ]
            };

            // console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);
        }

        console.log("Client disconnected");
        console.log(clients_connected);

        // if noClientsFlag everyone has disconnected so initial status should be reset for new performance
        if (noClientsFlag) {
            //Reset lissajousCurve to initial state
            console.log("Resetting curve");
            lissajousCurve.resetInitialState();
        }

    });
});

// Server executes commands received by clients on its own model, to keep updated with changes and sync clients
function executeCommand(serializedCommand) {
    const command = commandSerializer.deserialize(serializedCommand);

    if (command) {
        var type = command.className;
        //If freqChange command send change freq message to SC
        if (type == 'ChangeFrequencyCommand') {
            // send message
            var msg = {
                address: "/slider/freq",
                args: [{
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


        //If ampChange command send change amp message to SC
        else if (type == 'ChangeAmplitudeCommand') {
            // send message
            var msg = {
                address: "/slider/amp",
                args: [{
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

        // If phaseChange command send change phase message to SC
        else if (type == 'ChangePhaseCommand'){
            var msg = {
                address: "/slider/phase",
                args: [{
                        type: "i",
                        value: command.phase
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


/*  Automatic sequence: python curves are saved in statusTable with corresponding representation time
*   automaticSequence is called numberOfRepresentedFigures times and each time a new figure is shown
*/

// Count how many times the callback for automatic generation has been made 
var countCalls = -1;

function automaticSequence() {
    countCalls++;
    if(countCalls < numberOfRepresentedFigures){
        console.log("Represent figure: ", countCalls);
        // Freq Changes
        io.send(JSON.stringify(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][3], 1))));
        executeCommand(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][3], 1)));
        
        io.send(JSON.stringify(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][0], 0))));
        executeCommand(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][0], 0)));

        io.send(JSON.stringify(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][6], 2))));
        executeCommand(commandSerializer.serialize(new ChangeFrequencyCommand(lissajousCurve, statusTable[countCalls][6], 2)));
        // Amplitude Changes (Math.min used to double check output amplitude to avoid damages to speakers)
        io.send(JSON.stringify(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][1], 0.1), 0))));
        executeCommand(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][1], 0.1), 0)));

        io.send(JSON.stringify(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][4], 0.1), 1))));
        executeCommand(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][4], 0.1), 1)));

        io.send(JSON.stringify(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][7], 0.1), 2))));
        executeCommand(commandSerializer.serialize(new ChangeAmplitudeCommand(lissajousCurve, Math.min(statusTable[countCalls][7], 0.1), 2)));

        // Phase Changes
        io.send(JSON.stringify(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][2], 0))));
        executeCommand(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][2], 0)));

        io.send(JSON.stringify(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][5], 1))));
        executeCommand(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][5], 1)));

        io.send(JSON.stringify(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][8], 2))));
        executeCommand(commandSerializer.serialize(new ChangePhaseCommand(lissajousCurve, statusTable[countCalls][8], 2)));

    }
    else{
        // All figures represented, quit
        console.log("Quit performance");
        countCalls = -1;
        return;
    }

    if(state == 0){
        // Reset if automatic sequence stage is over
        countCalls = -1;
        return;
    }
    setTimeout(automaticSequence, statusTable[countCalls][9] * 1000);
}



//// COMMUNICATION WITH PYTHON

function sendToPy() {
    //creates the new likes array every session
    console.log("Sending likes to python");

    var spawn = require('child_process').spawn,
        py = spawn('python', ['./python_script/compute.py']),
        data = likesArray,
        dataString = '';

    py.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    py.stdout.on('data', function(data) {
        dataString += data.toString();
    });
    py.stdout.on('end', function() {
        console.log('i will perform: ', dataString);

        //Regular expression to extract floating point numbers from the string built in python
        var regex = /[+-]?\d+(\.\d+)?/g;
        status = new Array(10)
        if (dataString != '') {
            statusTable = []
            floats = dataString.match(regex).map(function(v) { return parseFloat(v) });
            //Values should be saved in arrays that represent status of the curve and time
            for (i = 0; i < floats.length / 10; i++) {
                var status = []
                    //Collect 10 values at a time that form a status + relative representation tima
                for (j = 0; j < 10; j++) {
                    status[j] = floats[10 * i + j];
                }
                //save status in table
                statusTable.push(status)
            }

            // console.log("Status table: ", statusTable)
            numberOfRepresentedFigures = floats.length / 10;
            console.log("Data received from python, starting sequence. I will draw: ", numberOfRepresentedFigures, " figures.");
            // Once data are collected start automatic sequence stage of performance
            automaticSequence();
        }
    });


    py.stdin.write(JSON.stringify(data));
    py.stdin.end();
    likesArray = [];
}

// // recursive function, it's asking python every tot ms
// function askPython() {
//     setTimeout(sendToPy, 5000); // ms of the repetition
// }

//  //askPython()
