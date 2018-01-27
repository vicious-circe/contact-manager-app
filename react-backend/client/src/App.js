import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { RouteButton } from './Components';
import { Routes } from './Routes';
import axios from 'axios';
//import { Intro } from './Pages';
//import { AccessScreen } from './Pages';
//import { NavHeader } from './Components';

axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props){
    super(props);
    this.setUser = this.setUser.bind(this);
    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
    this.state={
      userName:'',
      isAuthenticated: false,
      isAuthenticating: true};
  }
setUser(name){
  this.setState({userName:name});
}

userHasAuthenticated(authenticated){
  this.setState({ isAuthenticated: authenticated });
}

logout = (event) => {
  axios.get('http://localhost:3001/logout')
  .then((response) => {
      console.log(response);
       this.userHasAuthenticated(false);
  }).catch((e) => {
      console.log(e);
  });
}

render(){
  const childProps = {
    isAuthenticated: this.state.isAuthenticated,
    userHasAuthenticated: this.userHasAuthenticated
  };
      return(
        <div>
          <Navbar inverse fluid style={{height:70, padding:8}} >
            <Navbar.Header>
              <Navbar.Brand style={{fontSize:'2em'}}>
                <Link to="/">Contact Manager</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
      			   <Navbar.Text>
                { this.state.userName }
               </Navbar.Text>
               <Nav pullRight style={{ padding:8}}>
               {
                 this.state.isAuthenticated
                 ?
                  <Button
                    bsStyle={"danger"}
                    onClick={ this.logout}
                    >Logout</Button>
                  :
                    <RouteButton href="/login_register"
                    bsStyle={"default"}
                    >Login / Register</RouteButton>
                  }
               </Nav>
            </Navbar.Collapse>
          </Navbar>

        <Routes childProps={ childProps }/>
      {/*<AccessScreen setUser={this.setUser}/>*/}
        </div>
    );
  }
}
export default App;
