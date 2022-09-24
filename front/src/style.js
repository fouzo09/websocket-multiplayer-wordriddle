import styled from 'styled-components';

export const Container = styled.div`
        background-color: #000000;
        height: 100vh;
`;

export const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
`;

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  justify-content: center;
  align-items: center;
  width: ${props => props.width || '100px'};
  height: ${props => props.width || '100px'};
  background-color: ${props => props.bgcolor || '#fff'};
  padding: 10px;
`;

export const Button = styled.button`
        background-color: #868e96;
        cursor: pointer;
        font-size: 1rem;
        &.start{
                font-size: 1.7rem;
                height: 60px;
                width: 80%;
                border: solid 1px #868e96;
        }
`;