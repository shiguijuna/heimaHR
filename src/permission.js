import router from './router' // 路由对象
import store from './store' // vuex
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes } from './router'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // 白名单

// 前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 1. 开启进度条
  NProgress.start()
  // 2. 判断是否有token
  const token = store.getters.token
  if (token) {
    // 3.判断是否要去的是login
    if (to.path === '/login') {
      // 直接跳转到 首页
      next('/') // 不会触发后置路由守卫
      NProgress.done()
    } else {
      // 这里去发送请求获取用户的基本信息 但是要去判断是否已经请求过了
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/asyncGetUserInfo')
        // console.log(asyncRoutes)
        // 筛选后的动态路由
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })
        // 将筛选出来的动态路由挂载到路由对象上 router.addRoutes()
        // 追加404
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true })
        // 将筛选后的动态路由进行vuex的保存
        store.commit('user/setRoutes', filterRoutes)
        // 挂载动态路由
        router.addRoutes(filterRoutes)
        // 需要将路由进行转发 这是vue-router的已知Bug
        next(to.path)
      } else {
        next() // 触发后置路由守卫
      }
    }
  } else {
    // 判断是否在白名单中
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 不在白名单中 跳转到登录页
      next('/login')
      NProgress.done()
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
