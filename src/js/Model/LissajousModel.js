const Observable = require('../../Observable');

class Lissajous extends Observable {
    constructor() {
        super();
        //controllable parameters
        this.sizeX = 0.1,
        this.sizeY = 0.1,
        this.sizeZ = 0.1,
        this.fx = 1.0,
        this.fy = 1.0,
        this.fz = 2.0,
        this.dampX = 0.0;
        this.dampY = 0.0;
        this.dampZ = 0.0;
        this.phaseX = 8.0,
        this.phaseY = 0.0,
        this.phaseZ = 0.0,
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.offsetZ = 0.0;
        this.meterial = "Basic";
        this.color = "#ff0000";
        this.meshType = "Line";
    }

    setFrx(freq) {
        this.fx = freq;
        this.emit('FrequencyChanged', this);
    }
    setFry(freq) {
        this.fy = freq;
        this.emit('FreqY Modified', null);
    }
    setFrz(freq) {
        this.fz = freq;
        this.emit('FreqZ Modified', null);
    }

    setAmpX(amp) {
        this.sizeX = amp;
        this.emit('AmplitudeChanged', this);
    }

    setAmpY(amp) {
        this.sizeY = amp;
        this.emit('AmpY Modified', null);
    }

    setAmpZ(amp) {
        this.sizeZ = amp;
        this.emit('AmpZ Modified', null);
    }
    setDampX(damp) {
        this.dampX = damp;
        this.emit('DampingChanged', this);
    }

    setdampY(damp) {
        this.dampY = damp;
        this.emit('DampY Modified', null);
    }

    setdampZ(damp) {
        this.DampZ = damp;
        this.emit('DampZ Modified', null);
    }

    setPhaseX(phase) {
        this.phaseX = phase;
        this.emit('PhaseX Modified', null);
    }

    setPhaseY(phase) {
        this.phaseY = phase;
        this.emit('PhaseY Modified', null);
    }

    setPhaseZ(phase) {
        this.phaseZ = phase;
        this.emit('PhaseZ Modified', null);
    }

    setFrequency(id, freq) {
        var r = id % 3;
        switch (id % 3) {
            case (0):
                this.fx = freq;
                break;
            case (1):
                this.fy = freq;
                break;
            case (2):
                this.fz = freq;
        }

        this.emit('FrequencyChanged', this);
    }
    setDamping(id, damp) {
        var r = id % 3;
        switch (id % 3) {
            case (0):
                this.dampX = damp;
                break;
            case (1):
                this.dampY = damp;
                break;
            case (2):
                this.dampZ = damp;
        }

        this.emit('DampingChanged', this);
    }

    setPhase(id, phase) {
        switch (id % 3) {
            case (0):
                this.phaseX = phase;
                break;
            case (1):
                this.phaseY = phase;
                break;
            case (2):
                this.phaseZ = phase;
        }

        this.emit('PhaseChanged', this);
    }

    setAmplitude(id, amp) {
        switch (id % 3) {
            case (0):
                this.sizeX = amp;
                break;
            case (1):
                this.sizeY = amp;
                break;
            case (2):
                this.sizeZ = amp;
        }

        this.emit('AmplitudeChanged', this);
    }

    // setParameters(fx, fy, fz, ax, ay, az, phx, phy, phz) {
    //     // To be implemented -> set all parameters for generative part
    // }

    resetInitialState(){
        this.sizeX = 0.1,
        this.sizeY = 0.1,
        this.sizeZ = 0.1,
        this.fx = 1.0,
        this.fy = 1.0,
        this.fz = 2.0,
        this.dampX = 0.0;
        this.dampY = 0.0;
        this.dampZ = 0.0;
        this.phaseX = 8.0,
        this.phaseY = 0.0,
        this.phaseZ = 0.0,
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.offsetZ = 0.0;
    }
}

module.exports = Lissajous;