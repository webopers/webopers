import Validator from '../lib/validator.js';
import Axios from '../lib/axios.js';

const continueData = localStorage.getItem('continue') || {};
const continueURL = continueData.url ? continueData.url : '/';

const axios = new Axios();
const loginForm = new Validator('#login-form');
// const requestURL = 'https://webopers-apis.herokuapp.com/';
const requestURL = 'http://localhost:4000';
const registerButton = document.querySelector('#register');

const onSubmit = async (data) => {
    loginForm.changeInputsVisibility(true);

    const { code = '' } = await axios.get(`${requestURL}/auth/login`, data);

    if (code === 'auth/password-incorrect') {
        loginForm.toggleError('#password', true, 'Mật khẩu không chính xác');
        loginForm.changeInputsVisibility(false);
        return;
    }

    if (code === 'auth/not-exist') {
        loginForm.toggleError('#email', true, 'Tài khoản này chưa được đăng ký');
        loginForm.changeInputsVisibility(false);
        return;
    }

    window.location.href = continueURL;
};

const registerRedirect = () => {
    const email = document.querySelector('#email').value;
    loginForm.changeInputsVisibility(true, 'register');
    if (email) localStorage.setItem('register', { email });
    window.location.href = '/accounts/register';
};

loginForm.onSubmit = onSubmit;
registerButton.addEventListener('click', registerRedirect);
