<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <!-- 文字头像  name[0] -->
          <span v-else class="textAvatar">{{ name?.charAt(0) }}</span>
          <!-- 昵称 -->
          <span class="nickname">{{ name }}</span>
          <!-- 字体图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- 1.点击修改密码显示弹窗 -->
          <a target="_blank" @click.prevent="showDialog = true">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码的弹窗
        1.旧密码不能为空
        2.新密码6-16
        3.新密码和旧密码不能一致
        4.新密码和确认密码要一致
    -->
    <el-dialog width="500px" title="修改密码" :visible.sync="showDialog">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" show-password size="small" autocomplete="off" />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" show-password size="small" autocomplete="off" />
        </el-form-item>

        <el-form-item label="确认密码" prop="comPassword">
          <el-input v-model="form.comPassword" show-password size="small" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="updatePwd">确认修改</el-button>
        <el-button size="small" @click="btnCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePwdApi } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 是否显示Dialog弹窗
      form: {
        oldPassword: '',
        newPassword: '',
        comPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' },
          { validator: (rule, value, ck) => {
            // 判断新密码和旧密码是否一致
            if (value === this.form.oldPassword) {
              ck(new Error('新旧密码不能一致'))
            } else {
              ck()
            }
          }, trigger: 'blur' }
        ],
        comPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' },
          { validator: (rule, value, ck) => {
            // 判断新密码和确认密码是否一致
            if (value !== this.form.newPassword) {
              ck(new Error('两次密码不一致'))
            } else {
              ck()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 1 调用退出的action
      await this.$store.dispatch('user/asyncLogOut')
      // 2.跳转到登录
      this.$router.push(`/login`)
    },
    async updatePwd() {
      try {
        // 再次全部校验
        await this.$refs.form.validate()
        // 调用接口更新用户密码
        await updatePwdApi(this.form)
        // 给出提示
        this.$message.success('修改密码成功,请重新登录')
        this.btnCancel()
        // 跳转到登录页面
        setTimeout(async() => {
          // 清空token和用户信息 因为密码已经修改了
          await this.$store.dispatch('user/asyncLogOut')
          this.$router.push('/login')
        }, 1500)
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 关闭弹窗
      this.showDialog = false
      // 重置表单数据
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
// 使用样式穿透 ::v-deep
::v-deep .el-dialog__body{
  padding-right: 70px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .textAvatar{
          display:inline-block;
          width: 30px;
          height: 30px;
          background-color: #5bc6bd;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          font-size: 16px;
          margin-right: 5px;

        }

        .nickname{
          font-size: 16px;
          margin-right: 10px;
        }
        .el-icon-setting{
          font-size: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
