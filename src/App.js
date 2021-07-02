import React, {useState, useEffect} from 'react';
import Routes from './Routes';
import styled from "styled-components";
import {db, firebaseApp} from './firebase';
import {useDispatch, useSelector} from 'react-redux';
import {setUserProfile} from './reducers/user';
import {useHistory} from 'react-router-dom';

function App() {  
  return (
    <Container>
      <Wrapper>
        <Routes />
      </Wrapper>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 1000px;
  box-sizing: border-box
`;


const Wrapper = styled.div`
  width: 100%;
  max-width: 680px;
  height: 100%;
  padding: 30px;
  border: solid 1px purple
  box-sizing: border-box
`;

export default App;

