import React, {useState, useEffect} from 'react';
import InputText from '../components/InputText';
import {useHistory, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {firebaseApp, db} from '../firebase';
import styled from "styled-components";
import {setUserProfile} from '../reducers/user';

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useState(() => {
    if(userProfile) {
      alert('이미 로그인이 되어있습니다.');
      history.push('/chat/list');
    }
  }, [])

  const login = async () => {
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      const uid = firebaseApp.auth().currentUser.uid;
      if(uid) {
        const doc = await db.collection('users').doc(uid).get();
        const userProfile = doc.data();
        dispatch(setUserProfile(userProfile))
        alert('로그인 성공');
        history.push('/chat/list');
      }
      else {
        alert('Error');
      }
    } catch(err) {
      alert(err.message);
      console.error(err);
    }
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    login();
  }

  return (
    <Container>
      <h3>Login Page</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <InputText 
              label="이메일"
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="welcome@example.com"
            />
          </div>

          <div className="mb-3">
            <InputText
              label="패스워드"
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="******"
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
          >
            로그인
          </button>
          <br /><br />
          <Link to="/users/signup">회원가입 하러가기</Link>

        </form>
      
    </Container>
  );
}

const Container = styled.div`
`;

export default Login;