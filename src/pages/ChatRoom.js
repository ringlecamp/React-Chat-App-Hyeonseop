import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {firebase, db, firebaseApp} from '../firebase';
import InputText from '../components/InputText';
import InputChat from '../components/InputChat';
import Chatbox from '../components/Chatbox';
import {setUserProfile} from '../reducers/user';
import styled from 'styled-components';
import ParticipantList from '../components/ParticipantList';

function ChatRoom() {
    const history = useHistory();
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.userProfile);

    const { roomUid } = useParams();
    const [chats, setChats] = useState([]);
    const [chatContent, setChatContent] = useState('');
    const [roomInfo, setRoomInfo] = useState({});

    const [newChat, setNewChat] = useState(null);
    const [modifiedChat, setModifiedChat] = useState(null);
    const [removedChat, setRemovedChat] = useState(null);

    

    useEffect(() => {
      if(!userProfile || !userProfile.chatroomUids.includes(roomUid)) {
        alert('권한이 없습니다.');
        history.push('/chat/list');
      }

      console.log(userProfile);

      getRoomInfo(roomUid);
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

    useEffect(() => {
      if(removedChat === null)
        return;
      const cp = chats.map((v)=> {
        if(v.id == removedChat.id) {
          v.isRemoved = true;
          v.content = "[삭제된 메시지 입니다.]";
        }
        return v;
      });
      setChats(cp);
    }, [removedChat]);

    
    const registerOnSnapshot = () => {
      // for chat
      db.collection('chatrooms').doc(roomUid)
        .collection('chats').orderBy('createdAt')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if(change.type === 'added') {
              const newEntry = {
                id: change.doc.id,
                ...change.doc.data()
              }

              if(chats.map((v) => v.id === newEntry.id).length === 0)
                setNewChat(newEntry);
            } else if(change.type === 'modified') {
              const newEntry = {
                id: change.doc.id,
                ...change.doc.data()
              }; 
              setModifiedChat(newEntry);
            } else if(change.type === 'removed') {
              console.log('removed!!!!');
              const newEntry = {
                id: change.doc.id,
                ...change.doc.data()
              }; 
              setRemovedChat(newEntry);
            }
          });
        });
    }

    const exitChatRoom = async (roomUid) => {
      try{
        // chatroom의 participants collection에서 user 삭제
        await db.collection('chatrooms').doc(roomUid)
                .collection('participants').doc(userProfile.uid).delete();
        
        // user의 chatroomUids에 지금 roomUid 삭제
        const ref = db.collection('users').doc(userProfile.uid);
          // 현재 chatroomUids 불러오기
        const userDoc = await ref.get();
        const updatedChatroomUids = userDoc.data().chatroomUids.filter((v) => v !== roomUid);
        const payload = {
          chatroomUids: updatedChatroomUids
        };
          // update
        await ref.update(payload)

        // userProfile에서 roomUid 빼기  (Redux)
        const cp = {...userProfile};
        const chatroomUids = cp.chatroomUids.filter((uid) => uid !== roomUid);
        cp.chatroomUids = chatroomUids;
        dispatch(setUserProfile(cp));


        // chatroom 가져오기
        const roomDoc = await db.collection('chatrooms').doc(roomUid).get();
        const chatroom = roomDoc.data();

        // 만약 방에 나밖에 없으면 방 자체를 삭제
        if(chatroom.curNum === 1) {
          await db.collection('chatrooms').doc(roomUid).delete();
          alert(`인원이 없어 채팅방이 자동으로 삭제되었습니다.`);
          history.push('/chat/list');
          return;
        }

        // chatroom의 curNum 필드 1 빼기
        await db.collection('chatrooms').doc(roomUid).update({
          ...chatroom,
          curNum: chatroom.curNum - 1
        });

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
      setRoomInfo({...roomInfo});
    }

    const sendChat = async (content) => {
      if(content.trim().length === 0)
        return;
      const payload = {
        userUid: userProfile.uid,
        userName: userProfile.name,
        createdAt: firebase.firestore.Timestamp.now(),
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
    }

    const renderChatboxes = chats.map((chat) => (
      <Chatbox 
        key={chat.id}
        chat={chat}
        isMine={chat.userUid === userProfile.uid}
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
            <div className="btn btn-danger" onClick={()=>exitChatRoom(roomUid)}>나가기</div>
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

        <ParticipantList 
          roomInfo={roomInfo} 
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
  position: relative;
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