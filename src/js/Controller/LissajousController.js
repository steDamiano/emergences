
import MainView from '../View/MainView';
import ChangeFrequencyCommand from '../Command/ChangeFrequencyCommand';
import ChangeAmplitudeCommand from '../Command/ChangeAmplitudeCommand';
import ChangePhaseCommand from '../Command/ChangePhaseCommand';

export default class LissajousController{
    constructor(lissajous, lissajousRemoteMediator){
        this.lissajousCurve = lissajous;
        this.lissajousRemoteMediator = lissajousRemoteMediator;
        this.view = new MainView(this, lissajous);
        this.view.initialize();
        // Do we need it?
        this.lissajousRemoteMediator.initialize();
    }

    onFreqChange(freq){
        var frequency = freq / 10;
        // console.log('id: ' + this.lissajousRemoteMediator.remoteClient.id);
        this.executeCommand(new ChangeFrequencyCommand(this.lissajousCurve, frequency, this.lissajousRemoteMediator.remoteClient.id));
    }

    onAmpChange(amp){
        var amplitude = amp * 1000;
        this.executeCommand(new ChangeAmplitudeCommand(this.lissajousCurve, amplitude, this.lissajousRemoteMediator.remoteClient.id));
    }

    onPhaseChange(phase){
        console.log("onPhaseChange");
        this.executeCommand(new ChangePhaseCommand(this.lissajousCurve, phase, this.lissajousRemoteMediator.remoteClient.id));
    }

    executeCommand(command){
        command.execute(command);
        this.lissajousRemoteMediator.onCommandExecuted(command);
    }
}
