import Observable from '../../Observable';
import io from 'socket.io-client'
import Lissajous from '../Model/LissajousModel';

export default class RemoteClient extends Observable {
    constructor(url, commandSerializer) {
        super();
        this.url = url;
        this.id = 0;
        this.address = 0;
        this.socket = null;
        this.commandSerializer = commandSerializer;
        this.State = document.querySelector(".TimerText text");
    }

    //SOCKET.IO + EXPRESS
    connect() {
        this.socket = io.connect(this.url);

        this.socket.on('message', (data) => {

            // Commands received by server
            const serializedCommand = JSON.parse(data);
            const command = this.commandSerializer.deserialize(serializedCommand);

            if (command) {
                // Tell RemoteMediator to execute command locally
                this.emit('CommandReceived', command);
            }
        });

        // Client ID is assigned from server. Needed to execute commands correctly and to communicate with server
        this.socket.on('client ID', (data) => {
            this.id = data.position;
            this.address = data.address;

            this.emit('InitStatus', data.lissajous);

            //Send frequency value to server
            this.socket.emit('InitialFreq', document.getElementById('freq').value);
        });

        this.socket.on('connect', (event) => {
            this.emit('Connected', event);
        });

        // Deactivate controls for users >= 3. Only first three will control synths, others will just watch
        this.socket.on('Ispector', control => {
            if (control.position <= 2) {
                document.getElementById("myDetails").style.opacity = "1";
            } else if (control.position > 2) {
                document.getElementById("myDetails").style.opacity = "0";
            }

        });

        // Sync timer with server
        this.socket.on('Time', obj => {
            this.timer(obj.time, obj.reset, obj.state);
        });



    }

    sendLike() {
        this.socket.emit('clickedLike', null);
    }

    runCommand(command) {
        this.sendCommand('RUN', command);
    }

    setTerminateCommand(command) {
        this.sendCommand('ON_DISCONNECT', command);
    }

    // Send JSON string with command to server, which will broadcast it to other clients
    sendCommand(type, command) {
        const serializedCommand = this.commandSerializer.serialize(command);
        const payload = {
            type,
            command: serializedCommand
        };
        this.socket.send(JSON.stringify(payload));
    }

    timer(obj, r, state) {

        var seconds = obj;
        var reset = r;
        const State = document.querySelector(".TimerText text");
        switch (state) {
            // In this status users will have control of installation and will be able to interact with it
            case 0:
                State.innerHTML = "Next Show in:";
                document.getElementById("myDetails").style.pointerEvents = 'auto';
                break;
            // In all other statuses sequence will be automatic. Number of generation is related to generic algorithm
            case 1:
                State.innerHTML = "1st Generation";
                document.getElementById("myDetails").style.pointerEvents = 'none';
                document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                document.getElementById("myDetails").open = false;
                break;
            case 2:
                State.innerHTML = "2nd Generation";
                document.getElementById("myDetails").style.pointerEvents = 'none';
                document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                document.getElementById("myDetails").open = false;
                break;
            case 3:
                State.innerHTML = "3rd Generation";
                document.getElementById("myDetails").style.pointerEvents = 'none';
                document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                document.getElementById("myDetails").open = false;
                break;
            case 4:
                State.innerHTML = "4th Generation";
                document.getElementById("myDetails").style.pointerEvents = 'none';
                document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                document.getElementById("myDetails").open = false;
                break;
        }
        var minutes = Math.round((seconds - 30) / 60),
            remainingSeconds = seconds % 60;
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }
        document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
        if (seconds == 0 && reset == true) { 
            ///CONTROLS ON
            document.getElementById("myDetails").open = true;
            State.innerHTML = "Next Generation in:";
        } else if (seconds == 0 && reset == false) { 
            ///CONTROLS OFF
            document.getElementById("myDetails").open = false;
        }
    }
}
