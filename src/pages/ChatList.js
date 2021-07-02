import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {firebase, db} from '../firebase';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import InputText from '../components/InputText';
import PageTitle from '../components/PageTitle';


function ChatList() {
  const history = useHistory();
  const userProfile = useSelector((state) => state.user.userProfile);

  const [chatroomList, setChatroomList] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [chatroomTitle, setChatroomTitle] = useState('');
  let chatroomUid = '';

  useEffect(() => {
    if(!userProfile) {
      history.push('/');
    }
    getChatroomList();
  }, [])

  const getChatroomList = async () => {
    const snapshot = await db.collection('chatrooms').orderBy('created').get();
    const chatroomList = [];
    snapshot.forEach((doc) => {
      chatroomList.push(doc.data());
    });
    console.log(chatroomList);
    setChatroomList(chatroomList);
  }

  const onClickToggle = () => {
    console.log(chatroomTitle);
    createChatroom(chatroomTitle);
    setChatroomTitle('');
    
    history.push('/chat/room/' + chatroomUid);
  }
  
  const renderCreateForm = isClicked && (
    <CreateForm>
      <InputText 
        label="방 제목"
        type="text"
        value={chatroomTitle}
        onChange={(e)=>setChatroomTitle(e.target.value)}
        placeholder="방 제목 (15자 이내)"
        maxlength="15"
      />
      <br />
      <CreateButton 
        className="btn btn-primary"
        onClick={onClickToggle}
      > 방 생성하기
      </CreateButton>
    </CreateForm>
  );

  const createChatroom = async (title) => {
    try {
      chatroomUid = uuidv4();
      //chatrooms 추가
      await db.collection('chatrooms').doc(chatroomUid).set({
        title: title, 
        created: firebase.firestore.Timestamp.now(),
        uid: chatroomUid
      });
      // chatroom에 participant 추가
      await db.collection('chatrooms').doc(chatroomUid).collection('participants').doc(userProfile.uid).set({
        uid: userProfile.uid
      });

      // user에 chatroom 추가
      const doc = await db.collection('users').doc(userProfile.uid).get();
      const payload = {...doc.data()};
      payload.chatroomUids.push(chatroomUid);
      await db.collection('users').doc(userProfile.uid).update(
        payload
      );

      console.log('chatroom created!');
    } catch(e) {
      console.error("Error to create chatroom: ", e);
    }
  }

  const renderChatroomList = chatroomList.map((v) => (
    <ChatroomButton onClick={()=>history.push('/chat/room/' + v.uid)} key={v.uid}>
      <Title>{v.title}</Title>
      [입장하기]
    </ChatroomButton>
  ))

  return (
      <Container>
        <PageTitle>Chatroom List</PageTitle>
        <List>
          {chatroomList.length ? renderChatroomList : "만들어진 채팅방이 없습니다."}
        </List>
        <ToggleButton className={isClicked ? "btn btn-secondary" : "btn btn-primary"}
        onClick={() => setIsClicked(!isClicked)}>
          +
        </ToggleButton>

        {renderCreateForm}
      </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const List = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const CreateButton = styled.div`
  
`;

const ToggleButton = styled.div`
`;


const CreateForm = styled.div`
  margin: 16px;
`;

const ChatroomButton = styled.div`
  text-align: center;
  width: 40%;
  height: 50px;
  background-color: #B464EB;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
  color: #151515;
  &:hover {
    background-color: #8a4bb5;
  }
`;

const Title = styled.div`
`;


export default ChatList;