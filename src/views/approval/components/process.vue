<template>
  <div class="add-form">
    <el-dialog title="转正审批" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="formData" label-position="right" label-width="100px">
        <el-form-item label="应用：" prop="processType">
          <el-select v-model="formData.processType" class="filter-item" filterable>
            <el-option
              v-for="typeItem in approvalTypes"
              :key="typeItem.id"
              :label="typeItem.value"
              :value="typeItem.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点：">
          <p><strong /><el-button
            size="small"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addTemp"
          >新增节点</el-button></p>
          <div
            v-for="(item, index) in tempList"
            :key="item.key"
            :label="'域名' + index"
            :prop="'item.' + index + '.name'"
            style="border-top:1px solid #ececec;margin-top:10px;"
          >
            <el-form-item label="名称：" prop="formOfEmployment" style="padding:10px 0;">
              <el-input v-model="item.name" style="width:300px;" />
            </el-form-item>
            <el-form-item label="执行人：" prop="formOfEmployment">
              <el-select v-model="item.user" class="filter-item" multiple style="width:300px;">
                <el-option
                  v-for="userItem in employeeOptions"
                  :key="userItem.id"
                  :label="userItem.fullName"
                  :value="userItem.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBtn">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getSimpleListApi } from '@/api/department'
import { process } from '@/api/approval'

const APPROVAL_TYPES = [
  { id: 'process_leave', value: '请假' },
  { id: 'process_overtime', value: '加班' },
  { id: 'process_dimission', value: '离职' }
]

export default {
  name: 'Setting',
  props: {
    setData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      activeName: 'first',
      employeeOptions: [],
      formData: {
        processType: '',
        points: []
      },
      tempList: [],
      approvalTypes: APPROVAL_TYPES
    }
  },
  // 创建完毕状态
  created: function() {
    this.getEmploySimple()
  },
  methods: {
    // 业务方法
    async getEmploySimple() {
      this.employeeOptions = await getSimpleListApi()
    },
    // 弹层显示
    dialogFormV() {
      this.dialogFormVisible = true
    },
    // 弹层隐藏
    dialogFormH() {
      this.dialogFormVisible = false
    },
    // 界面交互
    // 表单提交
    saveBtn() {
      this.formData.points = this.tempList
        .filter(item => item.name && Array.isArray(item.user) && item.user.length > 0)
        .map(item => ({
          name: item.name,
          users: item.user.join(',')
        }))

      process(this.formData)
        .then(() => {
          this.$message.success('流程添加成功！')
          this.dialogFormVisible = false
        })
        .catch(e => {
          this.$message.error('保存失败！')
        })
    },
    // 新增一条模板数据
    addTemp() {
      if (this.tempList.length < 5) {
        this.tempList = this.tempList || []
        this.tempList.push({
          name: '',
          user: [],
          key: Date.now()
        })
      } else {
        this.$message.error('节点不能超过5个')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.inputText {
  width: 400px;
  height: 32px;
  resize: none;
  line-height: 22px;
  overflow: hidden;
  font-size: 12px;
  border: 1px solid #dddee1;
  padding: 4px 7px;
  border-radius: 5px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.setInfo {
  label {
    margin-right: 15px;
    padding: 0;
  }
}
.el-checkbox + .el-checkbox {
  margin: 0;
}
</style>
