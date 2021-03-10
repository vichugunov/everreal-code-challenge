import { login } from './api'
import { setToken } from './helpers/auth'

const usernameSelector = 'input#username'
const passwordSelector = 'input#password'
const signInBtnSelector = 'button#submit'

let username = ''
let password = ''

const updateUserName = (e) => {
  username = e.target.value
}

const updatePassword = (e) => {
  password = e.target.value
}

const onSubmit = () => {
  const payload = {
    username,
    password
  }

  console.log('sending...', payload)

  login(payload)
    .then((token) => {
      setToken(token)
      window.location.href = '/game-carousel.html'
    })
}

const bindEventListeners = () => {
  const usernameInput = document.querySelector(usernameSelector) as HTMLElement
  const passwordInput = document.querySelector(passwordSelector) as HTMLElement
  const signInBtn = document.querySelector(signInBtnSelector) as HTMLElement

  usernameInput.addEventListener("input", updateUserName, false);
  usernameInput.addEventListener("change", updateUserName, false);

  passwordInput.addEventListener("input", updatePassword, false);
  passwordInput.addEventListener("change", updatePassword, false);

  signInBtn.addEventListener("click", onSubmit, false);
}

bindEventListeners()