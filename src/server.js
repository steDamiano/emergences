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
    /*
    for(const command of getInitCommands()){
        const serializedCommand = JSON.stringify(command);
        ws.send(serializedCommand);
    }
    */
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