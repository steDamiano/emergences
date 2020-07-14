class ChangeAmplitudeCommand {
    constructor(lissajous, amp, id) {
        this.lissajous = lissajous;
        this.amp = amp;
        this.className = 'ChangeAmplitudeCommand';
        this.id = id;
    }

    execute() {
        this.lissajous.setAmplitude(this.id, this.amp);
    }
}

module.exports = ChangeAmplitudeCommand;