import React from 'react'
import { Container } from '../style';

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
const REACT_URL = 'http://localhost:3000';

const GlobalView = WrapperComponent => {
    class GlobalViewComponent extends React.Component{
        

        constructor(props){
            super(props);
            this.state = {
                step: steps[0].id,
                ws: null
            }

            this.setStep = this.setStep.bind(this);
            this.configGame = this.configGame.bind(this);
            this.joinGame = this.joinGame.bind(this);
            this.sendNumberToPredict = this.sendNumberToPredict.bind(this);
        }

        componentDidUpdate(){
           
        }

        setStep(){
            this.setState((prevState)=>{
                return {step : prevState.step + 1};
            });
        }

        async configWebSocket(gameID, gamerName){
            this.setState({...this.state, ws: new WebSocket(`${CHANNEL}/${gameID}/${gamerName}`)});
        }

        configGame(gameID, initiator){
            const self = this;
            this.configWebSocket(gameID, initiator).then(()=> {
                
                self.state.ws.onmessage = (response)=>{
                    const data = JSON.parse(response.data);
                    switch (data.action) {
                        case 'STARTED':{
                            window.location.href = '/game';
                            break;
                        }
                        default:{
                            break;
                        } 
                    }
                }
            });
            this.setStep();
        }

        joinGame(gameID, guest){
            const self = this;
            this.configWebSocket(gameID, guest).then(()=> {
                self.state.ws.onmessage = (message)=>{
                    console.log(message);
                }
            });
        }


        sendNumberToPredict(gameID, randomValues){
            console.log(randomValues);
            this.state.ws.send(JSON.stringify({
                gameID, 
                content: randomValues, 
                best: randomValues[0],
                action: 'DISPLAY_DE_VALUE'
            }));
        }

        render(){
            return (
                <Container>
                    <WrapperComponent 
                        step={this.state.step} 
                        configGame={this.configGame}
                        joinGame={this.joinGame}
                        sendNumberToPredict={this.sendNumberToPredict}/>
                </Container>
            )
        }
    }

    return GlobalViewComponent;
}

export default GlobalView;