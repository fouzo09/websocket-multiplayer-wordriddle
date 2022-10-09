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
            numbersToPredict: null,
            ws: null
        }

        this.setStep = this.setStep.bind(this);
        this.configGame = this.configGame.bind(this);
        this.sendNumbersToPredict = this.sendNumbersToPredict.bind(this);
    }

    componentDidUpdate(){
        console.log(this.state);
    }

    setStep(){
        this.setState((prevState)=>{
            return {step : prevState.step + 1};
        });
    }

    async configWebSocket(gameID, gamerName){
        const wsConnection = new WebSocket(`${CHANNEL}/${gameID}/${gamerName}`);
        this.setState({...this.state, ws: wsConnection});
    }

    configGame(gameID, gamerName){
        const self = this;
        this.configWebSocket(gameID, gamerName).then(()=> {
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
                        break;
                    }
                    default:{
                        break;
                    } 
                }
            }
        });
    }

    sendNumbersToPredict(gameID, randomValues){
       gameID = 1;
        this.state.ws.send(JSON.stringify({
            gameID, 
            content: {randomValues, best: randomValues[0]},
            action: 'PREDICT'
        }));
    }

    render(){

        let content = '';

        if(this.state.step === 1){
            content = (<StartView 
                            step={this.state.step} 
                            configGame={this.configGame}
                            gameId={this.props.params.gameId}
                            joinGame={this.joinGame} />);
        }

        if(this.state.step === 2){
            content = (<GameView 
                            step={this.state.step}
                            gameId={this.props.params.gameId}
                            joinGame={this.joinGame} 
                            configGame={this.configGame} 
                            sendNumbersToPredict={this.sendNumbersToPredict}
                            numbersToPredict={this.state.numbersToPredict}/>);
        }

        return (
            <Container>
                {content}
            </Container>);
    }
}

export default withRouter(GlobalViewComponent);