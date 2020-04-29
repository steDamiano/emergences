const Observable = require('../../Observable');

class Lissajous extends Observable{
    constructor(){
        super();
        //controllable parameters
        this.sizeX=80.0,
        this.sizeY=80.0,
        this.sizeZ=80.0,
        this.fx=4.0,
        this.fy=3.0,
        this.fz=2.0,
        this.phaseX=0.0,
        this.phaseY=0.0,
        this.phaseZ=0.0,
        // SET INTO VIEW?
        this.step=0.01;
        this.curveVertices = new Array();
        this.ribbonVertices = new Array();
        this.lines = new Array();
        this.numCurveVertices = 0.0; 
        this.meterial = "Basic";
        this.meshObject = new THREE.Object3D();
        this.color = "#ffffff";
        this.meshType = "Line";
    }

    setFrx(freq){
        this.fx = freq;
        this.emit('FreqX Modified', null);
    }
    setFry(freq){
        this.fy = freq;
        this.emit('FreqY Modified', null);
    }
    setFrz(freq){
        this.fz = freq;
        this.emit('FreqZ Modified', null);
    }

    setAmpX(amp){
        this.sizeX = amp;
        this.emit('AmpX Modified', null);
    }

    setAmpY(amp){
        this.sizeY = amp;
        this.emit('AmpY Modified', null);
    }

    setAmpZ(amp){
        this.sizeZ = amp;
        this.emit('AmpZ Modified', null);
    }

    setPhaseX(phase){
        this.phaseX = phase;
        this.emit('PhaseX Modified', null);
    }

    setPhaseY(phase){
        this.phaseY = phase;
        this.emit('PhaseY Modified', null);
    }

    setPhaseZ(phase){
        this.phaseZ = phase;
        this.emit('PhaseZ Modified', null);
    }
    
}

module.exports = Lissajous;