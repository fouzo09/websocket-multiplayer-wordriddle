const http = require('http');
const WebSocketServer = require('websocket').server;

let connection = null;
const PORT = 8081;
const users = [];

const httpServer = http.createServer((req, res)=>{
    console.log('Creation du serveur.')
});
const websocket = new WebSocketServer({
    'httpServer': httpServer
});

websocket.on("request", request=>{

    connection = request.accept(null, request.origin);
    const userID = request.resourceURL.pathname.split('/')[1];
    

    if(!userID) return false;

    console.log(`Welcome ${userID}`);

    users[userID] = connection;

    connection.on("open", ()=>console.log("OPENED !!!!!!!!"));
    connection.on("close", ()=>console.log("CLOSED !!!!!!!!"));
    connection.on("message", (message)=>{
        message = JSON.parse(message.utf8Data);
        const userID = message.userID;
        const content = message.content;
        console.log();
        sendMessage(content, userID)
    });
});

const sendMessage = (message, userID = null)=>{
    if(userID){
        users[userID].send(message);
    }
}


httpServer.listen(PORT, ()=>console.log(`Le serveur est demaré: http://localhost:${PORT}`));