import React from 'react'
import { Button, Card, Content } from '../style';
import GlobalView from './GlobalView'
import winnerTrophy from '../assets/trophy.png'
import lost from '../assets/lost.png'

function EndView() {

   const status = 1;
   let content = '';
   

  
    if(status === 0){
       content = (<>
        <h2>Toutes nos felicitations, vous avez gagné !!!!!</h2>
            <img src={winnerTrophy} alt='Lancer le dé' style={{width:'100px', height:'100px', marginBottom: '100px'}} /> 
       </>)
    }

    if(status === 1){
      content = (<>
        <h2>Vous avez perdu la partie, courage</h2>
      <img src={lost} alt='Lancer le dé' style={{width:'100px', height:'100px', marginBottom: '100px'}} />
      </>)
    }

    return (
      <>
        <Content>
          <Card width='600px' height='500px'>
               {content}
            <Button className='start'>
              Relancer le jeu
            </Button>
          </Card>
        </Content>
      </>
    );
 
}

export default EndView