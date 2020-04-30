import ViewMediator from './ViewMediator'

export default class LissajousViewMediator extends ViewMediator{
    constructor(lissajous){
      super(lissajous);
      this.meshObject = new THREE.Object3D();
      const curve = this.getCurveObject(lissajous);
      this.object3D.add(curve);
      console.log("Construct lissajous view mediator");

      lissajous.addObserver("FrequencyChanged", (e) => this.onFreqChanged(e));
      lissajous.addObserver("AmplitudeChanged", (e) => this.onAmplitudeChanged(e));
      lissajous.addObserver("PhaseChanged", (e) => this.onPhaseChanged(e));
    }

    getCurveObject(lissajous){
        console.log("Updating view");
        const step = lissajous.step;
        // const meshObject = new THREE.Object3D();
        // const geometry = new THREE.Geometry();
        this.clearMesh(this.meshObject);
        lissajous.numCurveVertices = Math.floor((Math.PI * 2 + 4 * step)/step);
  
        for(var i = 0; i < lissajous.numCurveVertices; i++){
          lissajous.curveVertices[i] = new THREE.Vector3();
        }
        
        var angle = step
        for(var i = 0; i < lissajous.numCurveVertices; i++){    
          lissajous.curveVertices[i].x = lissajous.sizeX*Math.sin(lissajous.fx*angle + lissajous.phaseX);
          lissajous.curveVertices[i].y = lissajous.sizeY*Math.sin(lissajous.fy*angle + lissajous.phaseY);
          lissajous.curveVertices[i].z = lissajous.sizeZ*Math.sin(lissajous.fz*angle + lissajous.phaseZ);
          angle += step;
        }
    
        var lissajousGeometry = new THREE.Geometry();
        var vertArray = lissajousGeometry.vertices;
    
        if(lissajous.meshType == "Line"){
          var lineMaterial = new THREE.LineBasicMaterial();
          lineMaterial.color.setHex( lissajous.color.replace("#", "0x") );
          var line = new THREE.Line( lissajousGeometry, lineMaterial );
  
          //add
          for(var i = 0; i < lissajous.curveVertices.length - 1; i++){
            vertArray.push( lissajous.curveVertices[i], lissajous.curveVertices[i+1]);
            line.computeLineDistances();      
          }
          // lissajous.meshObject.add(line);
          this.meshObject.add(line);
        }

        return this.meshObject;
        //return lissajous.meshObject;
    }

    clearMesh(mesh) {
      console.log(mesh);
      var numChildren = mesh.children.length;
      if(numChildren > 0){
        for(var i = numChildren - 1; i >= 0; i--){
          mesh.remove(mesh.children[i]);
        }
      }
    }

    onFreqChanged(e){
      // this.getCurveObject(e);
      // this.object3D.remove(this.curve);
      // this.object3D = new THREE.Object3D();
      this.object3D.add(this.getCurveObject(e));
      // console.log("Freq changed");
    }

    onAmplitudeChanged(e){
      this.object3D.add(this.getCurveObject(e));
      // console.log("Amp changed");
    }

    onPhaseChanged(e){
      this.object3D.add(this.getCurveObject(e));
    }
}