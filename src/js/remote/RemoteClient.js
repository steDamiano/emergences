import Observable from '../../Observable';
import io from 'socket.io-client'
import Lissajous from '../Model/LissajousModel';

export default class RemoteClient extends Observable {
    constructor(uri, commandSerializer) {
        super();
        this.uri = uri;
        this.id = 0;
        this.address = 0;
        this.socket = null;
        this.commandSerializer = commandSerializer;
        this.State = document.querySelector(".TimerText text");
    }

    //SOCKET.IO + EXPRESS
    connect() {
        this.socket = io.connect(this.uri);

        this.socket.on('message', (data) => {
            console.log("Command received");
            console.log(data);
            const serializedCommand = JSON.parse(data);
            const command = this.commandSerializer.deserialize(serializedCommand);

            if (command) {
                this.emit('CommandReceived', command);
            }
        });

        this.socket.on('client ID', (data) => {
            this.id = data.position;
            this.address = data.address;

            this.emit('InitStatus', data.lissajous);

            //Send frequency value, randomly generated from HTML, to server
            this.socket.emit('InitialFreq', document.getElementById('freq').value);
        });

        this.socket.on('connect', (event) => {
            this.emit('Connected', event);
        });

        this.socket.on('Ispector', control => {
            if (control.position <= 2) {
                document.getElementById("myDetails").style.opacity = "1";
            } else if (control.position > 2) {
                document.getElementById("myDetails").style.opacity = "0";
            }

        });

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
                case 0:
                    State.innerHTML = "Next Show in:";
                    document.getElementById("myDetails").style.pointerEvents = 'auto';

                    break;
                case 1:
                    State.innerHTML = "1st Generation";
                    document.getElementById("myDetails").style.pointerEvents = 'none';
                    document.getElementById("myDetails").children[0].innerHTML = "Locked ";

                    break;
                case 2:
                    State.innerHTML = "2nd Generation";
                    document.getElementById("myDetails").style.pointerEvents = 'none';
                    document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                    break;
                case 3:
                    State.innerHTML = "3rd Generation";
                    document.getElementById("myDetails").style.pointerEvents = 'none';
                    document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                    break;

                case 4:
                    State.innerHTML = "4th Generation";
                    document.getElementById("myDetails").style.pointerEvents = 'none';
                    document.getElementById("myDetails").children[0].innerHTML = "Locked ";
                    break;
            }

            var minutes = Math.round((seconds - 30) / 60),
                remainingSeconds = seconds % 60;
            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;
            }
            document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
            if (seconds == 0 && reset == true) { ///CONTROLS ON

                document.getElementById("myDetails").open = true;

                State.innerHTML = "Next Generation in:";
            } else if (seconds == 0 && reset == false) { ///CONTROLS OFF

                document.getElementById("myDetails").open = false;
            }



        }
}
