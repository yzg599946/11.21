import Cookies from 'js-cookie'

const TokenKey = 'lht_token' // cookies名
const loginStauts = 'login_status' // 登陆态
const expireDate = { expires: 2 } // 失效时间

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

export function getLoginStatus() {
  return Cookies.get(loginStauts)
}

export function setLoginStatus(token) {
  return Cookies.set(loginStauts, token)
}

export function removeLoginStatus() {
  return Cookies.remove(loginStauts)
}

export function getTagView() {
  return window.sessionStorage.getItem('tagView')
}

export function setTagView(val) {
  return window.sessionStorage.setItem('tagView', val)
}

export function removeTagView() {
  return window.sessionStorage.removeItem('tagView')
}
