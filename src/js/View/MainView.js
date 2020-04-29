import LissajousViewMediator from './mediator/LissajousViewMediator';
import RenderingContext from './RenderingContext';

export default class MainView{
    constructor(controller, lissajous_model){
        this.controller = controller;
        this.lissajous = lissajous_model;
        this.renderingContext = this.createRenderingContext();
        this.LissajousViewMediator = new LissajousViewMediator(lissajous_model);
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
}