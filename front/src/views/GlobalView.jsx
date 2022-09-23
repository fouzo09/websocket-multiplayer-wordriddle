import React from 'react'
import { Container } from '../style';

const steps = [
    {
        id: 1,
        name: 'Start'
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
]



const GlobalView = WrapperComponent =>{
    class GlobalViewComponent extends React.Component{

        constructor(props){
            super(props);
            this.state = {
                step: steps[0].id
            }

            this.startGame = this.startGame.bind(this);

        }

        componentDidUpdate(){

        }

        startGame(){
            console.log('Start the game');
            this.setState((prevState)=>{ 
                return {step: prevState.step + 1}
            });
        }
        
        render(){
            return (
                <Container>
                    <WrapperComponent startGame={this.startGame} step={this.state.step} />
                </Container>
            )
        }
    }

    return GlobalViewComponent;
}

export default GlobalView