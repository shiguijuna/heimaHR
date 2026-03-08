import { setToken, getToken } from '@/utils/auth'
import { LoginApi, UserInfoApi } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'
export default {
  namespaced: true,
  state() {
    return {
      token: getToken(), // token
      userInfo: {}, // 用户对象信息
      routes: constantRoutes // 默认数据是静态路由
    }
  },
  mutations: {
    // 存储token
    setToken(state, token) {
      state.token = token
      // 实现本地存储 持久化
      setToken(token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes]
    }

  },
  actions: {
    // 异步登录
    async  asyncLogin(ctx, form) {
      const token = await LoginApi(form)
      console.log(token)
      ctx.commit('setToken', token)
    },
    // 异步获取用户信息
    async  asyncGetUserInfo(ctx) {
      const userinfo = await UserInfoApi()
      ctx.commit('setUserInfo', userinfo)
      return userinfo
    },
    // 退出登录
    asyncLogOut(ctx) {
      // 清空router信息 重置路由对象
      resetRouter()
      // 1.清空token
      ctx.commit('setToken', '')
      // 2.清空用户信息
      ctx.commit('setUserInfo', {})
    }
  }
}

