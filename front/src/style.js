import styled from 'styled-components';

export const Container = styled.div`
        background-color: #000000;
        height: 100vh;
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