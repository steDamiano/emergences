import LissajousViewMediator from "./mediator/LissajousViewMediator";
import RenderingContext from "./RenderingContext";
import {
    OrbitControls
} from "../../../node_modules/three/examples/jsm/controls/OrbitControls";

export default class MainView {
    constructor(controller, lissajous_model) {
        this.controller = controller;
        this.lissajous = lissajous_model;

        this.reticle;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;


        this.renderingContext = this.createRenderingContext();
        this.LissajousViewMediator = new LissajousViewMediator(lissajous_model);
        this.LissajousViewMediator.getCurveObject(this.lissajous);


        this.freqInput = document.getElementById("freq");
        this.ampInput = document.getElementById("amp");
        this.phaseInput = document.getElementById("phase");
        this.dampInput = document.getElementById("damp");
        this.likeButton = document.getElementById("likebut");
        this.controlAr;
        this.controls;


        //this.initialize();
        //this.onSelect();
    }

    createRenderingContext() {
        const container = document.createElement("div");
        document.body.appendChild(container);
        return RenderingContext.getDefault(container);
    }

    initialize() {

        const scene = this.renderingContext.scene;
        const composer = this.renderingContext.composer;
        const object3D = this.LissajousViewMediator.object3D;
        scene.add(object3D);
        // var camera = this.renderingContext.camera;

        this.controls = new OrbitControls(
            this.renderingContext.camera,
            this.renderingContext.renderer.domElement
        );


        // Check AR Support
        if (navigator.xr) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
                if (supported) {
                    console.log("AR supported");
                } else {
                    console.log("AR not supported");
                }
            });
        }
        console.log("AR supported");


        this.controlAr = this.renderingContext.renderer.xr.getController(0);
        this.renderingContext.scene.add(this.controlAr);
        this.controlAr.addEventListener("select", (e) => this.onSelect());
        this.renderingContext.scene.add(this.controlAr);

        this.reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry(0.15, 0.20, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({
                color: 0xffff00
                    //side: THREE.DoubleSide
            })
        );
        this.reticle.position.set(0, 0, 0)
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;

        scene.add(this.reticle);

        ///LISSAJOUS/////////
        this.LissajousViewMediator.lissajousGeometry.setAttribute('position', new THREE.BufferAttribute(this.LissajousViewMediator.positions, 3));
        var material = new THREE.MeshBasicMaterial({
            color: "#ff0000",
            side: THREE.DoubleSide,
            wireframe: true
        });
        var mesh = new THREE.Mesh(this.LissajousViewMediator.lissajousGeometry, material);
        mesh.position.setFromMatrixPosition(this.reticle.matrix);
        mesh.position.set(0, 0, 0);
        //mesh.visible = false;
        this.renderingContext.scene.add(mesh);
        /////*********************************////////


        window.addEventListener("resize", (e) => this.onWindowResize(), false);
        this.freqInput.addEventListener("input", (e) => this.onFreqChange());
        this.ampInput.addEventListener("input", (e) => this.onAmpChange());
        this.dampInput.addEventListener("input", (e) => this.onDampChange());
        this.phaseInput.addEventListener("input", (e) => this.onPhaseChange());
        this.likeButton.addEventListener("click", (e) => this.onLikeClicked());

        this.animate(this.LissajousViewMediator.positions);
    }

    onSelect() {

        this.LissajousViewMediator.meshObject.position
            .set(0, 0, -0.7)
            .applyMatrix4(
                this.renderingContext.renderer.xr.getController(0).matrixWorld);
        this.LissajousViewMediator.meshObject.quaternion.setFromRotationMatrix(this.renderingContext.renderer.xr.getController(0).matrixWorld);
        this.renderingContext.scene.add(this.LissajousViewMediator.meshObject);

    }

    render() {

        this.renderingContext.renderer.render(
            this.renderingContext.scene,
            this.renderingContext.camera
        );

    }

    onWindowResize() {
        this.renderingContext.camera.aspect =
            window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }


    animate(positions) {

        //this.LissajousViewMediator.clearMesh(this.meshObject);
        //this.renderingContext.camera.updateMatrixWorld();

        t = t < 1 ? t + 0.1 : 1;
        this.LissajousViewMediator.offset(this.lissajous);
        this.LissajousViewMediator.lissajousGeometry.deleteAttribute("position");
        this.LissajousViewMediator.loadPoints(
            this.lissajous,
            this.LissajousViewMediator.positions
        );
        this.LissajousViewMediator.lissajousGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        this.renderingContext.camera.updateMatrixWorld();
        this.renderingContext.renderer.render(
            this.renderingContext.scene,
            this.renderingContext.camera
        );
        if (t < 1) {
            this.renderingContext.renderer.setAnimationLoop(() =>
                this.animate(this.LissajousViewMediator.positions)

            );
            //this.renderingContext.composer.render(); /// SUPER EFFETTO WOW CHE DA PROBLEMI
        }

    }


    onFreqChange() {
        var val = this.freqInput.value;
        // console.log("change freq, value: " + val);
        this.controller.onFreqChange(val);
        // This command should be in controller
        // this.lissajous.fx = val / 10;
        //this.animate(this.LissajousViewMediator.positions);
    }

    onAmpChange() {
        var val = this.ampInput.value;
        // console.log("change amp, value: " + val);
        this.controller.onAmpChange(val / 1000);
        this.animate(this.LissajousViewMediator.positions);
    }
    onDampChange() {
        var val = this.dampInput.value;
        // console.log("change amp, value: " + val);
        this.controller.onDampChange(val);
        this.animate(this.LissajousViewMediator.positions);
    }

    onPhaseChange() {
        var val = this.phaseInput.value;
        this.controller.onPhaseChange(val);
        this.animate(this.LissajousViewMediator.positions);
    }

    onLikeClicked() {
        // console.log("Liked configuration");
        this.controller.onLikeClicked();
        this.animate(this.LissajousViewMediator.positions);
    }

}