import Cookies from 'js-cookie'

const TokenKey = 'lht_admin_token' // cookies名
const expireDate = { expires: 2 } // 失效时间

const LoginKey = 'loginState'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, setToken) {
  if (setToken) {
    return Cookies.set(TokenKey, token, expireDate)
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLoginState() {
  return Cookies.get(LoginKey)
}

export function setLoginState(state) {
  return Cookies.set(LoginKey, state)
}

export function removeLoginState() {
  return Cookies.remove(LoginKey)
}
