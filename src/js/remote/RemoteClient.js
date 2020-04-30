import Observable from '../../Observable';
import socketIOClient from 'socket.io-client';
import io from 'socket.io-client'

export default class RemoteClient extends Observable{
    constructor(uri, commandSerializer){
        super();
        this.uri = uri;
        this.socket = null;
        this.commandSerializer = commandSerializer;
    }

    //SOCKET.IO + EXPRESS 
    connect(){
        // console.log("Connected");
        this.socket = io.connect(this.uri);
        // this.socket = socketIOClient('ws://localhost:8081');
        // const socket = io.connect(this.uri);
        
        this.socket.on('news', (data) => {
            console.log(data);
        });

        this.socket.on('message', (event) =>{
            console.log(event);
            const serializedCommand = JSON.parse(event);
            const command = this.commandSerializer.deserialize(serializedCommand);

            if(command){
                this.emit('CommandReceived', command);
            }
        });

        this.socket.on('connect', (event) =>{
            this.emit('Connected', event);
        });
    }

    runCommand(command){
        this.sendCommand('RUN', command);
    }

    setTerminateCommand(command){
        this.sendCommand('ON_DISCONNECT', command);
    }

    sendCommand(type, command){
        const serializedCommand = this.commandSerializer.serialize(command);
        const payload = {type, command: serializedCommand};
        // console.log(payload);
        this.socket.send(JSON.stringify(payload));
    }
}