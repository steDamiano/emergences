class ChangeFrequencyCommand{
    constructor(lissajous, freq, id){
        this.lissajous = lissajous;
        this.freq = freq;
        this.className = 'ChangeFrequencyCommand';
        this.id = id;
    }

    execute(){
        this.lissajous.setFrequency(this.id, this.freq);
    }
}

module.exports = ChangeFrequencyCommand;