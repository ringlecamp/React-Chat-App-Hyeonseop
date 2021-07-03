import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {firebase, db} from '../firebase';
import {useDispatch, useSelector} from 'react-redux';
import { setUserProfile } from '../reducers/user';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import InputText from '../components/InputText';
import PageTitle from '../components/PageTitle';
import InputCheckbox from '../components/InputCheckbox';
import CreateRoomForm from '../components/CreateRoomForm';

const ChatList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [chatroomList, setChatroomList] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  // 방 만들기 input
  const [inputState, setInputState] = useState({
    title: '',
    isPrivate: false,
    pw: '',
    num: 4
  });

  // 내가 참여한방 보기(flase) or 모든방보기 (true)
  const [isViewAllRoom, setIsViewAllRoom] = useState(false);

  // 로그아웃 상태일 때
  useEffect(() => {
    if(!userProfile) {
      history.push('/');
      return;
    }
    getChatroomList();
  }, [])


  /* functions interact with db */

  const getChatroomList = async () => {
    const snapshot = await db.collection('chatrooms').orderBy('created').get();
    const chatroomList = [];
    snapshot.forEach((doc) => {
      chatroomList.push(doc.data());
    });
    console.log(chatroomList);
    setChatroomList(chatroomList);
  }

  const enterChatroom = async (roomUid) => {
    try {
      // TODO: 병렬처리하기 (Promise.All)

      // chatroom 정보 가져오기
      const chatroom = await db.collection('chatrooms').doc(roomUid).get();

      // chatroom에 participant 추가
      await db.collection('chatrooms').doc(roomUid).collection('participants').doc(userProfile.uid).set({
        uid: userProfile.uid
      });

      // user에 chatroom 추가
      const doc = await db.collection('users').doc(userProfile.uid).get();
      const payload = {...doc.data()};
      payload.chatroomUids.push(roomUid);
      await db.collection('users').doc(userProfile.uid).update(
        payload
      );

      setChatroomList([...chatroomList, chatroom]);

      const cp = {...userProfile};
      cp.chatroomUids.push(roomUid);
      dispatch(setUserProfile(cp));

      console.log('chatroom enterd!');
      history.push('/chat/room/' + roomUid);
    } catch(e) {

    }
  }

  const createChatroom = async (title) => {
    try {
      let chatroomUid = uuidv4();
      //chatrooms 추가
      await db.collection('chatrooms').doc(chatroomUid).set({
        title: title, 
        isPrivate: inputState.isPrivate,
        password: inputState.pw,
        created: firebase.firestore.Timestamp.now(),
        uid: chatroomUid
      });
      console.log('chatroom created!');
      enterChatroom(chatroomUid);
      
    } catch(e) {
      alert('Error to create chatroom');
      console.error("Error to create chatroom: ", e);
      return new Error('fail to create chatroom.');
    }
  }

  const renderChatroomList = chatroomList
  .filter((v) => isViewAllRoom || userProfile.chatroomUids.includes(v.uid))
  .map((v) => (
    <ChatroomButton onClick={()=>history.push('/chat/room/' + v.uid)} key={v.uid}>
      <Title>{v.title}</Title>
      <div>(2 / 5)</div>
      [입장하기]
      {v.isPrivate && <PrivateIcon><i className="fas fa-lock"></i></PrivateIcon>}
    </ChatroomButton>
  ))

  return (
      <Container>
          <ToggleButton 
          className={isClicked ? "btn btn-secondary" : "btn btn-primary"}
          onClick={() => setIsClicked(!isClicked)}>
            +
          </ToggleButton>
          {isClicked && 
            <CreateRoomForm 
              state={inputState}
              setState={setInputState}
              createChatroom={createChatroom}
              enterChatroom={enterChatroom}
            />
          }

          <ButtonsWrapper>
            <Button 
              className={isViewAllRoom ? "btn btn-secondary" : "btn btn-danger"}
              onClick={()=>setIsViewAllRoom(true)}  
            >모든 방 보기</Button>

            <Button 
              className={isViewAllRoom ? "btn btn-danger" : "btn btn-secondary"}
              onClick={()=>setIsViewAllRoom(false)}
            >참여한 방 보기</Button>
          </ButtonsWrapper>

        <List>
          {chatroomList.length ? renderChatroomList : "만들어진 채팅방이 없습니다."}
        </List>
      </Container>
  );
}


const PrivateIcon = styled.div`
  position: absolute;
  // left: 90%;
`;


const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Button = styled.div`
`;

const Container = styled.div`
  width: 100%;
`;

const List = styled.div`
  width: 100%;
  height: 70%;
  display: flex;

  justify-content: start;

  flex-wrap: wrap;
  overflow-y: scroll;
`;


const ToggleButton = styled.div`
  border-radius: 16px;
  margin-left: 45%;
  margin-bottom: 5px;
`;

const ChatroomButton = styled.div`
  text-align: center;
  width: 40%;
  margin: 5%;
  height: 100px;
  background-color: #B464EB;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
  color: #151515;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  &:hover {
    background-color: #8a4bb5;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;


export default ChatList;