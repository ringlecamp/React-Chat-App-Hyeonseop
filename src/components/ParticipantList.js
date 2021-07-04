import React, {useState, useEffect} from 'react';
import { db } from '../firebase';
import styled from 'styled-components';

const ParticipantList = ({roomInfo}) => {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant]  = useState(null);
  const [removedParticipant, setRemovedParticipant]  = useState(null);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    if(roomInfo) {
      const unsubscribe = registerOnSnapshot();
      return unsubscribe;
    }
  }, [roomInfo])

  useEffect(() => {
    if(newParticipant === null)
      return;
    setParticipants([...participants, newParticipant]);
  }, [newParticipant])

  useEffect(() => {
    if(removedParticipant === null)
      return;
    
    // setRoomInfo({...roomInfo, curNum: roomInfo.curNum + 1});
    setParticipants(participants.filter((p) => p.uid !== removedParticipant.uid));
  }, [removedParticipant])


  const registerOnSnapshot = () => {
    // for participants
    db.collection('chatrooms').doc(roomInfo.uid)
    .collection('participants')
    // .orderBy('enteredAt')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if(change.type === 'added') {
          db.collection('users').doc(change.doc.data().uid).get()
            .then((userDoc) => {
              const newEntry = {
                id: userDoc.id,
                ...userDoc.data()
              }
              if(participants.map((v)=>v.id === newEntry.id).length === 0)
                setNewParticipant(newEntry);
            })
        }
        if(change.type === 'removed') {
          setRemovedParticipant({uid: change.doc.id});
        }
        
      });
    });
  }

  const getParticipants = async (roomUid) => {
    console.log('rui', roomUid);
    const snapshot = await db.collection('chatrooms').doc(roomUid)
      .collection('participants')
      // .orderBy('enteredAt')
      .get();

    setParticipants([]);

    snapshot.forEach((doc) => {
      db.collection('users').doc(doc.data().uid).get()
        .then((userDoc) => {
          console.log('kakak', userDoc.data());
          setNewParticipant(userDoc.data());
        });
    });
  }


  return (
    <Container>
      
      <ul className="list-group">
        <li className="list-group-item active btn"
            onClick={()=>getParticipants(roomInfo.uid)}
        > 참여자 리스트 ({participants.length} / {roomInfo.maxNum})</li>
        {participants.map((p) => <li key={p.uid} className="list-group-item">{p.name}</li>)}
      </ul>


    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 30%;
  right: 105%;
`;

export default ParticipantList;

