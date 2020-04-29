class ChangeFrequencyCommand{
    constructor(lissajous, freq){
        this.lissajous = lissajous;
        this.freq = freq;
        this.className = 'ChangeFrequencyCommand';
        // console.log(this.freq);
        // *** Here user ID will be set to know which freq should be changed *** // 
        //this.id = id;
    }

    execute(){
        this.lissajous.setFrx(this.freq);
        // console.log("Executing change frequency command: " + this.freq);

    }
}

module.exports = ChangeFrequencyCommand;