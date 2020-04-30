class ChangePhaseCommand{
    constructor(lissajous, phase, id){
        this.lissajous = lissajous;
        this.phase = phase;
        this.className = 'ChangePhaseCommand';
        // console.log(this.freq);
        // *** Here user ID will be set to know which freq should be changed *** // 
        this.id = id;
    }

    execute(){
        this.lissajous.setFrequency(this.id, this.phase);
    }
}

module.exports = ChangePhaseCommand;