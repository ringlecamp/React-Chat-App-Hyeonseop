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
    const [roomInfo, setRoomInfo] = useState({});
    const [newChat, setNewChat] = useState(null);
    const [modifiedChat, setModifiedChat] = useState(null);

    useEffect(() => {
      if(!userProfile) {
        history.push('/');
      }

      console.log(userProfile);

      getRoomInfo(roomUid);
      getChatsFromDb();
      registerOnSnapshot();
    }, []);

    useEffect(() => {
      if(newChat === null)
        return;
      setChats([
          ...chats,
          newChat
      ]);
    }, [newChat]);

    useEffect(() => {
      if(modifiedChat === null)
        return;
      const cp = [...chats]
      const idx = cp.findIndex(e => e.uid === modifiedChat.uid)
      cp[idx] = modifiedChat;
      setChats(cp);
    }, [modifiedChat]);
    
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

    const registerOnSnapshot = () => {
      db.collection('chatrooms').doc(roomUid)
        .collection('chats').orderBy('created')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if(change.type === 'added') {
              const newEntry = {
                id: change.doc.id,
                ...change.doc.data()
              }
              setNewChat(newEntry);
            }
            else if(change.type === 'modifyed') {
              const newEntry = {
                id: change.doc.id,
                ...change.doc.data()
              }; 
              setModifiedChat(newEntry);
            }
          });
        });
    }

    const exitRoom = async (roomUid) => {

      try{
        // chatroom의 participants collection에서 user 삭제
        await db.collection('chatrooms').doc(roomUid)
                .collection('participants').doc(userProfile.uid);

        // user의 chatroomUids에 해당 지금 roomUid 삭제
        const ref = db.collection('users').doc(userProfile.uid);
          // 현재 chatroomUids 불러오기
        const doc = await ref.get();
        const updatedChatroomUids = doc.data().chatroomUids.filter((v) => v !== roomUid);
        const payload = {
          chatroomUids: updatedChatroomUids
        };
          // update
        await ref.update(payload)
        
        // '/chat/list'로 redirect
        alert(`채팅방을 나갔습니다.`);
        history.push('/chat/list');

      } catch(e) {
        console.log('에라', e);
      }
    }

    const getRoomInfo = async (roomUid) => {
      const doc = await db.collection('chatrooms').doc(roomUid).get();
      const roomInfo = doc.data();
      console.log('roomInfo~~ : ', roomInfo);
      setRoomInfo({...roomInfo});
    }

    const sendChat = async (content) => {
      if(content.trim().length === 0)
        return;
      const payload = {
        userUid: userProfile.uid,
        userName: userProfile.name,
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
        author={chat.userName}
      />
    ));

    return (
      <Container>
        <Top>
          <Title>{roomInfo.title}</Title>
          <ButtonContainer>
            <div className="btn btn-danger" onClick={()=>history.push('/chat/list')}>방 리스트</div>
          </ButtonContainer>
          <ButtonContainer>
            <div className="btn btn-danger" onClick={()=>exitRoom(roomUid)}>나가기</div>
          </ButtonContainer>
        </Top>
        
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

const ButtonContainer = styled.div`

`;

const Top = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 1.5rem;
`;

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
  padding: 5px;
`;

export default ChatRoom;