import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

// const componentList = [
//   {
//     path: '/integrated-management',
//     component: Layout,
//     redirect: '/integrated-management',
//     name: 'Integrated-management',
//     meta: { title: '综合管理', icon: 'zonghe' },
//     children: [
//       {
//         path: 'integrated-baidu',
//         name: 'Integrated-baidu',
//         component: () => import('@/views/integrated-management/baidu'),
//         meta: { title: '百度页面管理', icon: 'baidu' }
//       },
//       {
//         path: 'integrated-channel',
//         name: 'Integrated-channel',
//         component: () => import('@/views/integrated-management/channel'),
//         meta: { title: '渠道管理', icon: 'channel' }
//       },
//       {
//         path: 'integrated-color',
//         name: 'Integrated-color',
//         component: () => import('@/views/integrated-management/color'),
//         meta: { title: '颜色管理', icon: 'color' }
//       },
//       {
//         path: 'integrated-product',
//         name: 'Integrated-product',
//         component: () => import('@/views/integrated-management/product'),
//         meta: { title: '产品管理', icon: 'changpin' }
//       }
//     ]
//   },

//   {
//     path: '/order-management',
//     component: Layout,
//     redirect: '/order-management',
//     name: 'Order-management',
//     meta: { title: '订单总管理', icon: 'dingdan' },
//     children: [
//       {
//         path: 'order-order',
//         name: 'Order-order',
//         component: () => import('@/views/order-management/order'),
//         meta: { title: '订单总管理', icon: 'order' }
//       },
//       {
//         path: 'order-channel',
//         name: 'Order-channel',
//         component: () => import('@/views/order-management/channel'),
//         meta: { title: '渠道统计', icon: 'channel' }
//       }
//     ]
//   },

//   {
//     path: '/headline-management',
//     component: Layout,
//     redirect: '/headline-management',
//     name: 'Headline-management',
//     meta: { title: '头条菜单管理', icon: 'toutiao' },
//     children: [
//       {
//         path: 'headline-order',
//         name: 'Headline-order',
//         component: () => import('@/views/headline-management/order'),
//         meta: { title: '头条订单管理', icon: 'order' }
//       },
//       {
//         path: 'headline-channel',
//         component: () => import('@/views/headline-management/channel'),
//         name: 'Headline-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'headline-area',
//         component: () => import('@/views/headline-management/area'),
//         name: 'Headline-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'headline-timeslot',
//         component: () => import('@/views/headline-management/timeslot'),
//         name: 'Headline-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/qutoutiao-management',
//     component: Layout,
//     redirect: '/qutoutiao-management',
//     meta: { title: '趣头条菜单管理', icon: 'qutoutiao' },
//     name: 'Qutoutiao-management',
//     children: [
//       {
//         path: 'qutoutiao-order',
//         name: 'Qutoutiao-order',
//         component: () => import('@/views/qutoutiao-management/order'),
//         meta: { title: '趣头条订单管理', icon: 'order' }
//       },
//       {
//         path: 'qutoutiao-blank',
//         component: () => import('@/views/qutoutiao-management/blank'),
//         name: 'Qutoutiao-blank',
//         meta: { title: '其它管理', icon: 'timeslot' },
//         role: ['blank']
//       }
//     ]
//   },

//   {
//     path: '/tencent-management',
//     component: Layout,
//     redirect: '/tencent-management',
//     meta: { title: '腾讯管理', icon: 'qq' },
//     name: 'Tencent-management',
//     children: [
//       {
//         path: 'tencent-temporaryorder',
//         name: 'Tencent-temporaryorder',
//         component: () => import('@/views/tencent-management/temporaryorder'),
//         meta: { title: '临时订单管理', icon: 'order' }
//       },
//       {
//         path: 'tencent-repellent',
//         component: () => import('@/views/tencent-management/repellent'),
//         name: 'Tencent-repellent',
//         meta: { title: '驱蚊器渠道管理', icon: 'quwenqi' }
//       },
//       {
//         path: 'tencent-apparel',
//         component: () => import('@/views/tencent-management/apparel'),
//         name: 'Tencent-apparel',
//         meta: { title: '服饰订单管理', icon: 'fuzhuang' }
//       },
//       {
//         path: 'tencent-cosmetic',
//         component: () => import('@/views/tencent-management/cosmetic'),
//         name: 'Tencent-cosmetic',
//         meta: { title: '化妆品订单管理', icon: 'huazhuangpin' }
//       },
//       {
//         path: 'tencent-watch',
//         component: () => import('@/views/tencent-management/watch'),
//         name: 'Tencent-watch',
//         meta: { title: '手表订单管理', icon: 'shoubiao' }
//       },
//       {
//         path: 'tencent-watchtimeslot',
//         component: () => import('@/views/tencent-management/watchtimeslot'),
//         name: 'Tencent-watchtimeslot',
//         meta: { title: '手表时段管理', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/temporary-management',
//     component: Layout,
//     redirect: '/temporary-management',
//     meta: { title: '临时菜单管理', icon: 'lingshi' },
//     name: 'Temporary-management',
//     children: [
//       {
//         path: 'temporary-order',
//         name: 'Temporary-order',
//         component: () => import('@/views/temporary-management/order'),
//         meta: { title: '临时订单管理', icon: 'order' }
//       },
//       {
//         path: 'temporary-channel',
//         component: () => import('@/views/temporary-management/channel'),
//         name: 'Temporary-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'temporary-area',
//         component: () => import('@/views/temporary-management/area'),
//         name: 'Temporary-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'temporary-timeslot',
//         component: () => import('@/views/temporary-management/timeslot'),
//         name: 'Temporary-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/cosmetics-management',
//     component: Layout,
//     redirect: '/cosmetics-management',
//     name: 'Cosmetics-management',
//     meta: { title: '化妆品管理', icon: 'huazhuangpin' },
//     children: [
//       {
//         path: 'cosmetics-order',
//         name: 'Cosmetics-order',
//         component: () => import('@/views/cosmetics-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'cosmetics-channel',
//         component: () => import('@/views/cosmetics-management/channel'),
//         name: 'Cosmetics-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'cosmetics-area',
//         component: () => import('@/views/cosmetics-management/area'),
//         name: 'Cosmetics-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'cosmetics-timeslot',
//         component: () => import('@/views/cosmetics-management/timeslot'),
//         name: 'Cosmetics-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/heater-management',
//     component: Layout,
//     redirect: '/heater-management',
//     name: 'Heater-management',
//     meta: { title: '暖风机管理', icon: 'fenshang' },
//     children: [
//       {
//         path: 'heater-order',
//         name: 'Heater-order',
//         component: () => import('@/views/heater-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'heater-channel',
//         component: () => import('@/views/heater-management/channel'),
//         name: 'Heater-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'heater-area',
//         component: () => import('@/views/heater-management/area'),
//         name: 'Heater-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'heater-timeslot',
//         component: () => import('@/views/heater-management/timeslot'),
//         name: 'Heater-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/apparel-management',
//     component: Layout,
//     redirect: '/apparel-management',
//     name: 'Apparel-management',
//     meta: { title: '服饰管理', icon: 'fuzhuang' },
//     children: [
//       {
//         path: 'apparel-order',
//         name: 'Apparel-order',
//         component: () => import('@/views/apparel-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'apparel-channel',
//         component: () => import('@/views/apparel-management/channel'),
//         name: 'Apparel-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'apparel-area',
//         component: () => import('@/views/apparel-management/area'),
//         name: 'Apparel-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'apparel-timeslot',
//         component: () => import('@/views/apparel-management/timeslot'),
//         name: 'Apparel-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/shaver-management',
//     component: Layout,
//     redirect: '/shaver-management',
//     name: 'Shaver-management',
//     meta: { title: '剃须刀管理', icon: 'tixudao' },
//     children: [
//       {
//         path: 'shaver-order',
//         name: 'Shaver-order',
//         component: () => import('@/views/shaver-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'shaver-channel',
//         component: () => import('@/views/shaver-management/channel'),
//         name: 'Shaver-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'shaver-area',
//         component: () => import('@/views/shaver-management/area'),
//         name: 'Shaver-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'shaver-timeslot',
//         component: () => import('@/views/shaver-management/timeslot'),
//         name: 'Shaver-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/bracelet-management',
//     component: Layout,
//     redirect: '/bracelet-management',
//     name: 'Bracelet-management',
//     meta: { title: '手环管理', icon: 'shouhuan' },
//     children: [
//       {
//         path: 'bracelet-order',
//         name: 'Bracelet-order',
//         component: () => import('@/views/bracelet-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'bracelet-channel',
//         component: () => import('@/views/bracelet-management/channel'),
//         name: 'Bracelet-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'bracelet-area',
//         component: () => import('@/views/bracelet-management/area'),
//         name: 'Bracelet-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'bracelet-timeslot',
//         component: () => import('@/views/bracelet-management/timeslot'),
//         name: 'Bracelet-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/watch-management',
//     component: Layout,
//     redirect: '/watch-management',
//     name: 'Watch-management',
//     meta: { title: '手表管理', icon: 'shoubiao' },
//     children: [
//       {
//         path: 'watch-order',
//         name: 'Watch-order',
//         component: () => import('@/views/watch-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'watch-channel',
//         component: () => import('@/views/watch-management/channel'),
//         name: 'Watch-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'watch-area',
//         component: () => import('@/views/watch-management/area'),
//         name: 'Watch-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'watch-timeslot',
//         component: () => import('@/views/watch-management/timeslot'),
//         name: 'Watch-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/tea-management',
//     component: Layout,
//     redirect: '/tea-management',
//     name: 'Tea-management',
//     meta: { title: '茶叶管理', icon: 'chaye' },
//     children: [
//       {
//         path: 'tea-order',
//         name: 'Tea-order',
//         component: () => import('@/views/tea-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'tea-channel',
//         component: () => import('@/views/tea-management/channel'),
//         name: 'Tea-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'tea-area',
//         component: () => import('@/views/tea-management/area'),
//         name: 'Tea-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'tea-timeslot',
//         component: () => import('@/views/tea-management/timeslot'),
//         name: 'Tea-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/repellent-management',
//     component: Layout,
//     redirect: '/repellent-management',
//     name: 'Repellent-management',
//     meta: { title: '驱蚊器管理', icon: 'quwenqi' },
//     children: [
//       {
//         path: 'repellent-order',
//         name: 'Repellent-order',
//         component: () => import('@/views/repellent-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'repellent-channel',
//         component: () => import('@/views/repellent-management/channel'),
//         name: 'Repellent-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'repellent-area',
//         component: () => import('@/views/repellent-management/area'),
//         name: 'Repellent-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'repellent-timeslot',
//         component: () => import('@/views/repellent-management/timeslot'),
//         name: 'Repellent-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/telescope-management',
//     component: Layout,
//     redirect: '/telescope-management',
//     name: 'Telescope-management',
//     meta: { title: '望远镜管理', icon: 'wangyuanjing' },
//     children: [
//       {
//         path: 'telescope-order',
//         name: 'Telescope-order',
//         component: () => import('@/views/telescope-management/order'),
//         meta: { title: '订单管理', icon: 'order' }
//       },
//       {
//         path: 'telescope-channel',
//         component: () => import('@/views/telescope-management/channel'),
//         name: 'Telescope-channel',
//         meta: { title: '渠道统计', icon: 'channel' }
//       },
//       {
//         path: 'telescope-area',
//         component: () => import('@/views/telescope-management/area'),
//         name: 'Telescope-area',
//         meta: { title: '地区统计', icon: 'area' }
//       },
//       {
//         path: 'telescope-timeslot',
//         component: () => import('@/views/telescope-management/timeslot'),
//         name: 'Telescope-timeslot',
//         meta: { title: '时段统计', icon: 'timeslot' }
//       }
//     ]
//   },

//   {
//     path: '/wechat-management',
//     component: Layout,
//     redirect: '/wechat-management',
//     name: 'Wechat-management',
//     meta: { title: '微信管理', icon: 'wechat' },
//     children: [
//       {
//         path: 'wechat-order',
//         name: 'Wechat-order',
//         component: () => import('@/views/wechat-management/order'),
//         meta: { title: '微信订单支付管理', icon: 'order' }
//       },
//       {
//         path: 'wechat-user',
//         component: () => import('@/views/wechat-management/user'),
//         name: 'Wechat-user',
//         meta: { title: '用户管理', icon: 'channel' }
//       }
//     ]
//   },

//   {
//     path: '/logistics-management',
//     component: Layout,
//     redirect: '/logistics-management',
//     name: 'Logistics-management',
//     meta: { title: '物流管理', icon: 'wuliu' },
//     children: [
//       {
//         path: 'logistics-yunda',
//         name: 'Logistics-yunda',
//         component: () => import('@/views/logistics-management/yunda'),
//         meta: { title: '韵达快递', icon: 'order' }
//       },
//       {
//         path: 'logistics-jingdong',
//         component: () => import('@/views/logistics-management/jingdong'),
//         name: 'Logistics-jingdong',
//         meta: { title: '京东快递', icon: 'channel' }
//       }
//     ]
//   },

//   {
//     path: '/system-management',
//     component: Layout,
//     redirect: '/system-management',
//     name: 'System-management',
//     meta: { title: '系统管理', icon: 'xitong' },
//     children: [
//       {
//         path: 'system-monitor',
//         component: () => import('@/views/system-management/monitor'),
//         name: 'System-monitor',
//         meta: { title: '产品监控管理', icon: 'jiankong' }
//       },
//       {
//         path: 'system-login',
//         component: () => import('@/views/system-management/login'),
//         name: 'System-login',
//         meta: { title: '登陆管理', icon: 'login' }
//       },
//       {
//         path: 'system-log',
//         component: () => import('@/views/system-management/log'),
//         name: 'System-log',
//         meta: { title: '登陆日记', icon: 'log' }
//       },
//       {
//         path: 'system-user',
//         component: () => import('@/views/system-management/user'),
//         name: 'System-user',
//         meta: { title: '用户管理', icon: 'yonghu' }
//       },
//       {
//         path: 'system-charater',
//         component: () => import('@/views/system-management/charater'),
//         name: 'System-charater',
//         meta: { title: '角色管理', icon: 'juese' }
//       },
//       {
//         path: 'logistics-carte',
//         component: () => import('@/views/system-management/carte'),
//         name: 'Logistics-carte',
//         meta: { title: '菜单管理', icon: 'menu' }
//       },
//       {
//         path: 'logistics-permission',
//         component: () => import('@/views/system-management/permission'),
//         name: 'Logistics-permission',
//         meta: { title: '权限管理', icon: 'quanxian' }
//       }
//     ]
//   }
// ]

// export function filterAsyncRoutes(asyncRouter) {
//   // 遍历后台传来的路由字符串，转换为组件对象
//   const accessedRoutes = []
//   asyncRouter.forEach(router => {
//     const title = router.meta.title
//     console.log(router)
//     componentList.forEach(componetRouter => {
//       var componetTitle
//       if (componetRouter.meta.title) {
//         componetTitle = componetRouter.meta.title
//       } else {
//         componetTitle = componetRouter.children[0].meta.title
//       }
//       if (title === componetTitle) {
//         accessedRoutes.push(componetRouter)
//       }
//     })
//   })
//   return accessedRoutes
// }

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
