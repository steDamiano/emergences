
import MainView from '../View/MainView';

export default class LissajousController{
    constructor(lissajous){
        this.lissajousCurve = lissajous;
        this.view = new MainView(this, lissajous);
        this.view.initialize();
    }
}
