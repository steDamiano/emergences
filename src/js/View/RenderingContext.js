import { ARButton } from '../../../node_modules/three/examples/jsm/webxr/ARButton'

export default class RenderingContext{
    constructor(scene, camera, renderer){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        // this.controls = controls;
    }

    static getDefault(containerElement){
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene;
        const camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
        const renderer = new THREE.WebGLRenderer({antialias : true, alpha: true});
        // const controls = new THREE.TrackballControls(camera,renderer.domElement);

        //Camera Setup
        camera.position.set(500, 800, 1300);
        camera.lookAt(new THREE.Vector3());
        camera.fov /= 2;
        camera.updateProjectionMatrix();

        //Renderer Setup
        renderer.setSize(width, height);
        // renderer.setClearColor( 0xf0f0f0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.autoClear = false;
        scene.add(new THREE.AmbientLight(0x333333));

        //Lights Setup
        const ambientLight = new THREE.AmbientLight( 0x606060 );
        scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
        scene.add( directionalLight );
        document.body.appendChild(ARButton.createButton(renderer));
        // renderer.xr.enabled = true;

        containerElement.appendChild(renderer.domElement);
        return new RenderingContext(scene, camera, renderer);
    }
}