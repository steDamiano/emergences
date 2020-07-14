class ChangePhaseCommand {
    constructor(lissajous, phase, id) {
        this.lissajous = lissajous;
        this.phase = phase;
        this.className = 'ChangePhaseCommand';
        this.id = id;
    }

    execute() {
        this.lissajous.setPhase(this.id, this.phase);
    }
}

module.exports = ChangePhaseCommand;