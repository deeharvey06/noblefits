import React, { Component } from 'react';

import FormInput from '../forminput/FormInput';
import CustomButton from '../customButton/CustomButton'

import './signin.scss'

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className='signIn'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            type='email'
            name='email'
            value={email}
            handleChange={this.handleChange}
            label='email'
            required
          />

          <FormInput
            type='password'
            name='password'
            value={password}
            handleChange={this.handleChange}
            label='password'
            required
          />

          <CustomButton type='submit'>
            Sign in
          </CustomButton>
        </form>
      </div>
    );
  }
}

export default SignIn;
