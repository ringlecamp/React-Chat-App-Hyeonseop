import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatRoomList from './pages/ChatRoomList';
import ChatRoom from './pages/ChatRoom';
import EmptyPage from './pages/EmptyPage';
import Header from './components/Header';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/users/login" component={Login} />
          <Route exact path="/users/signup" component={Signup} />
          <Route exact path="/chat/list" component={ChatRoomList} />
          <Route exact path="/chat/room/:roomUid" component={ChatRoom} />
          <Route component={EmptyPage} />
        </Switch>
      </Router>  
    )
  }; 
}

export default Routes;

