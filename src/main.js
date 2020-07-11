// import * as THREE from 'three';
import 'three';

import LissajousController from './js/Controller/LissajousController';
import RemoteClient from './js/remote/RemoteClient';
import LissajousRemoteMediator from './js/remote/LissajousRemoteMediator';

const Lissajous = require('./js/Model/LissajousModel.js');
const CommandSerializer = require('./js/remote/CommandSerializer.js');
const lissajousCurve = new Lissajous();
// const lissajousController = new LissajousController(lissajousCurve);

// HERE you should put IP from your local network
const remoteClient = new RemoteClient('https://192.168.0.108:3001', new CommandSerializer(lissajousCurve));

remoteClient.addObserver('Connected', (e) => {
    console.log('Connected event from socket');
    const lissajousRemoteMediator = new LissajousRemoteMediator(lissajousCurve, remoteClient);
    const lissajousController = new LissajousController(lissajousCurve, lissajousRemoteMediator);
});

remoteClient.connect();