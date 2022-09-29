import React, {useState} from 'react'
import styled from 'styled-components';
import { Button, Content, Card } from '../style';
import GlobalView from './GlobalView'
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

function StartView({step, configGame}) {

  const [guestLink, setGuestLink] = useState();
  const [initiator, setInitiator] = useState('fouzo09');
  const [guest, setGuest] = useState('lambert');

  const setConfigGame = ()=>{
  
    const gameCode = generateGameCode(6);
    const newGame = `${REACT_URL}/${gameCode}`;

    setGuestLink(newGame);
    configGame(1, initiator);
  }

  const inputChange = (event)=>{
    switch (event.target.name) {
      case 'initiator':{
        setInitiator(event.target.value);        
        break;
      }
      case 'guest':{
        setGuest(event.target.value);        
        break;
      }
      default:{
        return false;
      }
    }
  }

  
  if(step === 1){
    return (
      <Content>
        <Card width='600px'>
          <form style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '80%'}}>
            <label>Votre pseudo</label>
            <Input type='text' value={initiator} onChange={inputChange} name='initiator' />
            <label>Pseudo de l'invité</label>
            <Input type='text' value={guest} onChange={inputChange} name='guest' />
          </form>
          <Button className='start' onClick={setConfigGame}>
              Démarrer le jeu
          </Button>
        </Card>
      </Content>
    )
  }

  if(step === 2){
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

export default GlobalView(StartView);