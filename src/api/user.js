import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getVerifyCode(data) {
  return request({
    url: '/user/sendSms',
    method: 'post',
    data
  })
}

// export function fastLogin() {
//   return request({
//     url: '/fast/login',
//     method: 'post'
//   })
// }

export function checkLogin(data) {
  return request({
    url: '/user/check',
    method: 'post',
    data
  })
}

export function markingRun() {
  return request({
    url: '/marking/run',
    method: 'get'
  })
}

export function sina() {
  return request({
    url: '/list=sz002307,sh600928',
    method: 'get',
    baseURL: 'http://hq.sinajs.cn'
  })
}
