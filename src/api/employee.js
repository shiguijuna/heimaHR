import axios from '@/utils/request'

// 1.获取员工列表
export const getEmployeeListApi = (params) => axios({
  url: '/sys/user',
  params
})

// 2.下载excel
export const downloadExcelApi = () => axios({
  url: '/sys/user/export',
  responseType: 'blob' // `responseType` 表示浏览器将要响应的数据类型  blob二进制
})
// 3/下载excel模板
export const downLoadTemplateApi = () => axios({
  url: '/sys/user/import/template',
  responseType: 'blob' // `responseType` 表示浏览器将要响应的数据类型  blob二进制
})
// 4.上传excel文件
export const uploadExcelApi = (data) => axios({
  method: 'post',
  url: '/sys/user/import',
  data
})
// 5.根据id删除员工
export const delEmployeeByIdApi = id => axios({
  method: 'delete',
  url: `/sys/user/${id}`
})
// 6.新增员工
export const addEmployeeApi = data => axios({
  method: 'post',
  url: `/sys/user`,
  data
})
// 7.根据id获取员工信息
export const getEmployeeInfoByIdApi = id => axios({
  url: `/sys/user/${id}`
})
// 8.根据id修改员工信息
export const updateEmployeeInfoByIdApi = data => axios({
  method: 'put',
  url: `/sys/user/${data.id}`,
  data
})
// 9.获取员工的角色列表
export const getEnableRoleListApi = () => axios({
  url: '/sys/role/list/enabled'
})
// 10/分配员工的角色
export const assginRoleApi = (data) => axios({
  method: 'put',
  url: '/sys/user/assignRoles',
  data
})
