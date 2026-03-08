import axios from '@/utils/request'

// 1.获取角色列表
export const getRoleListApi = (params) => axios({
  url: '/sys/role',
  params
})
// 2.新增角色
export const addRoleApi = data => axios({
  method: 'post',
  url: '/sys/role',
  data
})
// 3.根据id删除角色
export const delRoleById = id => axios({
  method: 'delete',
  url: `/sys/role/${id}`
})
// 4.根据id修改角色信息
export const updateRoleById = data => axios({
  method: 'put',
  url: `/sys/role/${data.id}`,
  data
})

// 5.根据id获取角色的详情
export const getRoleInfoByIdApi = id => axios({
  url: `/sys/role/${id}`
})
// 6.修改角色的权限
export const resetRolePermApi = data => axios({
  url: `/sys/role/assignPrem`,
  method: 'put',
  data
})
