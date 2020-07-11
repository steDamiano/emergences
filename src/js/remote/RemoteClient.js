import Observable from '../../Observable';
import io from 'socket.io-client'
import Lissajous from '../Model/LissajousModel';

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
            console.log("Command received");
            console.log(data);
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

            this.emit('InitStatus', data.lissajous);
        });

        this.socket.on('connect', (event) =>{
            this.emit('Connected', event);
        });

        ///ADDD
        
        this.socket.on('Ispector', control => {
            if (control.position <= 2) {
                document.getElementById("myDetails").style.opacity = "1";
            } else if (control.position > 2) {
                document.getElementById("myDetails").style.opacity = "0";
            }

        });

        this.socket.on('Time', obj => {
            if (obj) {
                const millis = Math.floor((Date.now() - obj.ServerTime));
                this.timer(obj.time, obj.reset);
            }
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

    timer(obj, r) {
        clearInterval(countdownTimer);
        var seconds = obj;
        var reset = r;
        const State = document.querySelector(".TimerText text");
        console.log("state: ", State);
        //State.innerHTML = "Next Generation";
        if (reset == false) {
            State.innerHTML = "Next Generation in:";
            reset = true;
            document.getElementById('myDetails').removeEventListener('click', handleTouch);
        } else {
            State.innerHTML = "On Air";
            reset = false;
            document.getElementById('myDetails').addEventListener('click', handleTouch);
        }

        function secondPassed() {
            var minutes = Math.round((seconds - 30) / 60),
                remainingSeconds = seconds % 60;
            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;
            }
            document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
            if (seconds == 0 && reset == false) { ///CONTROLS ON
                // console.log("CONTROLS ON");
                seconds = 60;
                reset = !reset;
                document.getElementById("myDetails").open = true;
                document.getElementById('myDetails').removeEventListener('click', handleTouch);
                State.innerHTML = "Next Generation in:";
            } else if (seconds == 0 && reset == true) { ///CONTROLS OFF
                // console.log("CONTROLS OFF");
                seconds = 30;
                reset = !reset;
                document.getElementById("myDetails").open = false;
                document.getElementById('myDetails').addEventListener('click', handleTouch);
                State.innerHTML = "On Air";
            } else {
                seconds--;
            }
        }

        function handleTouch(e) {
            e.preventDefault();
        }
        countdownTimer = setInterval(secondPassed, 1000);


    }
    
}