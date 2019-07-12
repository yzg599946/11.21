import Cookies from 'js-cookie'

const TokenKey = 'lht_admin_token' // cookies名
const expireDate = { expires: 2 } // 失效时间

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, expireDate)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
