import React, {useState, useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import InputText from '../components/InputText';
import InputSelect from '../components/InputSelect';
import InputCheckbox from '../components/InputCheckbox';

import {useDispatch, useSelector} from 'react-redux';
import {setUserProfile} from '../reducers/user';

import {db, firebase, firebaseApp} from '../firebase';

function Signup() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.user.userProfile);

  // States for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [signupPath, setSignupPath] = useState("");

  const signupPathOptions = [
    {value: "search", text: "검색"},
    {value: "ads", text: "광고"},
    {value: "etc", text: "이외"},
  ]

  useState(() => {
    if(userProfile) {
      alert('로그아웃 후에 시도해주세요.');
      history.push('/chat/list');
    }
  }, [])
  
  const isValid = () => {
    if(email.trim().length === 0) {
      alert('이메일을 입력해주세요.');
      return false;
    }
    if(password.length < 6) {
      alert('패스워드는 6자리 이상이어야 합니다.');
      return false;
    }
    if(name.length === 0) {
      alert('이름을 입력해주세요.');
      return false;
    }
    if(signupPath.trim().length === 0) {
      alert('가입 경로를 선택해주세요.');
      return false;
    }
    if(! isAgree) {
      alert('가입 동의란을 체크해주세요.');
      return false;
    }
    return true;
  }

  const signup = async () => {
    if(! isValid()) return;

    try {
      const userCred = await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
      console.log('@@@');
      const uid = userCred.user.uid;
      const payload = {
        email: email,
        name: name,
        signupPath: signupPath,
        uid: uid,
        created: firebase.firestore.Timestamp.now(),
        chatroomUids: []
      };
      console.log(payload);
      await db.collection('users').doc(uid).set(payload);
      alert('가입되었습니다!');

      dispatch(setUserProfile(payload));
      history.push('/chat/list');
    } catch(e) {
      alert('signup error');
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    signup();
  }

  return (
    <div className="App">
      <div className="p-2">
        <h3>회원가입</h3>
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

          <div className="mb-3">
            <InputText
              label="이름"
              type="text"
              onChange={(e)=>setName(e.target.value)}
              placeholder="홍길동"
            />
          </div>

          <div className="mb-3">
            <InputSelect 
              label="가입경로"
              value={signupPath}
              onChange={e => setSignupPath(e.target.value)}
              options={signupPathOptions}
            />
          </div>

          <div className="mb-3">
            <InputCheckbox 
              label="&nbsp; 개인정보 수집 및 이용에 동의합니다."
              onClick={(e) => setIsAgree(!isAgree)}
              checked={isAgree} 
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
          >
            가입하기
          </button>
        </form>
      </div>
      <br />
      <Link to="/users/login">로그인 하러가기</Link>
    </div>
  );
}

export default Signup;
