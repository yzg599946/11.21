import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { getStore } from '@/utils/store'
// import { resetRouter } from '@/router'
// import { getToken, getName } from './utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = store.getters.token

  if (to.path === '/login') {
    next()
  } else {
    if (hasToken) {
      if (store.getters.isLock && to.path !== '/lock') {
        next({
          path: '/lock'
        })
        NProgress.done()
      } else if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        const loginStatus = store.getters.loginStatus
        if (hasGetUserInfo && loginStatus) {
          if (router.options.routes.length === 5) {
            // get user menu
            const routers = getStore({ name: 'menus' })
            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch('permission/generateRoutes', { routers })
            // dynamically add accessible routes
            router.options.routes = store.getters.permission_routes
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } else {
            next()
          }
        } else {
          if (!loginStatus) {
            // login
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          } else {
            try {
              // get user info
              await store.dispatch('user/getInfo')
              next({ ...to, replace: true })
            } catch (error) {
              // remove token and go to login page to re-login
              await store.dispatch('user/resetToken')
              Message.error(error || 'Has Error')
              next(`/login?redirect=${to.path}`)
              NProgress.done()
            }
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
