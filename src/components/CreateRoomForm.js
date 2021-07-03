import React from 'react';
import InputText from './InputText';
import InputCheckbox from './InputCheckbox';
import InputSelect from './InputSelect';
import styled from 'styled-components';

// called by
//    ChatList.js

const CreateRoomForm = ({
  state,
  setState,
  createChatroom
}) => {

  const isValid = () => {
    if(state.title.trim().length === 0) {
      alert('방 제목을 입력하세요');
      return false;
    }
    if(state.isPrivate) {
      if(!/^\d+$/.test(state.pw)) {
        alert('비밀번호는 숫자만 입력해주세요.');
        return false;
      }
      if(state.pw.length < 4) {
        alert('비밀번호를 4자리 이상 입력해주세요.');
        return false;
      }
    }
    return true;
  }

  /* listener functions */
  const onClickCreate = () => {
    if(!isValid()) return;

    const title = state.title;
    createChatroom(title);
  }

  const onClickPwCheckbox = () => {
    const cp = {...state};
    cp.isPrivate = !cp.isPrivate;
    if(!state.isPrivate)
      cp.pw = '';

    setState(cp);
  };

  const onChangePw = (e) => {
    setState({
      ...state,
      pw: e.target.value 
    })
  }

  const onChangeTitle = (e) => {
    setState({
      ...state,
      title: e.target.value
    })
  }

  const onChangeNum = (e) => {
    const cp = {...state};
    cp.maxNum = parseInt(e.target.value);
    setState(cp);
  }

  return (
    <Container>
      <InputText 
        label="방 제목"
        type="text"
        value={state.title}
        onChange={onChangeTitle}
        placeholder="방 제목 (15자 이내)"
        maxLength="15"
      />
      <br />
      <InputSelect 
        label= "방 최대 인원"
        value={state.maxNum}
        onChange={onChangeNum}
        options={[
          {value: 1, text: "1 명"},
          {value: 2, text: "2 명"},
          {value: 3, text: "3 명"},
          {value: 4, text: "4 명"},
          {value: 5, text: "5 명"},
          {value: 6, text: "6 명"},
        ]}
      />
      <br />

      <InputCheckbox 
        label=" 비밀번호 설정하기"
        onClick={onClickPwCheckbox}
        checked={state.isPrivate}
      />
      <br />
      {
        state.isPrivate && (
          <InputText 
            label=""
            type="text"
            value={state.pw}
            onChange={onChangePw}
            placeholder="비밀번호 (4자리 이상 숫자)"
            maxLength="8"
          />
        )
      }
      <br />
      <CreateButton 
        className="btn btn-primary"
        onClick={onClickCreate}
      > 방 생성하기
      </CreateButton>
    </Container>
  );
};

const Container = styled.div`
  margin: 16px;
  margin-bottom: 30px;
`;

const CreateButton = styled.div`
  
`;


export default CreateRoomForm;