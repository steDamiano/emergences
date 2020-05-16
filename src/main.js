// import * as THREE from 'three';
import 'three';
import LissajousController from './js/Controller/LissajousController';
import RemoteClient from './js/remote/RemoteClient';
import LissajousRemoteMediator from './js/remote/LissajousRemoteMediator';

const Lissajous = require('./js/Model/LissajousModel.js');
const CommandSerializer = require('./js/remote/CommandSerializer.js');
const lissajousCurve = new Lissajous();
// const lissajousController = new LissajousController(lissajousCurve);
const remoteClient = new RemoteClient('https://localhost:3001', new CommandSerializer(lissajousCurve));

remoteClient.addObserver('Connected', (e) =>{
    console.log('Connected event from socket');
    const lissajousRemoteMediator = new LissajousRemoteMediator(lissajousCurve, remoteClient);
    const lissajousController = new LissajousController(lissajousCurve, lissajousRemoteMediator);
});

remoteClient.connect();
