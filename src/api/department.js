import axios from '@/utils/request'

// 1.获取部门列表
export const getDepartListApi = () => axios({
  url: '/company/department'
})
// 2.获取部门负责人
export const getSimpleListApi = () => axios({
  url: '/sys/user/simple'
})
// 3.新增部门
export const addDepartApi = (data) => axios({
  method: 'post',
  url: '/company/department',
  data
})
// 4.根据id删除部门
export const delDepartByIdApi = (id) => axios({
  method: 'delete',
  url: `/company/department/${id}`
})
// 5.根据id获取部门详情
export const getDepartInfoByIdApi = (id) => axios({
  url: `/company/department/${id}`
})

// 6.根据id更新部门信息
export const updateDepartByIdApi = (data) => axios({
  method: 'put',
  url: `/company/department/${data.id}`,
  data
})
