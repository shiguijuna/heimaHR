import axios from '@/utils/request'
// 1.获取所有的权限点
export const getRermListApi = () => axios({
  url: '/sys/permission'
})
// 2.新增权限点
export const addPermApi = (data) => axios({
  method: 'POST',
  url: '/sys/permission',
  data
})
// 3.根据id获取详情
export const getPermInfoByIdApi = (id) => axios({
  url: `/sys/permission/${id}`
})
// 4.更新权限信息
export const updatePermByIdApi = (data) => axios({
  url: `/sys/permission/${data.id}`,
  method: 'PUT',
  data
})
// 5.根据id删除权限
export const delPermByIdApi = (id) => axios({
  url: `/sys/permission/${id}`,
  method: 'delete'
})

