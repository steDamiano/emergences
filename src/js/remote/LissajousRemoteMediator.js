export default class LissajousRemoteMediator{
    constructor(lissajous, remoteClient){
        this.lissajous = lissajous;
        this.remoteClient = remoteClient;
        this.remoteClient.addObserver('CommandReceived', (e) => this.onCommandReceived(e));
    }

    initialize(){
        // Do we need it?
    }

    onCommandExecuted(command){
        this.remoteClient.runCommand(command);
    }

    onCommandReceived(command){
        command.execute();
    }
}