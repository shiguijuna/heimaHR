<template>
  <el-dialog :title="showTitle" :visible="isShow" @close="btnClose">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name" style="width: 80%;" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="form.code" style="width: 80%;" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="form.description" style="width: 80%;" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch v-model="form.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submitPerm">确 定</el-button>
      <el-button size="mini" @click="btnClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addPermApi, getPermInfoByIdApi, updatePermByIdApi } from '@/api/permission'
export default {

  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    },
    pid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        description: '',
        enVisible: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
      }
    }
  },

  computed: {
    showTitle() {
      return this.form.id ? '编辑权限' : '新增权限'
    }
  },

  created() {},

  methods: {
    async getPermInfo() {
      this.form = await getPermInfoByIdApi(this.pid)
    },
    async  submitPerm() {
      // 1.再一次校验数据
      await this.$refs.form.validate()
      // 2.判断当前操作是编辑还是添加
      if (this.form.id) { // 是编辑操作
        await updatePermByIdApi(this.form)
        this.$message.success('修改权限成功')
      } else {
      // 2.实现新增
        await addPermApi({
          ...this.form,
          type: this.type,
          pid: this.pid
        })
        // 3.提示成功
        this.$message.success('新增权限成功')
      }

      // 4.告诉父组件刷新页面
      this.$emit('permSuccess')
      // 5.关闭弹窗
      this.btnClose()
    },
    btnClose() {
      // 重置表单
      this.form = {
        name: '',
        code: '',
        description: '',
        enVisible: '1'
      }
      // 1.重置表单  ps:重置表单需要设置prop属性才可以重置
      this.$refs.form.resetFields()
      // 2.关闭弹窗
      this.$emit('update:isShow', false)
    }
  }
}

</script>
<style  scoped lang="scss">
</style>
