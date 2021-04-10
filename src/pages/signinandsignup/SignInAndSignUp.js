import React from "react";

import SignIn from "../../components/signIn/signIn";
import SignUp from "../../components/signUp/signUp";

import "./signinandsignup.scss";

const SignInAndSignUp = () => (
  <div className="sign-in-and-sign-up">
    <SignIn />
    <SignUp />
  </div>
);

export default SignInAndSignUp;
