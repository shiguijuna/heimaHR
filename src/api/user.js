import axios from '@/utils/request'

// 登录函数
export const LoginApi = ({ mobile, password }) => {
  return axios({
    method: 'post',
    url: '/sys/login',
    data: {
      mobile,
      password
    }
  })
}
// 获取用户的基本信息
export const UserInfoApi = () => {
  return axios({
    url: '/sys/profile'
  })
}

// 5.根据id获取角色的详情
export const getUserDetailById = id => axios({
  url: `/sys/role/${id}`
})

// 修改密码
export const updatePwdApi = ({ oldPassword, newPassword }) => {
  return axios({
    method: 'put',
    url: '/sys/user/updatePass',
    data: {
      oldPassword,
      newPassword
    }
  })
}
