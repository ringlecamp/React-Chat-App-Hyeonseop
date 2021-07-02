import React from 'react';
import styled from 'styled-components';

const InputChat = ({value, onChange, onSubmit}) => {
  return (
      <Container>
        <form onSubmit={onSubmit}>
          <Input 
            placeholder="채팅을 입력하세요..."
            value={value}
            onChange={onChange}
          />
        </form>
      </Container>
  );
};

const Container = styled.div`
  width:100%;
  background-color: #faf9fb;
`;

const Input = styled.input`
  width: 100%;
  height: 4rem;
  border-color: #ca87ea;
  &:focus {
    background-color: #faf9fb;
  }
`;


export default InputChat;