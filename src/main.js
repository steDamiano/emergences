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
<<<<<<< HEAD
const remoteClient = new RemoteClient('https://192.168.1.202:3001', new CommandSerializer(lissajousCurve));
=======
const remoteClient = new RemoteClient('https://192.168.0.108:3001', new CommandSerializer(lissajousCurve));
>>>>>>> 95cb9e5a232fb9e3bcd64e7eac23f15141e3532d

remoteClient.addObserver('Connected', (e) => {
    console.log('Connected event from socket');
    const lissajousRemoteMediator = new LissajousRemoteMediator(lissajousCurve, remoteClient);
    const lissajousController = new LissajousController(lissajousCurve, lissajousRemoteMediator);
});

remoteClient.connect();