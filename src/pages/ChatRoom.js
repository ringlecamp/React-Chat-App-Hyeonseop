import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {firebase, db, firebaseApp} from '../firebase';
import InputText from '../components/InputText';
import InputChat from '../components/InputChat';
import Chatbox from '../components/Chatbox';
import {setUserProfile} from '../reducers/user';
import styled from 'styled-components';

function ChatRoom() {
    const history = useHistory();
    const userProfile = useSelector((state) => state.user.userProfile);

    const { roomUid } = useParams();
    const [chats, setChats] = useState([]);
    const [chatContent, setChatContent] = useState('');

    useEffect(() => {
      if(!userProfile) {
        history.push('/');
      }
      // TODO: 권한 체크

      console.log(userProfile);

      getChatsFromDb();
    }, []);
    
    const getChatsFromDb = async () => {
      const snapshot = await db.collection('chatrooms').doc(roomUid)
        .collection('chats').orderBy('created').get();
      
      const chats = [];
      snapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log(chats);
      setChats(chats);
    }

    const sendChat = async (content) => {
      const payload = {
        userUid: userProfile.uid,
        created: firebase.firestore.Timestamp.now(),
        content: content
      };
      const ref = await db.collection('chatrooms').doc(roomUid)
      .collection('chats').add(payload);
      console.log('sendChat : ', ref);
    }

    const onSubmit = (e) => {
      e.preventDefault();
      sendChat(chatContent); 
      setChatContent('');
      //이거 방식 바꾸기?
      getChatsFromDb();
    }


    const renderChatboxes = chats.map((chat) => (
      <Chatbox 
        key={chat.id}
        content={chat.content}
        isMine={chat.userUid === userProfile.uid}
      />
    ));

    return (
      <Container>
        <h1>Chat Room {roomUid}</h1>
        <ChatList>
          {renderChatboxes}
        </ChatList>
        <InputChat 
          value={chatContent}
          onChange={(e)=>setChatContent(e.target.value)}
          onSubmit={onSubmit}
        />
      </Container>
    );
}

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  width: 100%;
  height: 100%;
`;

const ChatList = styled.div`
  width: 100%;
  height: 80%;
  displey: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  border: solid 1px #b975b9; /*  */
`;

const ChatContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row-reverse;
`;

export default ChatRoom;