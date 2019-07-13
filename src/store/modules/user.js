import { login, logout, getInfo, fastLogin } from '@/api/user'
import { getToken, setToken, removeToken, setLoginState, removeLoginState } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: '',
  menus: '',
  username: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.nemus = menus
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verification } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verification: verification }).then(response => {
        const { data } = response
        const token = JSON.stringify(data)
        commit('SET_TOKEN', token)
        if (data.storage) {
          setToken(token, true)
        } else {
          setToken(token, false)
        }
        setLoginState('isLogin')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // fast login
  fastLogin({ commit }) {
    return new Promise((resolve, reject) => {
      fastLogin().then(response => {
        const { data } = response
        const token = JSON.stringify(data)
        commit('SET_TOKEN', token)
        setToken(token, true)
        setLoginState('isLogin')
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
        const avatar = 'http://i2.tiimg.com/689844/ec5ce3a030c3a20b.png'
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
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_MENUS', '')
        commit('SET_USERNAME', '')
        commit('SET_TOKEN', '')
        removeToken()
        removeLoginState()
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
      removeToken()
      removeLoginState()
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

