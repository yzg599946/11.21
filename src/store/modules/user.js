import { login, logout, getInfo, checkLogin } from '@/api/user'
import { getToken, setToken, removeToken, getLoginStatus, setLoginStatus, removeLoginStatus } from '@/utils/auth'
import { resetRouter } from '@/router'
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'

const state = {
  token: getToken(),
  name: getStore({
    name: 'name'
  }) || '',
  avatar: getStore({
    name: 'avatar'
  }) || '',
  roles: getStore({
    name: 'roles'
  }) || '',
  menus: getStore({
    name: 'menus'
  }) || '',
  username: getStore({
    name: 'username'
  }) || '',
  status: false,
  loginStatus: getLoginStatus(),
  isLock: getStore({
    name: 'isLock'
  }) || false,
  lockPasswd: getStore({
    name: 'lockPasswd'
  }) || ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    setStore({
      name: 'name',
      content: name,
      type: 'session'
    })
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    setStore({
      name: 'avatar',
      content: avatar,
      type: 'session'
    })
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    setStore({
      name: 'roles',
      content: roles,
      type: 'session'
    })
  },
  SET_MENUS: (state, menus) => {
    state.nemu = menus
    setStore({
      name: 'menus',
      content: menus,
      type: 'session'
    })
  },
  SET_USERNAME: (state, username) => {
    state.username = username
    setStore({
      name: 'username',
      content: username,
      type: 'session'
    })
  },
  SET_CHECKSTATUS: (state, status) => {
    state.status = status
  },
  SET_LOGINSTATUS: (state, loginStatus) => {
    state.loginStatus = loginStatus
  },
  SET_LOCK_PASSWD: (state, lockPasswd) => {
    state.lockPasswd = lockPasswd
    setStore({
      name: 'lockPasswd',
      content: state.lockPasswd,
      type: 'session'
    })
  },
  SET_LOCK: (state, action) => {
    state.isLock = true
    setStore({
      name: 'isLock',
      content: state.isLock,
      type: 'session'
    })
  },
  CLEAR_LOCK: (state, action) => {
    state.isLock = false
    state.lockPasswd = ''
    removeStore({
      name: 'lockPasswd'
    })
    removeStore({
      name: 'isLock'
    })
  },
  CLEAR_USERINFO: (state, action) => {
    state.name = ''
    state.avatar = ''
    state.roles = ''
    state.menus = ''
    state.username = ''
    removeStore({
      name: 'name'
    })
    removeStore({
      name: 'avatar'
    })
    removeStore({
      name: 'roles'
    })
    removeStore({
      name: 'menus'
    })
    removeStore({
      name: 'username'
    })
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verification } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verification: verification }).then(response => {
        const { data } = response
        // 客服
        if (data.checkId) {
          const checkLoginTime = setInterval(() => {
            checkLogin(data).then(res => {
              if (res.status === 400 && res.msg === '暂无信息') {
                commit('SET_CHECKSTATUS', true)
              } else if (res.status === 200) {
                clearInterval(checkLoginTime)
                const token = JSON.stringify(res.data)
                commit('SET_TOKEN', token)
                setLoginStatus('login')
                commit('SET_LOGINSTATUS', 'login')
                commit('SET_CHECKSTATUS', false)
                setToken(token, false)
                resolve()
              }
            })
          }, 2000)
          setTimeout(() => {
            clearInterval(checkLoginTime)
          }, 600000)
        } else {
          const token = JSON.stringify(data)
          commit('SET_TOKEN', token)
          if (data.storage) {
            setToken(token, true)
            setLoginStatus('login')
            commit('SET_LOGINSTATUS', 'login')
          } else {
            setToken(token, false)
            setLoginStatus('login')
            commit('SET_LOGINSTATUS', 'login')
          }
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // fast login
  fastLogin({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        const token = JSON.stringify(data)
        commit('SET_TOKEN', token)
        commit('SET_LOGINSTATUS', 'login')
        setToken(token, true)
        setLoginStatus('login')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const avatar = 'https://lhtpic01.oss-cn-shenzhen.aliyuncs.com/common/guanliyuan.png'
        const user = data.user
        const menus = data.menu
        const roles = data.functionList
        const username = data.username
        commit('SET_ROLES', roles)
        commit('SET_NAME', user)
        commit('SET_AVATAR', avatar)
        commit('SET_MENUS', menus)
        commit('SET_USERNAME', username)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('CLEAR_USERINFO')
        commit('SET_TOKEN', '')
        commit('SET_LOGINSTATUS', '')
        commit('CLEAR_LOCK')
        removeToken()
        removeLoginStatus()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      const token = getToken()
      if (token && token.indexOf('false') !== -1) {
        removeToken()
        commit('SET_TOKEN', '')
      }
      commit('SET_LOGINSTATUS', '')
      commit('CLEAR_USERINFO', '')
      commit('CLEAR_LOCK')
      removeLoginStatus()
      resolve()
    })
  },

  // set lockpassword
  setLockPassword({ commit }, password) {
    return new Promise(resolve => {
      commit('SET_LOCK_PASSWD', password)
      resolve()
    })
  },

  // set lock
  setLock({ commit }) {
    return new Promise(resolve => {
      commit('SET_LOCK')
      resolve()
    })
  },

  // clear lock
  clearLock({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_LOCK')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

