import React from 'react'
import { Container } from '../style';
import GameView from './GameView';
import StartView from './StartView';
import withRouter from './withRouter';

const steps = [
    {
        id: 1,
        name: 'Welcome'
    },
    {
        id: 2,
        name: 'Invitation'
    },
    {
        id: 3,
        name: 'Wait guest response'
    },
    {
        id: 4,
        name: 'Started'
    },
    {
        id: 5,
        name: 'End'
    }
];


const CHANNEL = 'ws://localhost:8081';

class GlobalViewComponent extends React.Component{
    

    constructor(props){
        super(props);
       
        this.state = {
            step: steps[0].id,
            gameId: (this.props.params.gameId) ? this.props.params.gameId : null,
            setRandomizerScore: false,
            numbersToPredict: null,
            ws: null,
            score: 0,
            gamerStatus: (!props.params.gameId) ? 'RANDOMIZER' : 'GUESSER',
        }

        console.log(this.props.params);

        this.setStep = this.setStep.bind(this);
        this.configGame = this.configGame.bind(this);
        this.sendNumbersToPredict = this.sendNumbersToPredict.bind(this);
        this.sendResponseAfterPredicting = this.sendResponseAfterPredicting.bind(this);
        this.setGamerStatus = this.setGamerStatus.bind(this);
        this.setScore = this.setScore.bind(this);
        this.setGameId = this.setGameId.bind(this);
    }

    componentDidUpdate(){
        console.log(this.state);
    }

    setGamerStatus(){

        if(this.state.gamerStatus === 'RANDOMIZER'){
            this.setState((prevState)=>{
                return {...prevState, gamerStatus: 'GUESSER'};
            });
        }else{
            this.setState((prevState)=>{
                return {...prevState, gamerStatus: 'RANDOMIZER'};
            });
        }
    }

    setScore(){
        const newScore = this.state.score + 10
        this.setState((prevState)=>{
            return {...prevState, score: newScore};
        });
    }

    setStep(){
        this.setState((prevState)=>{
            return {step : prevState.step + 1};
        });
    }

    setGameId(gameId){
        console.log(gameId);
        this.setState((prevState)=>{
            return {step : prevState.step + 1};
        });
    }

    async configWebSocket(gameId, gamerName){
        const wsConnection = new WebSocket(`${CHANNEL}/${gameId}/${gamerName}`);
        this.setState({...this.state, ws: wsConnection});
    }

    configGame(gameId, gamerName){
        const self = this;
        
        this.configWebSocket(gameId, gamerName).then(()=> {
            self.state.ws.onmessage = (response)=>{
                const data = JSON.parse(response.data);
                switch (data.action) {
                    case 'STARTED':{
                        console.log(data);
                        self.setStep();     
                        break;
                    }
                    case 'PREDICT':{
                        console.log(data);
                        self.setState((prevState)=>{
                            return {
                                ...prevState,
                                step: 2,
                                numbersToPredict: data.message.randomValues,
                                best: data.message.best
                            }
                        });
                        document.querySelectorAll('.numbersBtn').forEach((element)=>{
                            element.classList.remove('deactivated-number');
                            element.classList.remove('selected-number');
                        })
                        break;
                    }
                    case 'GET_RESPONSE_AFTER_PREDICTING':{
                        if(data.message === false){
                            self.setState((prevState)=>{
                                return {
                                    ...prevState,
                                    setRandomizerScore: true
                                }
                            });
                            self.setScore();
                        }else{
                            console.log('Vous avez perdu, c\'est à votre adversaire de lancer le dé.')
                            self.setState((prevState)=>{
                                return {
                                    ...prevState,
                                    gamerStatus: 'GUESSER',
                                    numbersToPredict: null
                                }
                            });
                        }
                        
                        break;
                    }
                    default:{
                        break;
                    } 
                }
            }
        });

        this.setState((prevState)=>{
            return {gameId};
        });

    }

    sendNumbersToPredict(gameId, randomValues, best){
        console.log(this.state, gameId);
        this.state.ws.send(JSON.stringify({
            gameId, 
            content: {randomValues, best},
            action: 'PREDICT'
        }));
    }


    sendResponseAfterPredicting(gameId, responseValue){

         this.state.ws.send(JSON.stringify({
             gameId, 
             content: responseValue,
             action: 'SEND_RESPONSE_AFTER_PREDICTING'
         }));
     }

    render(){

        let content = '';

        if(this.state.step === 1){
            content = (<StartView 
                            step={this.state.step} 
                            setGamerStatus={this.setGamerStatus}
                            gamerStatus={this.state.gamerStatus}
                            configGame={this.configGame}
                            gameId={this.state.gameId}
                            setGameId={this.setGameId}
                            joinGame={this.joinGame} />);
        }

        if(this.state.step === 2){
            content = (<GameView 
                            step={this.state.step}
                            setScore={this.setScore}
                            score={this.state.score}
                            setGamerStatus={this.setGamerStatus}
                            gamerStatus={this.state.gamerStatus}
                            gameId={this.state.gameId}
                            setGameId={this.setGameId}
                            joinGame={this.joinGame} 
                            configGame={this.configGame} 
                            sendNumbersToPredict={this.sendNumbersToPredict}
                            numbersToPredict={this.state.numbersToPredict}
                            best={this.state.best}
                            setRandomizerScore={this.state.setRandomizerScore}
                            sendResponseAfterPredicting={this.sendResponseAfterPredicting}/>);
        }

        return (
            <Container>
                {content}
            </Container>);
    }
}

export default withRouter(GlobalViewComponent);