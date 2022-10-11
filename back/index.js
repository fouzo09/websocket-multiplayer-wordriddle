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
    const gameId = request.resourceURL.pathname.split('/')[1];
    const gamerName = request.resourceURL.pathname.split('/')[2];


    if(gameId && !games[gameId]){
        games[gameId] = { 
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
        console.log(`Game ${gameId} created and ${gamerName} was added !!!!`);
    }
    
    if(gameId && games[gameId]){
        if(gamerName && !Object.keys(games[gameId]).includes(gamerName)){
            games[gameId] = { 
                    ...games[gameId], 
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
            
            console.log(`${gamerName} join ${gameId} group game !!!!`);
            const initiator = getInitiator(gameId);
            startGame(games[gameId][initiator.infos.name].connection)
        }
    }

    connection.on("message", async(message)=>{
        const {gameId, content, action} = JSON.parse(message.utf8Data);
        console.log(games, gameId);
        switch (action.toUpperCase()) {
            case 'START':{
                const initiator = getInitiator(gameId);
                startGame(games[gameId][initiator.infos.name].connection);
                break;
            }
            case 'PREDICT':{
                const guesser = getGuesser(gameId);
                console.log(guesser.infos);
                sendNumbersToPredict(games[gameId][guesser.infos.name].connection, content);
                break;
            }

            case 'SEND_RESPONSE_AFTER_PREDICTING':{
                const randomizer = getRandomizer(gameId);
                await sendResponseAfterPredicting(gameId, games[gameId][randomizer.infos.name].connection, content);
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

const sendResponseAfterPredicting = async(gameId, connection, content)=>{
    if(!connection) return false;
    if(content){
        await setGamerStatus(gameId);
    };
    connection.send(JSON.stringify({action: 'GET_RESPONSE_AFTER_PREDICTING', message: content}));
}

const getInitiator = (gameId)=>{
    if(!gameId || !games[gameId]) return false;
    const initiator = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.title === 'Initiator'
    );
    return initiator;
}

const getGuest = (gameId)=>{
    if(!gameId || !games[gameId]) return false;
    const guest = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.title === 'Guest'
    );
    return guest;
}


const getGuesser = (gameId)=>{
    if(!gameId || !games[gameId]) return false;
    const guesser = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.isGuesser === true
    );
    return guesser;
}

const getRandomizer = (gameId)=>{
    if(!gameId || !games[gameId]) return false;
    const randomizer = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.isGuesser !== true
    );
    return randomizer;
}

const setGamerStatus = async(gameId)=>{
    if(!gameId || !games[gameId]) return false;

    const guesser = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.isGuesser === true
    );
    guesser.infos.isGuesser = false;

    const randomizer = Object.values(games[gameId]).find(
        gamer => gamer?.infos?.isGuesser === false
    );
    randomizer.infos.isGuesser = true;
    games[gameId] = [];
    games[gameId][guesser.infos.name] = guesser;
    games[gameId][randomizer.infos.name] = randomizer;
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