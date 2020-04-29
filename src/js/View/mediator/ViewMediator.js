import Observable from '../../../Observable';

export default class ViewMediator extends Observable{
    constructor(model){
        super();
        this.model = model;
        this.object3D = this.makeObject3D();
        console.log("Construct view mediator");
    }

    makeObject3D(){
        return new THREE.Object3D();
    }
}