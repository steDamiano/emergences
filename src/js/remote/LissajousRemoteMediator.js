import { stat } from "fs";

export default class LissajousRemoteMediator{
    constructor(lissajous, remoteClient){
        this.lissajous = lissajous;
        this.remoteClient = remoteClient;
        this.remoteClient.addObserver('CommandReceived', (e) => this.onCommandReceived(e));
        this.remoteClient.addObserver('InitStatus', (status) => this.initialize(status));
    }

    initialize(status){
        if(status){
            this.lissajous.setFrx(status.fx);
            this.lissajous.setFry(status.fy);
            this.lissajous.setFrz(status.fz);

            this.lissajous.setAmpX(status.sizeX);
            this.lissajous.setAmpY(status.sizeY);
            this.lissajous.setAmpZ(status.sizeZ);

            this.lissajous.setDampX(status.dampX);
            this.lissajous.setdampY(status.dampY);
            this.lissajous.setdampZ(status.dampZ);

            this.lissajous.setPhaseX(status.phaseX);
            this.lissajous.setPhaseY(status.phaseY);
            this.lissajous.setPhaseZ(status.phaseZ);

        }

    }

    sendLike(){
        this.remoteClient.sendLike();
    }

    onCommandExecuted(command){
        this.remoteClient.runCommand(command);
    }

    onCommandReceived(command){
        command.execute();
    }
}