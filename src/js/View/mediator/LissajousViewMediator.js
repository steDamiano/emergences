import ViewMediator from './ViewMediator'

export default class LissajousViewMediator extends ViewMediator{
    constructor(lissajous){
      super(lissajous);
      const curve = this.getCurveObject(lissajous);
      this.object3D.add(curve);
      console.log("Construct lissajous view mediator");
    }

    getCurveObject(lissajous){
        const step = lissajous.step;
        // const geometry = new THREE.Geometry();
        this.clearMesh(lissajous);
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
          lissajous.meshObject.add(line);
        }

        return lissajous.meshObject;
    }

    clearMesh(lissajous) {
      var numChildren = lissajous.meshObject.children.length;
      if(numChildren > 0){
        for(var i = numChildren - 1; i >= 0; i--){
          lissajous.meshObject.remove(lissajous.meshObject.children[i]);
        }
      }
    }
}