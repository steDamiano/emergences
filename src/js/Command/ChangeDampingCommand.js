class ChangeDampingCommand {
    constructor(lissajous, damp, id) {
        this.lissajous = lissajous;
        this.damp = damp;
        this.className = 'ChangeDampingCommand';
        // *** Here user ID will be set to know which damp should be changed *** //
        this.id = id;
    }

    execute() {
        this.lissajous.setDamping(this.id, this.damp);
    }
}

module.exports = ChangeDampingCommand;