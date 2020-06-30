class ChangePhaseCommand {
    constructor(lissajous, phase, id) {
        this.lissajous = lissajous;
        this.phase = phase;
        this.className = 'ChangePhaseCommand';
        // console.log(this.freq);
        // *** Here user ID will be set to know which freq should be changed *** //
        this.id = id;
    }

    execute() {
        // wrong ask stefano??
        //this.lissajous.setFrequency(this.id, this.phase);
        this.lissajous.setPhase(this.id, this.phase);
    }
}

module.exports = ChangePhaseCommand;