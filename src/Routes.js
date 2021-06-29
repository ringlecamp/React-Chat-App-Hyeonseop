import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/users/login" component={Login} />
          <Route exact path="/users/signup" component={Signup} />
          <Route exact path="/chat/list" component={ChatList} />
          <Route exact path="/chat/room/:roodId" component={ChatRoom} />
        </Switch>
      </Router>  
    )
  }; 
}

export default Routes;

