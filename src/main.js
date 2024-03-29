import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VXETable)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
