const http = require('http');
const WebSocketServer = require('websocket').server;

let connection = null;
const PORT = 8081;
const games = [];
const gamers = [];
const ACTIONS = [
    {'START': 'START'}
];

const httpServer = http.createServer((req, res)=>{
    console.log('Creation du serveur.')
});

const websocket = new WebSocketServer({ 'httpServer': httpServer });

websocket.on("request", request=>{
    
    connection = request.accept(null, request.origin);
    const gameID = request.resourceURL.pathname.split('/')[1];
    const gamerName = request.resourceURL.pathname.split('/')[2];


    if(gameID && !games[gameID]){
        games[gameID] = { 
            [gamerName]: {
                connection: connection, 
                infos: {    
                    name: gamerName, 
                    title: 'Initiator', 
                    score: 0, 
                    isGuesser: false
                }
            } 
        };
        console.log(`Game ${gameID} created and ${gamerName} was added !!!!`);
    }
    
    if(gameID && games[gameID]){
        if(gamerName && !Object.keys(games[gameID]).includes(gamerName)){
            games[gameID] = { 
                    ...games[gameID], 
                    [gamerName]: {
                        connection: connection, 
                        infos: {    
                            name: gamerName, 
                            title: 'Guest', 
                            score: 0, 
                            isGuesser: true
                        }
                    }  
                };
            
            console.log(`${gamerName} join ${gameID} group game !!!!`);
            const initiator = getInitiator(gameID);
            startGame(games[gameID][initiator.infos.name].connection)
        }
    }

    connection.on("message", (message)=>{
        const {gameID, content, action} = JSON.parse(message.utf8Data);
        switch (action.toUpperCase()) {
            case 'START':{
                const initiator = getInitiator(gameID);
                startGame(games[gameID][initiator.infos.name].connection);
                break;
            }
            case 'PREDICT':{
                const guesser = getGuesser(gameID);
                console.log(guesser.infos);
                sendNumbersToPredict(games[gameID][guesser.infos.name].connection, content);
                break;
            }
            default:{
                break;
            }  
        }
    });

    // connection.on("close", ()=>console.log("CLOSED !!!!!!!!"));
});


const startGame = (connection)=>{
    if(!connection) return false;
    connection.send(JSON.stringify({action: 'STARTED', message: 'started game.'}));
}
const sendNumbersToPredict = (connection, content)=>{
    if(!connection) return false;
    connection.send(JSON.stringify({action: 'PREDICT', message: content}));
}
const getInitiator = (gameID)=>{
    if(!gameID || !games[gameID]) return false;
    const initiator = Object.values(games[gameID]).find(
        gamer => gamer?.infos?.title === 'Initiator'
    );
    return initiator;
}

const getGuest = (gameID)=>{
    if(!gameID || !games[gameID]) return false;
    const guest = Object.values(games[gameID]).find(
        gamer => gamer?.infos?.title === 'Guest'
    );
    return guest;
}

const getGuesser = (gameID)=>{
    if(!gameID || !games[gameID]) return false;
    const guesser = Object.values(games[gameID]).find(
        gamer => gamer?.infos?.isGuesser === true
    );
    return guesser;
}


/*gamers[
    {
        id: 1,
        pseudo: 'fouzo09',
        hasHand: 1,
        score: 10,
    },
    {

    }
]
    let ws = new WebSocket("ws://localhost:8081/uU0lgH");
    ws.onmessage = message => console.log(`Received: ${message.data}`);
    socket.send("Salut !!!!");
*/


httpServer.listen(PORT, ()=>console.log(`Le serveur est demaré: http://localhost:${PORT}`));