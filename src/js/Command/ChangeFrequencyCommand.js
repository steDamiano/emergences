class ChangeFrequencyCommand{
    constructor(lissajous, freq, id){
        this.lissajous = lissajous;
        this.freq = freq;
        this.className = 'ChangeFrequencyCommand';
        // *** Here user ID will be set to know which freq should be changed *** // 
        this.id = id;
    }

    execute(){
        this.lissajous.setFrequency(this.id, this.freq);
    }
}

module.exports = ChangeFrequencyCommand;