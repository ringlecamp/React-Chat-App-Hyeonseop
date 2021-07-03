import React from 'react';
import styled from 'styled-components';

const Chatbox = ({content, isMine, author}) => {
  const flexDirection = isMine ? "row-reverse" : "row";
  return (
    <Container style={{flexDirection}}>
      {!isMine && <Profile>{author}</Profile>}
      <Content>{content}</Content>
    </Container>
  );
}

const Profile = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  color: #EEEEEE;
  overflow: hidden;
  text-align: center;
  // vertical-align
  font-size: 1em;
  line-height: 3em;
  background-color: purple;
`;

const Container = styled.div`
width: 100%;
height: auto;
display: flex;
`;

const Content = styled.div`
  width: 45%;
  height: auto;
  background-color: #ca87ea;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  color: #151515;
`;


export default Chatbox;

