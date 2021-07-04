import React from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import {useParams} from 'react-router-dom';

const Chatbox = ({chat, isMine, onClickEdit}) => {
  const {roomUid} = useParams();
  
  const deleteChat = async (chatId) => {
    await db
    .collection('chatrooms').doc(roomUid)
    .collection('chats').doc(chat.id).delete();
  }

  const onClickDelete = (e) => {
    if(!window.confirm('메시지를 삭제 하시겠습니까?')) 
      return;
    deleteChat(chat.id);
  }

  console.log(chat);
  const flexDirection = isMine ? "row-reverse" : "row";
  return (
    <Container style={{flexDirection}}>
      {!isMine && <Profile>{chat.userName}</Profile>}
      <ContentBox>
        {chat.content}
        {
          isMine &&
          <DeleteButton 
            className="far fa-trash-alt"
            onClick={onClickDelete}
            ></DeleteButton>
        }
        {
          isMine &&
          <EditButton 
            className="fas fa-edit"
            onClick={onClickEdit}
            ></EditButton>
        }
        
        
      </ContentBox>
      
    </Container>
  );
}

const DeleteButton = styled.div`
  visibility: hidden;
  width: 17px;
  height: 17px;
  font-size: 1.1rem;
  position: absolute;
  right: 3px;
  top: 5px;
  &:hover {
    transform: scale(1.2);
    cursor: pointer;
  }
`;
const EditButton = styled.div`
  visibility: hidden;
  width: 17px;
  height: 17px;
  font-size: 1.1rem;
  position: absolute;
  top: 5px;
  right: 30px;
  // &:hover {
  //   transform: scale(1.2);
  //   cursor: pointer;
  // }
`;

const ContentBox = styled.div`
  position: relative;
  width: 45%;
  height: auto;
  background-color: #ca87ea;
  padding: 10px;
  padding-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  color: #151515;

  &:hover > .fa-trash-alt {
    visibility: visible
  }
  &:hover > .fa-edit {
    visibility: visible
  }
`;

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
margin-bottom: 15px;
display: flex;
`;




export default Chatbox;

