import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // 英文// lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 定义全局自定义指令
Vue.directive('permission', {
  // inserted 指令作用在标签插入到Dom之后就会自动触发这个函数
  inserted(el, binding) {
    // binding.value可以获取html标签传递过来的数据
    // 从vuex中获取权限点的数据
    const points = store.state.user.userInfo?.roles?.points
    if (!points.includes(binding.value)) { // 不包含当前的权限点
      el.remove() // 隐藏当前的标签
    }
  }
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale }) // 注册英文
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI) // 注册中文

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
