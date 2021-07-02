import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import {firebaseApp} from '../firebase';
import {setUserProfile} from '../reducers/user';

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);

  const onLogout = () => {
    firebaseApp.auth().signOut();
    dispatch(setUserProfile(null))
    alert('로그아웃 되었습니다.');
    history.push('/');
  }

  const onClickLogo = () => {
    history.push('/');
  }

  return (
    <Container>
      <Logo onClick={onClickLogo}>채팅앱</Logo>
      {
        userProfile && (
          <>
            <div>
              {userProfile.name} 님 안녕하세요!
            </div>
            <Logout className="btn btn-primary" onClick={onLogout}>로그아웃</Logout>
          </>
        )
      }
      </Container>
  )
}

const Logout = styled.div`
  font-size: 0.5em;
  width: 25%;
  max-width: 80px;
  min-width: 
`;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #9e25d9;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;

export default Header;

