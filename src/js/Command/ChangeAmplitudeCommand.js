class ChangeAmplitudeCommand {
    constructor(lissajous, amp, id) {
        this.lissajous = lissajous;
        this.amp = amp;
        this.className = 'ChangeAmplitudeCommand';
        // *** Here user ID will be set to know which amp should be changed *** //
        this.id = id;
    }

    execute() {
        this.lissajous.setAmplitude(this.id, this.amp);
    }
}

module.exports = ChangeAmplitudeCommand;