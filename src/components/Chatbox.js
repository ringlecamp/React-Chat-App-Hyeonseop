import React from 'react';
import styled from 'styled-components';

const Chatbox = ({content, isMine}) => {
  const flexDirection = isMine ? "row-reverse" : "row";
  return (
    <Container style={{flexDirection}}>
      <Content>{content}</Content>
    </Container>
  );
}

const Container = styled.div`
width: 100%;
height: auto;
display: flex;
`;

const Content = styled.div`
  width: 50%;
  height: auto;
  background-color: #ca87ea;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  color: #151515;
`;


export default Chatbox;

