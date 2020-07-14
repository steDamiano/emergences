import 'three';

import LissajousController from './js/Controller/LissajousController';
import RemoteClient from './js/remote/RemoteClient';
import LissajousRemoteMediator from './js/remote/LissajousRemoteMediator';

const Lissajous = require('./js/Model/LissajousModel.js');
const CommandSerializer = require('./js/remote/CommandSerializer.js');
const lissajousCurve = new Lissajous();

// HERE you should put IP from your local network
const remoteClient = new RemoteClient('https://192.168.1.23:3001', new CommandSerializer(lissajousCurve));

remoteClient.addObserver('Connected', (e) => {
    console.log('Connected event from socket');

    // When client has connected start curve to show on UI and controls for the user
    const lissajousRemoteMediator = new LissajousRemoteMediator(lissajousCurve, remoteClient);
    const lissajousController = new LissajousController(lissajousCurve, lissajousRemoteMediator);
});

remoteClient.connect();