import axios from '@/utils/request'

// 1.获取企业的列表数据
export const getHomeDataApi = () => axios({
  url: '/home/data'
})
// 2.获取通知消息
export const getMessageListApi = () => axios({
  url: '/home/notice'
})
