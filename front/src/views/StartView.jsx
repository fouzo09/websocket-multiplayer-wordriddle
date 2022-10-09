import React, {useRef, useState} from 'react'
import styled from 'styled-components';
import { Button, Content, Card } from '../style';
import { generateGameCode } from '../helpers';

const Input = styled.input`
  height: 32px;
  border: solid 1px #dee2e6;
  border-radius: 5px;
  margin-bottom: 12px;
  &:focus{
    outline: none !important;
    border: solid 1px #dee2e6;
    border-radius: 5px;
  }
`

const GuestCode = styled.p`
  background-color: #c0c0c047;
  min-width: 150px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`
const REACT_URL = 'http://localhost:3000';

function StartView({gameId, configGame}) {

  const [guestLink, setGuestLink] = useState();
  const [initiator, setInitiator] = useState();
  const [guest, setGuest] = useState();
  const [gameCode, setGameCode] = useState(null);
  const input = useRef();

  const setInitiatorName = ()=>{
  
    const generatedGameCode = 1; //generateGameCode(6);
    const newGame = `${REACT_URL}/${generatedGameCode}`;
    
    setGameCode(generatedGameCode);
    setInitiator(input.current.value);
    setGuestLink(newGame);
    configGame(generatedGameCode, input.current.value);
  }

  const setGuestName = ()=>{

    setGuest(input.current.value);
    configGame(gameId, input.current.value);
  }

  if(!gameId){
    if(!initiator){
      return (
        <Content>
          <Card width='600px'>
            <form style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '80%'}}>
              <label>Votre pseudo</label>
              <Input type='text' ref={input} name='initiator' />
            </form>
            <Button className='start' onClick={setInitiatorName}>
                Démarrer le jeu
            </Button>
          </Card>
        </Content>
      )
    }else{
      return (
        <Content>
          <Card width='600px'>
              <p>Partager ce lien à votre invité</p>
              <GuestCode>
                <a target='blank' href={guestLink}>{guestLink}</a>
              </GuestCode>
          </Card>
        </Content>
      )
    }
    
  }
  
  if(gameId){
    if(!guest){
      return (
        <Content>
          <Card width='600px'>
            <form style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '80%'}}>
              <label>Pseudo de l'invité</label>
              <Input type='text' ref={input} name='guest' />
            </form>
            <Button className='start' onClick={setGuestName}>
                Rejoindre la partie
            </Button>
          </Card>
        </Content>
      )
    }else{
      return (
        <Content>
          <Card width='600px'>
            <p>Patientez le temps que votre adversaire lance le dé.</p>
          </Card>
        </Content>
      )
    }
  }
}

export default StartView;