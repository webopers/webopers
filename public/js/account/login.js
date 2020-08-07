import Validator from "../lib/validator.js";

const loginForm = new Validator("#login-form");

loginForm.onSubmit = (data) => {
  loginForm.changeInputsVisibility(true);
  console.log(data);
};
