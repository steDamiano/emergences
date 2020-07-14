class LikeCommand{
    constructor(lissajous, id){
        this.lissajous = lissajous;
        this.id = id;

        this.fx = 0;
        this.fy = 0;
        this.fz = 0;
        this.ampx = 0;
        this.ampy = 0;
        this.ampz = 0;
        this.phaseX = 0;
        this.phaseY = 0;
        this.phaseZ = 0;
    }

    execute(){
        // Save status at the moment of call, will be processed by server
        this.fx = this.lissajous.fx;
        this.fy = this.lissajous.fy;
        this.fz = this.lissajous.fz;
        this.ampx = this.lissajous.sizeX;
        this.ampy = this.lissajous.sizeY;
        this.ampz = this.lissajous.sizeZ;
        this.phaseX = this.lissajous.phaseX;
        this.phaseY = this.lissajous.phaseY;
        this.phaseZ = this.lissajous.phaseZ;
    }
}

module.exports = LikeCommand;