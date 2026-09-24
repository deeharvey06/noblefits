import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearUserError, signUpStart } from "@/redux/user/actions";
import {
  selectUserError,
  selectUserErrorContext,
  selectUserStatus,
} from "@/redux/user/userSelector";
import { getSignUpErrorMessage } from "@/utils/authMessages";

export const useSignUp = () => {
  const dispatch = useDispatch();
  const authError = useSelector(selectUserError);
  const errorContext = useSelector(selectUserErrorContext);
  const status = useSelector(selectUserStatus);
  const [credentials, setCredentials] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const { displayName, email, password, confirmPassword } = credentials;
  const isSubmitting = status === "submitting";
  const authMessage =
    errorContext === "sign-up" ? getSignUpErrorMessage(authError) : "";
  const confirmPasswordError =
    formError === "Passwords must match." ? formError : "";
  const errorMessage =
    authMessage || (formError && !confirmPasswordError ? formError : "");

  const handleChange = ({ target: { name, value } }) => {
    setCredentials((current) => ({ ...current, [name]: value }));
    if (formError) setFormError("");
    if (authError) dispatch(clearUserError());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords must match.");
      return;
    }

    dispatch(
      signUpStart({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      }),
    );
  };

  return {
    displayName,
    email,
    password,
    confirmPassword,
    isSubmitting,
    confirmPasswordError,
    errorMessage,
    handleSubmit,
    handleChange,
  };
};
