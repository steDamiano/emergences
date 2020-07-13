class ChangePhaseCommand {
    constructor(lissajous, phase, id) {
        this.lissajous = lissajous;
        this.phase = phase;
        this.className = 'ChangePhaseCommand';
        // *** Here user ID will be set to know which phase should be changed *** //
        this.id = id;
    }

    execute() {
        this.lissajous.setPhase(this.id, this.phase);
    }
}

module.exports = ChangePhaseCommand;