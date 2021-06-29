import React, {useState} from 'react';
import InputText from '../components/InputText';
import InputSelect from '../components/InputSelect';
import InputCheckbox from '../components/InputCheckbox';

function Signup() {
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

  const onSubmit = (e) => {
    e.preventDefault();
    if(! isValid()) return;
    const payload = {
      email: email,
      password: password,
      name: name,
      isAgree: isAgree,
      signupPath: signupPath 
    };
    console.log(payload);
    alert('가입 성공!');
  }

  return (
    <div className="App">
      <div className="p-2">
        <h1>회원가입</h1>
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
    </div>
  );
}

export default Signup;
