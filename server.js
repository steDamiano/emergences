// Dependencies

// Express application
var express = require('express');
var app = express();

// Server creation
var http = require('http');
var server = http.Server(app);

// Socket application
var socketIO = require('socket.io');
var io = socketIO(server);

var path = require('path');
app.set('port', 5000);

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

// Open the socket.
udpPort.open();

app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/home.html'));
});

// Starts the server.
server.listen(5000, '192.168.1.180' ,function() {
  console.log('Starting server on port 5000');
});

// client array
var clients_connected = new Array(); 

// Add the WebSocket handlers
io.on('connection', function(client) {
    console.log("Client connected: " + client.handshake.address);
    // clients_connected.push(client.handshake.address);
    // console.log("Clients: " + clients_connected);

    client.on('join', function(data){
        console.log(data);
    });

    client.on('exit', function(data){
        console.log(data);
    });

    client.on('changefreq', function(data){
        console.log('freq: ' + data.val);
        console.log('id: ' + data.id);
        if(data.id != undefined)
        {
            // send message
            var msg = {
                address: "/slider/freq",
                args: [
                    {
                        type: "i",
                        value: data.val
                    },
                    {
                        type: "i",
                        value: data.id
                    }
                ]
            };
            
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);
        }
    });

    client.on('changeamp', function(data){
        console.log('amp: '+data);
        if(data.id != undefined)
        {
            // send message
            var msg = {
                address: "/slider/amp",
                args: [
                    {
                        type: "f",
                        value: data.val
                    },
                    {
                        type: "i",
                        value: data.id
                    }
                ]
            };
            
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            udpPort.send(msg);
        }
    });

    client.on('clickedStart', function(data){
        clients_connected.push(client.handshake.address);
        var pos = clients_connected.indexOf(client.handshake.address);
        io.to(client.id).emit('clientID', {position: pos, address: client.handshake.address});
        // send message
        var msg = {
            address: "/button/1",
            args: [
                {
                    type: "f",
                    value: 1
                },
                {
                    type: "s",
                    value: client.handshake.address
                }
            ]
        };
        
        console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
        udpPort.send(msg);
    });

    client.on('clickedStop', function(data){
        // find synth number
        var pos;
        for( var i = 0; i < clients_connected.length; i++){ 
            if ( clients_connected[i] === client.handshake.address) {
            clients_connected.splice(i, 1); 
              pos = i;
            }
        }
        io.sockets.emit('changeID', clients_connected);
        // send message
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

        // console.log(data);
    });

    client.on('disconnect', function(data){
        // remove from array
        var pos;
        for( var i = 0; i < clients_connected.length; i++){ 
            if ( clients_connected[i] === client.handshake.address) {
              clients_connected.splice(i, 1); 
              pos = i;
            }
        }
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
            console.log('Client Disconnected');
        }

    });
});