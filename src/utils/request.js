import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 1.创建实例对象
const instance = axios.create({
  // 动态的区分环境变量
  baseURL: process.env.VUE_APP_BASE_API, // 完成url=  baseURL+手写的url
  timeout: 10000
})
// 2.设置请求拦截器
instance.interceptors.request.use(config => {
// 携带token
  const token = store.getters.token
  // 判断如果token有值 就携带token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
// Do something with request error
  return Promise.reject(error)
})
// 3.设置响应拦截器
instance.interceptors.response.use(response => {
  // 判断是否是Blob二进制 如果是就直接返回数据
  if (response.data instanceof Blob) return response.data
  // 需要 success data message
  const { success, data, message } = response.data
  if (success) { // 操作成功 直接返回data数据
    return data
  } else { // 操作失败 直接提示错误信息
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, async error => {
// 网络失败 错误不是200
// 处理401 token失效
  if (error.response?.status === 401) {
    // 1.给出提示
    Message.warning('Token失效了')
    // 2.清空token和用户基本信息
    await store.dispatch('user/asyncLogOut')
    // 3.跳转到登录页面
    router.push('/login')
    return Promise.reject(error)
  }
  Message.error(error.message)
  return Promise.reject(error)
})

// 4.暴露实例对象
export default instance
