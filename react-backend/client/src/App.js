import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {Form, FormGroup, FormControl, ControlLabel, Col, Button } from 'react-bootstrap';

class App extends Component {
  state = { email:'', password:'' };

  /** This will come handy when retriving the contact list
    componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }**/

  onChange = (e) => {
    const newState = this.state;
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  onSubmit = (e) => {
    var data = {
      "email":this.state.email,
      "password":this.state.password
    }
    var login = JSON.stringify(data);
    axios.post('http://localhost:3000/signup', login)
      .then(function (result){
        console.log(result);
        if(result.data.code === 200){
          console.log("HI");
        }

      })
      .catch(function (error) {
     console.log(error);
   });
   this.setState({name:'', password:''});
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="App">
        <header className="App-header">
        <h1>Users</h1>
        </header>

        <div className="content-body">
        <Form horizontal onSubmit={ this.onSubmit }>
          <FormGroup controlId="formHorizontalEmail" >
            <Col componentClass={ControlLabel} sm={2} smOffset={2}>Email:</Col>
            <Col sm={4}>
              <FormControl type="email" name="email" value={email} placeHolder="hello@myemail.com" onChange={this.onChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ ControlLabel } sm={2} smOffset={2}>Paswword:</Col>
            <Col sm={4}>
              <FormControl type="password" name="password" value={password} placeHolder="******" onChange={this.onChange}/>
            </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={4} sm={4}>
            <Button type="submit" bsStyle="primary" id="login-sign_btn">Login</Button>
            <Button id="login-sign_btn">sign Up</Button>
          </Col>
        </FormGroup>
      </Form>
    </div>


      </div>

    );
  }
}
/** **/


export default App;
