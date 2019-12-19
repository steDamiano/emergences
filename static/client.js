var socket = io.connect('http://192.168.1.231:5000');
var isStarted = false;
var clientID;
var clientOwnAddress;
var clients_array;

function startClicked(){
    if(!isStarted){
        socket.emit('clickedStart', 'You hit start');
        isStarted = true;
    }
}
    

function stopClicked(){
    isStarted = false;
    document.getElementById('freq').value = 12;
    document.getElementById('amp').value = 0.5;
    socket.emit('clickedStop', 'You hit stop');
}

function changeFreq(){
    socket.emit('changefreq', {val: document.getElementById('freq').value, id: clientID });
}

function changeAmp(){
    socket.emit('changeamp', {val: document.getElementById('amp').value, id: clientID});
}

socket.on('clientID', function(data){
    clientID = data.position;
    clientOwnAddress = data.address;
});

socket.on('changeID', function(data){
    console.log(data);
    for(i=0; i< data.length; i++){
        if(data[i] == clientOwnAddress){
            clientID = i;
        }
    }
});

socket.on('connect', function(data) {
    socket.emit('join', data);
});
