import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Qs from 'qs'
// import { removeToken } from './auth'
// import router from 'vue-router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // timeout: 5000, // request timeout
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.config.responseType === 'blob') {
      return response.data
    }

    const res = response.data

    if (typeof (res) === 'string') {
      if (res.indexOf('没有权限，请不要乱来!') > -1) {
        // Message({
        //   message: '没有权限，请不要乱来!',
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return
      }
    }

    if (res.status !== 200) {
      // Message({
      //   message: res.msg || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      if (res.status === 400 && res.msg === '暂无信息') {
        return res
      }

      if (res.status === 203) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      if (res.status === 407) {
        // session失效
        // Message({
        //   message: res.msg || 'Error',
        //   type: 'error'
        // })
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
        // removeLoginStatus()
        // window.location.href = '/login'
        // router.push({ path: '/' })
      }
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '系统繁忙,请联系管理员',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
