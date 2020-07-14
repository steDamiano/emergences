import { ARButton } from '../../../node_modules/three/examples/jsm/webxr/ARButton'
import { EffectComposer } from '../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default class RenderingContext {
    constructor(scene, camera, renderer, composer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.composer = composer;


    }

    static getDefault(containerElement) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 2);

        var light = new THREE.DirectionalLight("#ffffff");
        light.position.set(0, 0, 1).normalize();
        scene.add(light);


        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(devicePixelRatio);
        renderer.setSize(innerWidth, innerHeight);
        renderer.shadowMap.enabled = false;
        renderer.gammaOutput = true;
        renderer.xr.enabled = true;
        document.body.appendChild(renderer.domElement);

        // the plane for the shadow
        const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        planeGeometry.rotateX(-Math.PI / 2);
        const planeMaterial = new THREE.ShadowMaterial({
            opacity: 0.2
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -200;
        plane.receiveShadow = true;
        ////////PLANE////////////

        const helper = new THREE.GridHelper(2000, 100);
        helper.position.y = -199;
        helper.material.transparent = true;
        helper.material.opacity = 1;

        document.querySelector(".scene-container").appendChild(renderer.domElement);

        scene.add(camera);

        let AR = document.body.appendChild(ARButton.createButton(renderer, {
            optionalFeatures: ["dom-overlay", 'dom-overlay-for-handheld-ar'],
            domOverlay: {
                root: document.body
            }
        }));

        containerElement.appendChild(renderer.domElement);


        var params = {
            exposure: 1,
            bloomStrength: 1.5,
            bloomThreshold: 0,
            bloomRadius: 20
        };

        var renderScene = new RenderPass(scene, camera);
        var bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.1, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0.77;
        bloomPass.renderToScreen = true;
        var composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);
        renderer.toneMappingExposure = Math.pow(1.9, 4.0);
        return new RenderingContext(scene, camera, renderer, composer);
    }
}