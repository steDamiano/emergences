import ViewMediator from './ViewMediator'

export default class LissajousViewMediator extends ViewMediator {
    constructor(lissajous) {
        super(lissajous);
        this.meshObject = new THREE.Object3D();
        console.log(this.meshObject);
        const curve = this.getCurveObject(lissajous);
        this.object3D.add(curve);
        this.positions = [];

    }

    getCurveObject(lissajous) {
        var lissajousGeometry = new THREE.BufferGeometry();
        this.lissajousGeometry = lissajousGeometry;
        var lineMaterial = new THREE.LineBasicMaterial({
            color: "#FF0000",
            linewidth: 1
        });
        var line = new THREE.Line(lissajousGeometry, lineMaterial);
        var positions = new Float32Array(40000 * 3);
        this.positions = positions;
        line.castShadow = true;
        this.lissajousGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        return this.positions, this.lissajousGeometry, this.meshObject;

    }
    loadPoints(lissajous, positions) {

        for (let i = 0; i < 40000; i++) {
            positions[i * 3] = tween(t, getCoords(i / 500, lissajous.sizeX, lissajous.fx, lissajous.offsetX, lissajous.dampX), positions[i * 3])
            positions[i * 3 + 1] = tween(t, getCoords(i / 500, lissajous.sizeY, lissajous.fy, lissajous.offsetY, lissajous.dampY), positions[i * 3 + 1])
            positions[i * 3 + 2] = tween(t, getCoords(i / 500, lissajous.sizeZ, lissajous.fz, lissajous.offsetZ, lissajous.dampZ), positions[i * 3 + 2])

        }

        // tweening function for smooth transitions
        function tween(i, newVal, oldVal) {
            return i >= 1 ? newVal : oldVal * (1 - i) + newVal * i
        }

        // helper function for calculating coordinates
        function getCoords(n, cor, f, p, d) {
            let result = 0

            result += cor * Math.sin(n * f + p * Math.PI * 2) * Math.exp(-d * 5 * n)

            return result
        }

    }
    offset(lissajous) {
        lissajous.offsetX = (lissajous.offsetX + lissajous.phaseX / 5000) % 1;
        lissajous.offsetY = (lissajous.offsetY + lissajous.phaseY / 5000) % 1;
        lissajous.offsetZ = (lissajous.offsetZ + lissajous.phaseZ / 5000) % 1;
    }
}