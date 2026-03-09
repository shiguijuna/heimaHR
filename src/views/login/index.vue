<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单 epf -->
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isArgee">
            <el-checkbox v-model="form.isArgee">用户平台使用协议</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:350px" @click="LoginFn">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '', // 手机号
        password: process.env.NODE_ENV === 'development' ? 'itHeiMa@' + new Date().toISOString().slice(0, 10).replace(/-/g, '') : '', // 密码
        isArgee: process.env.NODE_ENV === 'development'// 是否选中协议
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', tigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '手机号格式不正确', tigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' }
        ],
        isArgee: [ // required  null "" 未定义 不能校验 true false 需要自定义校验规则
        // rule规则对象  value这个表单组价的值 callback回调函数
          { validator(rule, value, callback) {
            value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
          }, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // console.log(process.env)
  },
  methods: {
    async LoginFn() {
      try {
        // 1.登录之前全部在校验一遍
        await this.$refs.form.validate()
        // 2.调用登录的接口
        await this.$store.dispatch('user/asyncLogin', this.form)
        // 3.给出成功的提示
        this.$message.success('登录成功')
        // 4.跳转到首页
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>

