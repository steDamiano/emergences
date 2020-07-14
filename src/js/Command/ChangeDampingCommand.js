class ChangeDampingCommand {
    constructor(lissajous, damp, id) {
        this.lissajous = lissajous;
        this.damp = damp;
        this.className = 'ChangeDampingCommand';
        this.id = id;
    }

    execute() {
        this.lissajous.setDamping(this.id, this.damp);
    }
}

module.exports = ChangeDampingCommand;