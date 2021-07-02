import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setUserProfile} from '../reducers/user';

function Home() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);

  const onClickChatList = () => {
    history.push('/chat/list');
  }

  return (
    <div>
      <h3>
        랜딩 페이지
      </h3>
      <br />

      {
        userProfile ?
          <div 
            className="btn btn-primary" 
            onClick={onClickChatList}
          >
            채팅방 리스트
          </div>
        :
          <div 
            className="btn btn-primary"
            onClick={()=>history.push('/users/login')}
          >
            Go to Login
          </div>
      }
    </div>
  )
}

export default Home;