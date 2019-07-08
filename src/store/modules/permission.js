import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

const parentMenuList = { '综合管理': 'composite', '订单总管理': 'order', '头条菜单管理': 'tt', '趣头条菜单管理': 'ct', '腾讯管理': 'tencent', '临时菜单管理': 'temporary', '化妆品管理': 'cosmetic', '暖风机管理': 'heater', '服饰管理': 'clothes', '剃须刀管理': 'shaver', '手环管理': 'igBracelet', '手表管理': 'watch', '茶叶管理': 'tea', '驱蚊器管理': 'repellent', '望远镜管理': 'telescope', '微信管理': 'weChatMini', '物流管理': 'logistics', '系统管理': 'system', '厨房用品菜单管理': 'kitchen', '黑头仪管理': 'comedones', '腰包管理': 'waistB', '清洁剂管理': 'cleaner', '内裤管理': 'briefs', '车漆去痕剂': 'automotiveRP', '扫地机器人管理': 'sRobot', '眼镜管理': 'glasses', '手提包管理': 'handbag', '健腹轮管理': 'abdominalMW' }

export function filterAsyncRoutes(asyncRouter) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRoutes = []
  asyncRouter.forEach(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        const name = parentMenuList[router.meta.title]
        router.component = Layout
        router.name = name
        router.path = `/${name}`
        router.rediret = `/${name}`
      } else {
        const component = router.component
        router.component = () => import(`@/views/${component}`)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRoutes(router.children)
    }
    accessedRoutes.push(router)
  })
  return accessedRoutes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routers) {
    return new Promise(resolve => {
      routers = routers.routers
      const accessedRoutes = filterAsyncRoutes(routers).concat(errorRoutes)
      commit('SET_ROUTERS', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
