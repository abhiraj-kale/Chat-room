const PORT = process.env.PORT || 3000;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');


app.get('/',(req, res)=>{
    res.sendFile( __dirname + "/index.html" ); 
    io.on('connection',(socket)=>{
        socket.on('create-room',function(msg){
            const link = uuidv4();
            socket.join(link);
            socket.emit('redirect-link',{link:'room/'+link});
        })
    });    
})
app.get('/room/:link',function(req,res){
    res.sendFile( __dirname + "/chat.html" );
    
    io.on('connection',(socket)=>{
        socket.removeAllListeners();
        socket.join(req.params.link);
        socket.on('has-joined',function(msg){
        socket.to(req.params.link).broadcast.emit('chat-message',{name:msg.name,message:'User has joined'});
        })
        
        socket.on('chatmessage', function(msg){
            socket.to(req.params.link).broadcast.emit('chat-message',{name:msg.name,message:msg.message});
        })
    })
})
http.listen(PORT, () => {
  console.log('listening on :'+PORT);
});


