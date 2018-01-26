import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  Jumbotron,
  Collapse
} from 'react-bootstrap';

var emailVal = false, passVal = false;

class App extends Component {
  state = {
    email:'',
    password:'',
    password2:'',
    fname:'',
    lname:'',
    phone:'',
    signup:false
  };


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

  emailValidation(){
    var ans = null;
    const input = this.state.email;
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    if(input.length > 0){
      if(regex.test(input)){
        emailVal = true;
        ans = 'success';
      }
      else{
        emailVal = false;
        ans = 'error';
      }
    }
    else{
      emailVal = false;
    }
    console.log("emailVal "+emailVal+" passVal "+passVal);
    return ans;
  }
//Needs work to handle
  passwordValidation(){
    var ans = null;
    const input = this.state.password;
    var regex = /^(?=.*[@!?#$])(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).{6,}$/;

    if(input.length > 0 ){
      if(regex.test(input)){
        passVal = true;
        ans = 'success';
      }
      else{
        passVal = false;
        ans = 'error';
      }
    }
    else {
      passVal = false;
    }
    console.log("emailVal "+emailVal+" passVal "+passVal);
    return ans;
  }
  onSignUp(){
    this.setState({signup: !this.state.signup});

  }

  onSubmit = (e) => {
    if(!emailVal || !passVal){
      e.preventDefault();
      console.log(this.state.password);
    }
    else{
      var data = {};
      var url ='';

      if(this.state.signup){
        url = 'login';
        data={
        "email":this.state.email,
        "password":this.state.password
        }
        this.setState({name:'', password:'', signup:false});
      }
    else{
      url = 'signup';

      data={
      "email":this.state.email,
      "password":this.state.password,
      "fname":this.state.fname,
      "lname":this.state.lname,
      "phone":this.state.phone
      }

      this.setState({name:'',
        password:'',
        password2:'',
        fname:'',
        lname:'',
        password:'',
        phone:'',
        signup:false});
    }

        var post = JSON.stringify(data);
      axios.post('http://localhost:3001/'+url, post)
        .then(function (result){
          console.log(result);
          if(result.data.code === 200){
            console.log("HI");
          }

        })
        .catch(function (error) {
       console.log(error);
     });
     //this.setState({name:'', password:''});
    }
  }

  render() {
    const { email, password, password2, fname, lname, phone } = this.state;
    return (
      <div className="App">
        <header className="App-header">
        <h1>Contact Manager</h1>
        </header>

        <Jumbotron className="content-body">
        <Form horizontal
          onSubmit={ this.onSubmit }>

          <FormGroup
            validationState={this.emailValidation()}>
            <Col componentClass={ControlLabel}
              sm={2}
              smOffset={2}
              >Email:</Col>
            <Col sm={4}>
              <FormControl
                type="email"
                name="email"
                value={email}
                placeHolder="hello@myemail.com"
                onChange={this.onChange}
                required/>
              <FormControl.Feedback />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalPassword"
            validationState={ this.passwordValidation() }>
            <Col componentClass={ ControlLabel }
              sm={2} smOffset={2}>Password:</Col>
            <Col sm={4}>
              <FormControl
                type="password"
                name="password"
                value={password}
                placeHolder="******"
                onChange={this.onChange}
                required/>
              <FormControl.Feedback />
            </Col>
        </FormGroup>

        <Collapse in={this.state.signup}>

          <div>
                <FormGroup
                  controlId="formHorizontalPassword"
                  validationState={ this.passwordValidation() }>
                <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Password:</Col>
              <Col sm={4}>
                <FormControl
                  type="password"
                  name="password2"
                  value={password2}
                  placeHolder="******"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
                <FormControl.Feedback />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalText">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>First Name:</Col>
              <Col sm={4}>
                <FormControl
                  type="text"
                  name="fname"
                  value={fname}
                  placeHolder="Joe"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalText">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Last Name:</Col>
              <Col sm={2}>
                <FormControl
                  type="text"
                  name="lname"
                  value={lname}
                  placeHolder="Doe"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalText">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Phone:</Col>
              <Col sm={2}>
                <FormControl
                  type="phone"
                  name="phone"
                  value={phone}
                  placeHolder="407-555-5555"
                  onChange={this.onChange}
                  />
              </Col>
            </FormGroup >

          </div>
        </Collapse>

        <FormGroup>
          <Col smOffset={4} sm={4}>
            <Button type="submit"
              bsStyle="primary"
              className="login-sign_btn"
              id="lgInBtn"
              >{this.state.signup?"Sign Up":"Log In"}</Button>
            <Button
              className="login-sign_btn"
              id="sgUpBtn"
              onClick={()=>{this.setState({signup: !this.state.signup})}}
              >{this.state.signup?"Cancel":"Sign Up"}</Button>

          </Col>
        </FormGroup>
      </Form>
    </Jumbotron>


      </div>

    );
  }
}
export default App;
