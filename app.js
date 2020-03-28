var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var five = require('johnny-five');

function buildTimeStamp(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let milis = date_ob.getMilliseconds();
    stringTimeStamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ":" + milis;
    return stringTimeStamp;
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

board = new five.Board({port: "COM5"});

board.on('ready', function () {
    console.log(buildTimeStamp() + '-> ' + 'Arduino: Communication stablished');
    var ledAmarillo = new five.Led(13);
    ledAmarillo.blink(1000);
    
    var servo = new five.Servo(9);
    //servo.sweep();

    io.on('connection', function(socket){
        console.log(buildTimeStamp() + '-> ' + 'User connected');
        socket.on('change pos', function(pos){
            servo.to(1.8*pos);
            console.log("Position reference: " + pos);
        });
        
    });
});

http.listen(3000, function() {
    console.log(buildTimeStamp() + '-> ' + 'Listening on port: 3000');
});