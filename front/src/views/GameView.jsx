import React, {useState} from 'react'
import {Content, Card, Button} from '../style';
import styled from 'styled-components';

import { generateNumbers } from '../helpers';

const Numbers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 50px;
  font-weight: bold;
  width: 90px;
  height: 90px;
  margin: 10px;
  border-radius: 5px;
  background-color: #ced4da;
  box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 32%);
  &.selected-number{
    background-color: green;
    color: #fff;
  }
`;

const Score = styled.div`
  width: 100px;
  height: 100px;
  border: solid 1px black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 3rem;
  position: absolute;
  top: 3px;
  right: 3px;
`


const GameView = ({gameId, configGame, sendNumbersToPredict, numbersToPredict})=>{

  const [imgSrc, setImgSrc] = useState('assets/de1.png');
  const [score, setScore] = useState(0);

  const launchDice = ()=>{    

    setImgSrc('assets/dice.gif');

    const randomValue = Math.floor(Math.random() * 6) + 1;
    const allNumbers = generateNumbers(randomValue);
    
    setTimeout(()=>{
      setImgSrc(`assets/de${randomValue}.png`);
      sendNumbersToPredict(gameId, allNumbers);
    }, 1000);

  }

  const choice = ()=>{    
    setScore((prevState)=>{
      return prevState + 10;
    });
  }

  if(!gameId){
    return (
      <Content>
        <Card width='600px' height='500px'>
          <img src={imgSrc} alt='Lancer le dé' style={{width:'100px', height:'100px', marginBottom: '100px'}} />   
          <Button className='start' onClick={launchDice}>
              Lancer le dé
          </Button>
          <Score>
             <span style={{fontSize: '16px'}}>Score</span>
             {score}
           </Score>  
        </Card>
      </Content>
    );
  }

  if(gameId){
   
    return (
      <Content>
        <Card width='600px' height='500px'>
          {numbersToPredict &&
            <>
              <h3>Devinez le chiffre sorti par votre adversaire</h3>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {numbersToPredict.map((item, key)=>(
                    <Numbers key={key} onClick={choice}>{item}</Numbers>
                  ))}
              </div>
            </> }
           
           <Score>
             <span style={{fontSize: '16px'}}>Score</span>
             {score}
           </Score>
        </Card>
      </Content>
    );
  }
 
}

export default GameView;