import Observable from '../../Observable';
import io from 'socket.io-client'

export default class RemoteClient extends Observable{
    constructor(uri, commandSerializer){
        super();
        this.uri = uri;
        this.id = 0;
        this.address = 0;
        this.socket = null;
        this.commandSerializer = commandSerializer;
    }

    //SOCKET.IO + EXPRESS 
    connect(){
        this.socket = io.connect(this.uri);

        this.socket.on('message', (data) =>{
            const serializedCommand = JSON.parse(data);
            const command = this.commandSerializer.deserialize(serializedCommand);

            if(command){
                this.emit('CommandReceived', command);
            }
        });

        this.socket.on('client ID', (data) => {
            // console.log("Assigning ID");
            // console.log(data);
            this.id = data.position;
            this.address = data.address;
        });

        this.socket.on('connect', (event) =>{
            this.emit('Connected', event);
        });
    }

    sendLike(){
        this.socket.emit('clickedLike', null);
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
        this.socket.send(JSON.stringify(payload));
    }
}