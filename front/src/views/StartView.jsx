import React from 'react'
import styled from 'styled-components';
import { Button, Content, Card } from '../style';
import GlobalView from './GlobalView'

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

function StartView({step, startGame}) {

  console.log(step);

  if(step === 1){
    return (
      <Content>
        <Card width='600px'>
          <form style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '80%'}}>
            <label>Votre pseudo</label>
            <Input type='text' name='initiator' />
            <label>Pseudo de l'invité</label>
            <Input type='text' name='guest' />
          </form>
          <Button className='start' onClick={startGame}>
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
              <a target='blank' href="https://wordriddle.com/yoj-buim-mhy">https://wordriddle.com/yoj-buim-mhy</a>
            </GuestCode>
        </Card>
      </Content>
    )
  }
  
}

export default GlobalView(StartView);