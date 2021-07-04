import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {firebase, db} from '../firebase';
import {useDispatch, useSelector, useStore} from 'react-redux';
import { setUserProfile } from '../reducers/user';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import CreateRoomForm from '../components/CreateRoomForm';

const ChatRoomList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [chatroomList, setChatroomList] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  // for onSnapshot
  const [addedRoom, setAddedRoom] = useState(null);
  const [modifiedRoom, setModifiedRoom] = useState(null);
  const [removedRoom, setRemovedRoom] = useState(null);

  // 방 만들기 input
  const [inputState, setInputState] = useState({
    title: '',
    isPrivate: false,
    pw: '',
    maxNum: 4
  });

  // 내가 참여한방 보기(flase) or 모든방보기 (true)
  const [isViewAllRoom, setIsViewAllRoom] = useState(true);

  // 로그아웃 상태일 때
  useEffect(() => {
    if(!userProfile) {
      history.push('/');
      return;
    }
    // getChatroomList();
    registerOnSnapshot();
  }, [])

  useEffect(() => {
    if(addedRoom === null)
      return;
    
    const newChatRoomList = 
    setChatroomList([...chatroomList, addedRoom]);
  }, [addedRoom]);

  useEffect(() => {
    if(modifiedRoom === null)
      return;

    console.log('modified', modifiedRoom);
    const newChatroomList = chatroomList.map((v) => {
      if(v.uid === modifiedRoom.uid)
        return {...modifiedRoom};
      return v;
    });
    setChatroomList(newChatroomList);
  }, [modifiedRoom]);

  useEffect(() => {
    if(removedRoom === null)
      return;
    const newChatroomList = chatroomList.filter((v) => v.uid !== removedRoom.uid);
    setChatroomList(newChatroomList);
  }, [removedRoom]);

  // useEffect(() => {
  //   console.log("inputState",inputState);
  // }, [inputState]);


  const registerOnSnapshot = () => {
    // for chatroom list
    db.collection('chatrooms').orderBy('createdAt')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added') {
            if(chatroomList.filter((v) => v.uid === change.doc.data().uid ).length === 0)
              setAddedRoom(change.doc.data());
          }
          else if(change.type === 'modified') {
            setModifiedRoom(change.doc.data());
          }
          else if('removed') {
            setRemovedRoom(change.doc.data());
          }
        });
      });
  }


  /* functions interact with db */

  const getChatroomList = async () => {
    const snapshot = await db.collection('chatrooms').orderBy('createdAt').get();
    const chatroomList = [];
    snapshot.forEach((doc) => {
      chatroomList.push(doc.data());
    });
    console.log(chatroomList);
    setChatroomList(chatroomList);
  }

  const enterChatroom = async (roomUid, shoudValidCheck=true) => {
    try {

      // 이미 들어가 방이면 그냥 return.
      if(userProfile.chatroomUids.includes(roomUid)) {
        history.push('/chat/room/' + roomUid);
        return;
      }

      // chatroom 정보 가져오기
      const chatroomDoc = await db.collection('chatrooms').doc(roomUid).get();
      const chatroom = chatroomDoc.data();

      // 방을 만들고 난 직후에는 valid check를 안한다.
      if(shoudValidCheck) {
        // 방에 참가할지 물어보기
        if(!window.confirm('방에 참가하시겠습니까?'))
          return;

        // 비번방이면 비밀번호 치게하기.
        if(chatroom.isPrivate) {
          let pw = prompt('방 비밀번호를 입력하세요.');
          if(pw !== chatroom.pw) {
            alert('비밀번호가 틀렸습니다.');
            console.log(pw, chatroom.pw);
            return;
          }
        }
      }

      // 방이 꽉찼는지 검사
      if(chatroom.curNum >= chatroom.maxNum) {
        alert('방 인원이 가득 찼습니다.');
        return;
      }
      
      /* TODO: 병렬처리하기 (Promise.All) */

      // chatroom에 participant 추가
      await db.collection('chatrooms').doc(roomUid).collection('participants').doc(userProfile.uid).set({
        uid: userProfile.uid,
        enteredAt: firebase.firestore.Timestamp.now()
      });

      // user에 chatroom 추가
      const doc = await db.collection('users').doc(userProfile.uid).get();
      const payload = {...doc.data()};
      payload.chatroomUids.push(roomUid);
      await db.collection('users').doc(userProfile.uid).update(
        payload
      );
      
      //chatroom curNum 필드 1 늘리기
      await db.collection('chatrooms').doc(roomUid).update({
        ...chatroom,
        curNum: chatroom.curNum + 1
      });

      setChatroomList([...chatroomList, chatroom]);

      // userProfile에 들어간 roomUid 넣기 (Redux)
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
        curNum: 0,
        maxNum: inputState.maxNum,
        isPrivate: inputState.isPrivate,
        pw: inputState.pw,
        createdAt: firebase.firestore.Timestamp.now(),
        uid: chatroomUid
      });
      enterChatroom(chatroomUid, false);
    } catch(e) {
      alert('Error to create chatroom');
      console.error("Error to create chatroom: ", e);
      return new Error('fail to create chatroom.');
    }
  }

  const renderChatroomList = chatroomList
  .filter((v) => isViewAllRoom || userProfile.chatroomUids.includes(v.uid))
  .map((v) => (
    <ChatroomButton onClick={()=>enterChatroom(v.uid)} key={v.uid}>
      <Title>{v.title}</Title>
      <div>({v.curNum} / {v.maxNum})</div>
      [입장하기]
      {v.isPrivate && <PrivateIcon><i className="fas fa-lock"></i></PrivateIcon>}
      {userProfile.chatroomUids.includes(v.uid) && <EnteredIcon><i className="fas fa-check"></i></EnteredIcon>}
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
`;

const EnteredIcon = styled.div`
  position: absolute;
  left: 90%;
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
  padding: 0px 16px;
  font-size: 1.1rem;
`;


export default ChatRoomList;