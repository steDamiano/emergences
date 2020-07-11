import MainView from '../View/MainView';
import ChangeFrequencyCommand from '../Command/ChangeFrequencyCommand';
import ChangeAmplitudeCommand from '../Command/ChangeAmplitudeCommand';
import ChangePhaseCommand from '../Command/ChangePhaseCommand';
import ChangeDampingCommand from '../Command/ChangeDampingCommand';

export default class LissajousController {
    constructor(lissajous, lissajousRemoteMediator) {
        this.lissajousCurve = lissajous;
        this.lissajousRemoteMediator = lissajousRemoteMediator;
        this.view = new MainView(this, lissajous);
        this.view.initialize();
        // Do we need it?
        this.lissajousRemoteMediator.initialize();
    }
    c
    onFreqChange(freq) {
        var frequency = freq / 10; // ******//
        console.log(frequency);
        // console.log('id: ' + this.lissajousRemoteMediator.remoteClient.id);
        this.executeCommand(new ChangeFrequencyCommand(this.lissajousCurve, frequency, this.lissajousRemoteMediator.remoteClient.id));
    }

    onAmpChange(amp) {
        //console.log(amp);
        var amplitude = amp;
        this.executeCommand(new ChangeAmplitudeCommand(this.lissajousCurve, amplitude, this.lissajousRemoteMediator.remoteClient.id));
    }

    onPhaseChange(phase) {
        // console.log(phase);
        this.executeCommand(new ChangePhaseCommand(this.lissajousCurve, phase, this.lissajousRemoteMediator.remoteClient.id));
    }
    onDampChange(damp) {
        // console.log(damp);
        var damping = damp;
        this.executeCommand(new ChangeDampingCommand(this.lissajousCurve, damping, this.lissajousRemoteMediator.remoteClient.id));
    }

    onLikeClicked() {
        this.lissajousRemoteMediator.sendLike();
    }

    executeCommand(command) {
        command.execute(command);
        this.lissajousRemoteMediator.onCommandExecuted(command);
    }
}