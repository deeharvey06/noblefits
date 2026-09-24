import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUserError,
  emailSignInStart,
  googleSignInStart,
} from "@/redux/user/actions";
import {
  selectUserError,
  selectUserErrorContext,
  selectUserStatus,
} from "@/redux/user/userSelector";
import { getSignInErrorMessage } from "@/utils/authMessages";

export const useSignIn = () => {
  const dispatch = useDispatch();
  const authError = useSelector(selectUserError);
  const errorContext = useSelector(selectUserErrorContext);
  const status = useSelector(selectUserStatus);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const { email, password } = credentials;
  const isSubmitting = status === "submitting";
  const errorMessage =
    errorContext === "sign-in" ? getSignInErrorMessage(authError) : "";

  const signInWithGoogle = () => dispatch(googleSignInStart());

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(emailSignInStart({ email: email.trim(), password }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setCredentials((current) => ({ ...current, [name]: value }));
    if (authError) dispatch(clearUserError());
  };

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    handleSubmit,
    handleChange,
    signInWithGoogle,
  };
};
