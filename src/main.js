// import * as THREE from 'three';
import 'three'
import LissajousController from './js/Controller/LissajousController';

const Lissajous = require('./js/Model/LissajousModel.js');
const lissajousCurve = new Lissajous();
const lissajousController = new LissajousController(lissajousCurve);
