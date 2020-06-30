class ChangeDampingCommand {
    constructor(lissajous, damp, id) {
        this.lissajous = lissajous;
        this.damp = damp;
        this.className = 'ChangeDampingCommand';
        // console.log(this.freq);
        // *** Here user ID will be set to know which freq should be changed *** //
        this.id = id;
    }

    execute() {
        this.lissajous.setDamping(this.id, this.damp);
    }
}

module.exports = ChangeDampingCommand;