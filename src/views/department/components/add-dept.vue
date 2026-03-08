<template>
  <!-- 显示弹窗 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="closeFn">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" size="mini" autocomplete="off" placeholder="2-10个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" size="mini" autocomplete="off" placeholder="2-10个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="form.managerId" style="width:80%" size="mini" placeholder="请选择负责人">
          <el-option v-for="item in simpleList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" size="mini" :rows="4" type="textarea" placeholder="1-100个字符" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="submit">确 定</el-button>
      <el-button size="mini" @click="closeFn">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepartListApi, getSimpleListApi, addDepartApi, getDepartInfoByIdApi, updateDepartByIdApi } from '@/api/department'
export default {

  components: {},
  props: {
    showDialog: { // 显示Dialog
      type: Boolean,
      default: false
    },
    pid: { // 父组织部门的id
      type: Number,
      default: null
    }
  },
  data() {
    return {
      simpleList: [], // 部门负责人列表数据
      form: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人
        name: ''// 部门名称
      },
      rules: {
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 2, max: 10, message: '2-10个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            // 1.联网发送请求获取数据
            let res = await getDepartListApi()
            // 判断当前是什么状态 是新增还是编辑
            if (this.form.id) {
              // 是编辑状态需要排除自身
              res = res.filter(item => item.id !== this.form.id)
            }
            // 2.需要判断value是否存在于 原有的数据列表中
            if (res.some(item => item.code === value)) {
              callback(new Error('部门编码已存在'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ], // 部门编码
        introduce: [
          { required: true, message: '请输入部门描述', trigger: 'blur' },
          { min: 1, max: 100, message: '1-100个字符', trigger: 'blur' }
        ], // 部门介绍
        managerId: [
          { required: true, message: '请选择部门负责人', trigger: 'change' }
        ], // 部门负责人
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 10, message: '2-10个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            // 1.联网发送请求获取数据
            let res = await getDepartListApi()
            if (this.form.id) {
              // 是编辑状态需要排除自身
              res = res.filter(item => item.id !== this.form.id)
            }
            // 2.需要判断value是否存在于 原有的数据列表中
            if (res.some(item => item.name === value)) {
              callback(new Error('部门名称已存在'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]// 部门名称
      }
    }
  },

  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },

  async created() {
    // 获取部门负责人列表数据
    this.simpleList = await getSimpleListApi()
  },

  methods: {
    closeFn() {
      // this.showDialog = false  不行 破坏了单向数据流
      // 1.在关闭之前需要重置表单的数据
      this.form = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人
        name: ''// 部门名称
      }
      // 重置表单
      this.$refs.form.resetFields()
      // 解决方案 需要子传父 才能解决
      this.$emit('update:showDialog', false)
    },
    async  submit() {
      try {
        // 1.再一次全部校验数据
        await this.$refs.form.validate()
        // 判断是新增还是修改
        if (this.form.id) {
          await updateDepartByIdApi(this.form)
          this.$message.success('修改部门成功')
        } else {
          // 2.提交数据
          await addDepartApi({
            ...this.form,
            pid: this.pid
          })
          // 3.给出成功的提示
          this.$message.success('添加部门成功')
        }
        // 4.关闭弹窗
        this.closeFn()
        // 5.告诉父亲重新获取数据
        this.$emit('updateList')
      } catch (error) {
        console.log(error)
      }
    },
    async  getDepartInfo() {
      const res = await getDepartInfoByIdApi(this.pid)
      this.form = res
    }
  }
}

</script>
<style  scoped lang="scss">
</style>
