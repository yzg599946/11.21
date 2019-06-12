import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/homepage',
    children: [{
      path: 'homepage',
      name: 'Homepage',
      component: () => import('@/views/homepage/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/navigation-menu',
    component: Layout,
    redirect: '/navigation-menu',
    children: [{
      path: 'navigation-menu',
      name: 'Navigation-menu',
      component: () => import('@/views/navigation-menu/index'),
      meta: { title: '导航菜单', icon: 'daohang' }
    }]
  },

  {
    path: '/integrated-management',
    component: Layout,
    redirect: '/integrated-management',
    children: [{
      path: 'integrated-management',
      name: 'Integrated-management',
      component: () => import('@/views/integrated-management/index'),
      meta: { title: '综合管理', icon: 'zonghe' }
    }]
  },

  {
    path: '/order-management',
    component: Layout,
    redirect: '/order-management',
    children: [{
      path: 'order-management',
      name: 'Order-management',
      component: () => import('@/views/order-management/index'),
      meta: { title: '订单总管理', icon: 'dingdan' }
    }]
  },

  {
    path: '/headline-management',
    component: Layout,
    redirect: '/headline-management',
    children: [{
      path: 'headline-management',
      name: 'Headline-management',
      component: () => import('@/views/headline-management/index'),
      meta: { title: '头条管理', icon: 'toutiao' }
    }]
  },

  {
    path: '/qutoutiao-management',
    component: Layout,
    redirect: '/qutoutiao-management',
    children: [{
      path: 'qutoutiao-management',
      name: 'qutoutiao-management',
      component: () => import('@/views/qutoutiao-management/index'),
      meta: { title: '趣头条管理', icon: 'qutoutiao' }
    }]
  },

  {
    path: '/tencent-management',
    component: Layout,
    redirect: '/tencent-management',
    children: [{
      path: 'tencent-management',
      name: 'Tencent-management',
      component: () => import('@/views/tencent-management/index'),
      meta: { title: '腾讯管理', icon: 'qq' }
    }]
  },

  {
    path: '/temporary-management',
    component: Layout,
    redirect: '/temporary-management',
    children: [{
      path: 'temporary-management',
      name: 'temporary-management',
      component: () => import('@/views/temporary-management/index'),
      meta: { title: '临时管理', icon: 'lingshi' }
    }]
  },

  {
    path: '/cosmetics-management',
    component: Layout,
    redirect: '/cosmetics-management/index',
    name: 'Cosmetics-management',
    meta: { title: '化妆品管理', icon: 'huazhuangpin' },
    children: [
      {
        path: 'cosmetics-order',
        name: 'Cosmetics-order',
        component: () => import('@/views/cosmetics-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'cosmetics-channel',
        component: () => import('@/views/cosmetics-management/channel'),
        name: 'Cosmetics-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'cosmetics-area',
        component: () => import('@/views/cosmetics-management/area'),
        name: 'Cosmetics-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'cosmetics-timeslot',
        component: () => import('@/views/cosmetics-management/timeslot'),
        name: 'Cosmetics-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/heater-management',
    component: Layout,
    redirect: '/heater-management',
    name: 'Heater-management',
    meta: { title: '暖风机管理', icon: 'fenshang' },
    children: [
      {
        path: 'heater-order',
        name: 'Heater-order',
        component: () => import('@/views/heater-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'heater-channel',
        component: () => import('@/views/heater-management/channel'),
        name: 'Heater-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'heater-area',
        component: () => import('@/views/heater-management/area'),
        name: 'Heater-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'heater-timeslot',
        component: () => import('@/views/heater-management/timeslot'),
        name: 'Heater-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/apparel-management',
    component: Layout,
    redirect: '/apparel-management',
    name: 'Apparel-management',
    meta: { title: '服饰管理', icon: 'fuzhuang' },
    children: [
      {
        path: 'apparel-order',
        name: 'Apparel-order',
        component: () => import('@/views/apparel-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'apparel-channel',
        component: () => import('@/views/apparel-management/channel'),
        name: 'Apparel-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'apparel-area',
        component: () => import('@/views/apparel-management/area'),
        name: 'Apparel-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'apparel-timeslot',
        component: () => import('@/views/apparel-management/timeslot'),
        name: 'Apparel-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/shaver-management',
    component: Layout,
    redirect: '/shaver-management',
    name: 'Shaver-management',
    meta: { title: '剃须刀管理', icon: 'tixudao' },
    children: [
      {
        path: 'shaver-order',
        name: 'Shaver-order',
        component: () => import('@/views/shaver-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'shaver-channel',
        component: () => import('@/views/shaver-management/channel'),
        name: 'Shaver-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'shaver-area',
        component: () => import('@/views/shaver-management/area'),
        name: 'Shaver-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'shaver-timeslot',
        component: () => import('@/views/shaver-management/timeslot'),
        name: 'Shaver-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/bracelet-management',
    component: Layout,
    redirect: '/bracelet-management',
    name: 'Bracelet-management',
    meta: { title: '手环管理', icon: 'shouhuan' },
    children: [
      {
        path: 'bracelet-order',
        name: 'Bracelet-order',
        component: () => import('@/views/bracelet-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'bracelet-channel',
        component: () => import('@/views/bracelet-management/channel'),
        name: 'Bracelet-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'bracelet-area',
        component: () => import('@/views/bracelet-management/area'),
        name: 'Bracelet-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'bracelet-timeslot',
        component: () => import('@/views/bracelet-management/timeslot'),
        name: 'Bracelet-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/watch-management',
    component: Layout,
    redirect: '/watch-management',
    name: 'Watch-management',
    meta: { title: '手表管理', icon: 'shoubiao' },
    children: [
      {
        path: 'watch-order',
        name: 'Watch-order',
        component: () => import('@/views/watch-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'watch-channel',
        component: () => import('@/views/watch-management/channel'),
        name: 'Watch-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'watch-area',
        component: () => import('@/views/watch-management/area'),
        name: 'Watch-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'watch-timeslot',
        component: () => import('@/views/watch-management/timeslot'),
        name: 'Watch-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/tea-management',
    component: Layout,
    redirect: '/tea-management',
    name: 'Tea-management',
    meta: { title: '茶叶管理', icon: 'chaye' },
    children: [
      {
        path: 'tea-order',
        name: 'Tea-order',
        component: () => import('@/views/tea-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'tea-channel',
        component: () => import('@/views/tea-management/channel'),
        name: 'Tea-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'tea-area',
        component: () => import('@/views/tea-management/area'),
        name: 'Tea-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'tea-timeslot',
        component: () => import('@/views/tea-management/timeslot'),
        name: 'Tea-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/repellent-management',
    component: Layout,
    redirect: '/repellent-management',
    name: 'Repellent-management',
    meta: { title: '驱蚊器管理', icon: 'quwenqi' },
    children: [
      {
        path: 'repellent-order',
        name: 'Repellent-order',
        component: () => import('@/views/repellent-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'repellent-channel',
        component: () => import('@/views/repellent-management/channel'),
        name: 'Repellent-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'repellent-area',
        component: () => import('@/views/repellent-management/area'),
        name: 'Repellent-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'repellent-timeslot',
        component: () => import('@/views/repellent-management/timeslot'),
        name: 'Repellent-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/telescope-management',
    component: Layout,
    redirect: '/telescope-management',
    name: 'Telescope-management',
    meta: { title: '望远镜管理', icon: 'wangyuanjing' },
    children: [
      {
        path: 'telescope-order',
        name: 'Telescope-order',
        component: () => import('@/views/telescope-management/order'),
        meta: { title: '订单管理', icon: 'order' }
      },
      {
        path: 'telescope-channel',
        component: () => import('@/views/telescope-management/channel'),
        name: 'Telescope-channel',
        meta: { title: '渠道统计', icon: 'channel' }
      },
      {
        path: 'telescope-area',
        component: () => import('@/views/telescope-management/area'),
        name: 'Telescope-area',
        meta: { title: '地区统计', icon: 'area' }
      },
      {
        path: 'telescope-timeslot',
        component: () => import('@/views/telescope-management/timeslot'),
        name: 'Telescope-timeslot',
        meta: { title: '时段统计', icon: 'timeslot' }
      }
    ]
  },

  {
    path: '/wechat-management',
    component: Layout,
    redirect: '/wechat-management',
    children: [{
      path: 'wechat-management',
      name: 'Wechat-management',
      component: () => import('@/views/wechat-management/index'),
      meta: { title: '微信管理', icon: 'wechat' }
    }]
  },

  {
    path: '/logistics-management',
    component: Layout,
    redirect: '/logistics-management',
    children: [{
      path: 'logistics-management',
      name: 'Logistics-management',
      component: () => import('@/views/logistics-management/index'),
      meta: { title: '物流管理', icon: 'wuliu' }
    }]
  },

  {
    path: '/system-management',
    component: Layout,
    redirect: '/system-management',
    children: [{
      path: 'system-management',
      name: 'System-management',
      component: () => import('@/views/system-management/index'),
      meta: { title: '系统管理', icon: 'xitong' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
