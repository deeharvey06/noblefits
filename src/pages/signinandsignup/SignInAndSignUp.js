import React from "react";

import SignIn from "../../components/signin/SignIn";
import SignUp from "../../components/signup/SignUp";

import "./signinandsignup.scss";

const SignInAndSignUp = () => (
  <div className="sign-in-and-sign-up">
    <SignIn />
    <SignUp />
  </div>
);

export default SignInAndSignUp;
