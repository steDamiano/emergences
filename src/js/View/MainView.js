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
        this.phaseInput = document.getElementById('phase');
        this.likeButton = document.getElementById('likebut');
        this.controlAr;
    }

    createRenderingContext(){
        const container = document.createElement('div');
        document.body.appendChild(container);
        return RenderingContext.getDefault(container);
    }

    initialize(){
        
        const scene = this.renderingContext.scene;
        // const object3D = this.LissajousViewMediator.object3D;
        // const geometry = new THREE.BoxBufferGeometry(200, 200, 200);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        var geometry = new THREE.CylinderBufferGeometry( 0, 0.05, 0.2, 32 ).rotateX( Math.PI / 2 );
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // this.raycaster = new THREE.Raycaster();

        // this.controller = this.renderingContext.renderer.xr.getController( 0 );
        // this.controller.addEventListener( 'select', (e) => this.onSelect() );
        
        window.addEventListener('resize', (e) => this.onWindowResize(), false);
        this.freqInput.addEventListener('input', (e) => this.onFreqChange());
        this.ampInput.addEventListener('input', (e) => this.onAmpChange());
        this.phaseInput.addEventListener('input', (e) => this.onPhaseChange());
        this.likeButton.addEventListener('click', (e) => this.onLikeClicked());

        // Check AR Support
        if(navigator.xr){
            navigator.xr.isSessionSupported('immersive-ar').then((supported) =>  {
                if(supported){
                    console.log("AR supported");
                } else{
                    console.log("AR not supported");
                }
            });
        }

        this.controlAr = this.renderingContext.renderer.xr.getController(0);
        this.controlAr.addEventListener('select', (e) => this.onSelect());
        this.renderingContext.scene.add(this.controlAr);

        var reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial()
        );
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        this.renderingContext.scene.add( reticle );
        this.animate();
        // this.render();
    }

    onSelect() {
        var geometry = new THREE.CylinderBufferGeometry( 0, 0.05, 0.2, 32 ).rotateX( Math.PI / 2 );
        console.log("should add");
        var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( this.controlAr.matrixWorld );
        mesh.quaternion.setFromRotationMatrix( this.controlAr.matrixWorld );
        this.renderingContext.scene.add( mesh );

        console.log(this.renderingContext.scene);
    }

    render(){
        console.log("rendering");
        // this.renderingContext.controls.update();
        // requestAnimationFrame(() => this.render());
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

    onPhaseChange(){
        var val = this.phaseInput.value;
        this.controller.onPhaseChange(val);
    }

    onLikeClicked(){
        // console.log("Liked configuration");
        this.controller.onLikeClicked();
    }

    animate(){
        // console.log("Animating");
        // console.log(this.renderingContext.renderer);
        this.renderingContext.renderer.setAnimationLoop(() => this.render());
        // setAnimationLoop(() => this.render())
    }
}