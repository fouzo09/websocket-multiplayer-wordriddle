import React, {useEffect, useRef, useState} from 'react'
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
  &.deactivated-number{
    pointer-events: none;
    opacity: 0.4;
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


const GameView = ({ gameId, configGame, sendNumbersToPredict, 
                    numbersToPredict, best, sendResponseAfterPredicting,
                    setRandomizerScore, score, setScore, setGamerStatus, gamerStatus})=>{

  const [imgSrc, setImgSrc] = useState('assets/de1.png');

  const launchDice = ()=>{    

    setImgSrc('assets/dice.gif');

    const randomValue = Math.floor(Math.random() * 6) + 1;
    const allNumbers = generateNumbers(randomValue);
    const best = randomValue;
    
    setTimeout(()=>{
      setImgSrc(`assets/de${randomValue}.png`);
      sendNumbersToPredict(gameId, allNumbers, best);
    }, 1000);

  }

  const choice = (event)=>{   
    event.currentTarget.classList.add('selected-number');
    document.querySelectorAll('.numbersBtn').forEach((element)=>{
      element.classList.add('deactivated-number');
    });

    if(event.currentTarget.getAttribute('value').toString() === best.toString()){
      setScore();
      sendResponseAfterPredicting(gameId, true);
      setGamerStatus()
    }else{
      sendResponseAfterPredicting(gameId, false);
    }
  }

  if(gamerStatus === 'RANDOMIZER'){
    
    return (
      <Content>
        <Card width='600px' height='500px'>
          <img src={imgSrc} alt='Lancer le d??' style={{width:'100px', height:'100px', marginBottom: '100px'}} />   
          <Button className='start' onClick={launchDice}>
              Lancer le d??
          </Button>
          <Score>
             <span style={{fontSize: '16px'}}>Score</span>
             {score}
           </Score>  
        </Card>
      </Content>
    );
  }

  if(gamerStatus === 'GUESSER'){

    if(!numbersToPredict){
      return (
        <Content>
          <Card width='600px'>
            <p>Vous avez perdu, c'est ?? votre adversaire de lancer le d??, patientez svp.</p>
          </Card>
        </Content>
      )
    }
   

    return (
      <Content>
        <Card width='600px' height='500px'>
          {numbersToPredict &&
            <>
              <h3>Devinez le chiffre sorti par votre adversaire</h3>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {numbersToPredict.map((item, key)=>(
                    <Numbers value={item} className='numbersBtn' key={key} onClick={choice}>{item}</Numbers>
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