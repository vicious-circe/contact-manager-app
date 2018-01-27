import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  Checkbox,
  Jumbotron,
  Collapse,
  Well
} from 'react-bootstrap';

axios.defaults.withCredentials = true;

var emailVal = false, passVal = false;

class AccessScreen extends Component {
constructor(props){
  super(props);
  this.state = {
    email:'',
    password:'',
    password2:'',
    fname:'',
    lname:'',
    phone:'',
    signup:false,
    response:'',
    userName:'John'
  };
}


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
    //console.log("emailVal "+emailVal+" passVal "+passVal);
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

    //console.log("emailVal "+emailVal+" passVal "+passVal);
    return ans;
  }
  comparePassword(){
    var ans = null;
    const input = this.state.password;
    const input2 = this.state.password2;
    if(input2.length>0){
      if(input2===input){
        passVal = true;
        ans = 'success';
      }
      else{
        passVal = false;
        ans = 'error';
      }
    }
    return ans;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if(emailVal || passVal){

      console.log(this.state.password);


      var data = {};
      var url ='';

      if(this.state.signup===false){
        url = '/login';
        data={
        "email":this.state.email,
        "password":this.state.password
        }
        this.setState({email:'', password:'', signup:false});
      }
    else{
      url = '/signup';

      data={
      "email":this.state.email,
      "password":this.state.password,
      "fname":this.state.fname,
      "lname":this.state.lname,
      "phone":this.state.phone
      }
      this.setState({email:'',
        password:'',
        password2:'',
        fname:'',
        lname:'',
        phone:'',
        signup:false});
    }

        //var post = JSON.stringify(data);
        var sendUrl = "http://localhost:3001"+url;

        //this.props.setUser(this.state.userName);
        this.props.userHasAuthenticated(true);

      axios.post(sendUrl, data)
        .then(result => this.setState({response:result.data}))
        .catch(error => this.setState({response:error.data})
      );
    }
  }

  render() {
    const { email, password, password2, fname, lname, phone } = this.state;
    return (
      <div className="App">

        <Jumbotron className="content-body">

          <Col smOffset={3} sm={6} >
          <Well className="well">
            <h3>{this.state.response !== ''?this.state.response: "Please Log In or Sign Up"}</h3>
          </Well>
          </Col>

        <Form horizontal
          onSubmit={ this.onSubmit }>

          <FormGroup controlId="formHorizontalEmail"
            validationState={this.emailValidation()}>
            <Col componentClass={ControlLabel}
              sm={2}
              smOffset={2}
              >Email:</Col>
            <Col sm={4}>
              <FormControl
                type="email"
                name="email"
                value={ email }
                placeholder="hello@myemail.com"
                onChange={ this.onChange }
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
                value={ password }
                placeholder="******"
                onChange={ this.onChange }
                required/>
              <FormControl.Feedback />
            </Col>
        </FormGroup>

        <Collapse in={ this.state.signup }>

          <div>
                <FormGroup
                  controlId="formHorizontalPassword2"
                  validationState={ this.state.signup?this.comparePassword():null }>
                <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Password:</Col>
              <Col sm={4}>
                <FormControl
                  type="password"
                  name="password2"
                  value={password2}
                  placeholder="******"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
                <FormControl.Feedback />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalFName">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>First Name:</Col>
              <Col sm={3}>
                <FormControl
                  type="text"
                  name="fname"
                  value={fname}
                  placeholder="Joe"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalLName">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Last Name:</Col>
              <Col sm={3}>
                <FormControl
                  type="text"
                  name="lname"
                  value={lname}
                  placeholder="Doe"
                  onChange={this.onChange}
                  required={this.state.signup?true:false}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPhone">
              <Col componentClass={ ControlLabel }
                sm={2} smOffset={2}>Phone:</Col>
              <Col sm={2}>
                <FormControl
                  type="tel"
                  name="phone"
                  value={phone}
                  placeholder="407-555-5555"
                  onChange={this.onChange}
                  />
              </Col>
            </FormGroup >

            <FormGroup>

                <Checkbox  required={this.state.signup?true:false}>
                You have read agree to the </Checkbox><a>user agreement</a>.

            </FormGroup>

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
export { AccessScreen };
