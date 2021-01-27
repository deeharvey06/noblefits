import React from "react";

import SignIn from "../../components/signIn/SignIn";
import SignUp from "../../components/signUp/SignUp";

import "./signinandsignup.scss";

const SignInAndSignUp = () => (
  <div className="sign-in-and-sign-up">
    <SignIn />
    <SignUp />
  </div>
);

export default SignInAndSignUp;
