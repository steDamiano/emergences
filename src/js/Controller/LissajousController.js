
import MainView from '../View/MainView';
import ChangeFrequencyCommand from '../Command/ChangeFrequencyCommand';
import ChangeAmplitudeCommand from '../Command/ChangeAmplitudeCommand';

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
        this.executeCommand(new ChangeFrequencyCommand(this.lissajousCurve, frequency));
    }

    onAmpChange(amp){
        var amplitude = amp * 1000;
        this.executeCommand(new ChangeAmplitudeCommand(this.lissajousCurve, amplitude));
    }

    executeCommand(command){
        command.execute(command);
        this.lissajousRemoteMediator.onCommandExecuted(command);
    }
}
