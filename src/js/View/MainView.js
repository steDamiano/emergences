import LissajousViewMediator from './mediator/LissajousViewMediator';
import RenderingContext from './RenderingContext';

export default class MainView{
    constructor(controller, lissajous_model){
        this.controller = controller;
        this.lissajous = lissajous_model;
        this.renderingContext = this.createRenderingContext();
        this.LissajousViewMediator = new LissajousViewMediator(lissajous_model);
        this.freqInput = document.getElementById('freq');
        this.ampInput = document.getElementById('amp');
    }

    createRenderingContext(){
        const container = document.createElement('div');
        document.body.appendChild(container);
        return RenderingContext.getDefault(container);
    }

    initialize(){
        const scene = this.renderingContext.scene;
        const object3D = this.LissajousViewMediator.object3D;

        scene.add(object3D);
        
        this.raycaster = new THREE.Raycaster();

        window.addEventListener('resize', (e) => this.onWindowResize(), false);
        this.freqInput.addEventListener('input', (e) => this.onFreqChange());
        this.ampInput.addEventListener('input', (e) => this.onAmpChange());
        this.render();
    }

    render(){
        // this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize() {
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onFreqChange(){
        var val = this.freqInput.value;
        // console.log("change freq, value: " + val);
        this.controller.onFreqChange(val);
        // This command should be in controller
        // this.lissajous.fx = val / 10;
        //this.LissajousViewMediator.getCurveObject(this.lissajous);
    }

    onAmpChange(){
        var val = this.ampInput.value;
        // console.log("change amp, value: " + val);
        this.controller.onAmpChange(val);
    }
}