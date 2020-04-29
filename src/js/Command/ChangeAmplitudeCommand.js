class ChangeAmplitudeCommand{
    constructor(lissajous, amp){
        this.lissajous = lissajous;
        this.amp = amp;
        this.className = 'ChangeAmplitudeCommand';
        // *** Here user ID will be set to know which freq should be changed *** // 
        //this.id = id;
    }

    execute(){
        this.lissajous.setAmpX(this.amp);
        // console.log("Executing change amplitude command");
    }
}

module.exports = ChangeAmplitudeCommand;