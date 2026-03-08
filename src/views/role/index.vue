<template>
  <div class="container">
    <div class="app-container">
      <!-- 标题区域 -->
      <div class="title">
        <el-button size="mini" type="primary" @click="isShow = true">添加角色</el-button>

      </div>
      <!-- el-table -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="name"
          label="角色"
          width="200"
          align="center"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" />
            <span v-else>{{ row.name }}</span>
          </template>

        </el-table-column>
        <el-table-column
          prop="state"
          label="启用"
          width="200"
          align="center"
        >
          <template v-slot="{row}">
            <!--  :active-value="1" 有冒号 会显示具体的数据类型
                  active-value="1"  无冒号 一律看做String
            -->
            <el-switch
              v-if="row.isEdit"
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            />

            <template v-else>
              <span v-if="row.state===1">启用</span>
              <span v-else-if="row.state===0">未启用</span>
              <span v-else>无</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" style="width:300px" size="mini" :rows="3" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="updateTable(row)">确 定</el-button>
              <el-button size="mini" @click="resetTable(row)">取 消</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="openDialog(row.id)">分配权限</el-button>
              <el-button type="text" @click="row.isEdit = true">编辑</el-button>
              <el-popconfirm
                title="确定要删除吗？"
                @onConfirm="delFn(row.id)"
              >
                <el-button slot="reference" style="margin-left: 10px;" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-row type="flex" justify="center" class="footer">
        <!--  current-page 当前页码
              page-size  每页显示的数量
              layout 分页显示按钮
              current-change 点击按钮触发的事件
        -->
        <el-pagination
          :current-page.sync="pageData.page"
          :page-size="pageData.pagesize"
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </el-row>

    </div>
    <!-- 添加到弹窗 -->
    <el-dialog width="500px" title="新增角色" :visible.sync="isShow" @close="closeFn">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width:300px" size="mini" autocomplete="off" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch
            v-model="form.state"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" style="width:300px" size="mini" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
        <el-button size="mini" @click="closeFn">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 显示分配权限的弹窗 -->

    <el-dialog title="分配权限" :visible.sync="isShowPerm">
      <!--  show-checkbox 显示 checkbox复选框
        :default-checked-keys="permIds"  默认选中那些选项  数据不是响应式的
        node-key="id"  代表数据的唯一标识
      -->
      <el-tree
        ref="elTree"
        node-key="id"
        default-expand-all
        :props="{label:'name'}"
        :data="treeData"
        show-checkbox
        :default-checked-keys="permIds"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitPerm">确 定</el-button>
        <el-button size="mini" @click="isShowPerm = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleListApi, addRoleApi, delRoleById, updateRoleById, getRoleInfoByIdApi, resetRolePermApi } from '@/api/role'
import { getRermListApi } from '@/api/permission'
import { transList2Tree } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      isShow: false, // 添加弹窗
      tableData: [],
      pageData: {
        page: 1, // 当前页
        pagesize: 5 // 每页显示几条
      },
      total: 0, // 总共有几条数据,
      form: {
        name: '',
        state: true, // 默认启用
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      isShowPerm: false, // 是否显示弹窗
      treeData: [], // 权限点的数据列表
      permIds: [], // 权限点的id列表
      roleId: null // 角色id
    }
  },
  created() {
    // 获取角色列表
    this.getRoleList()
  },
  methods: {
    async  delFn(id) {
      // 1.发送请求删除角色
      await delRoleById(id)
      // 2.给出成功的提示
      this.$message.success('删除角色成功')
      // 判断当前页码是否还有数据 并且页码>1
      if (this.tableData.length === 1 && this.pageData.page > 1) {
        this.pageData.page--
      }
      // 3.重新获取最新的数据
      this.getRoleList()
    },
    async submit() {
      try {
        // 1.再一次全部校验
        await this.$refs.form.validate()
        // 2.发送请求实现新增
        await addRoleApi(this.form)
        // 3. 给出成功的提示
        this.$message.success('新增角色成功')
        // 获取第一页的数据
        this.pageData.page = 1
        // 4.重新获取最新的数据
        this.getRoleList()
        // 5.关闭弹窗
        this.closeFn()
      } catch (error) {
        console.log(error)
      }
    },
    closeFn() {
      // 1. 重置表单的数据
      this.$refs.form.resetFields()
      // 2.关闭弹窗
      this.isShow = false
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListApi(this.pageData)
      this.total = res.total
      // this.tableData = res.rows.reverse() // 将数据进行翻转
      // 给每个数据对象中添加一个属性 isEdit 用于标记编辑状态
      // res.rows.forEach(item => { item.isEdit = false })

      this.tableData = res.rows
      // 动态给数组添加数据 不具有响应式
      this.tableData.forEach(item => {
        // 添加实现数据的响应式的
        // this.$set(目标对象,添加什么属性,添加值)
        // Vue.set(目标对象,添加什么属性,添加值)
        this.$set(item, 'isEdit', false)
        // 实现数据的缓存a
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description,
          id: item.id
        })
      })
    },
    handleCurrentChange(page) {
      // 获取最新的页码值
      this.pageData.page = page
      // 重新获取最新的数据
      this.getRoleList()
    },
    async updateTable(row) {
      if (row.editRow.name && row.editRow.description) {
        // row.name = row.editRow.name
      // 浅拷贝 Object.assign(目标对象,来源对象)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
        await updateRoleById(row.editRow)
        // await updateRoleById({
        //   id: row.id,
        //   name: row.name,
        //   state: row.state,
        //   description: row.description
        // })
        this.$message.success('更新角色成功')
      } else {
        this.$message.warning('角色名称和描述不能为空')
      }
    },
    resetTable(row) {
      // 关闭编辑状态
      row.isEdit = false
      // 将原有数据更新到缓存数据中
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async openDialog(id) {
      this.roleId = id
      // 1.先根据id获取对应的权限
      const { permIds } = await getRoleInfoByIdApi(id)
      this.permIds = permIds
      // 2.在展示所有的权限列表
      this.treeData = transList2Tree(await getRermListApi(), 0)
      // 显示权限点弹窗
      this.isShowPerm = true
    },
    async submitPerm() {
      // 1.修改角色的权限
      await resetRolePermApi({
        id: this.roleId,
        permIds: this.$refs.elTree.getCheckedKeys() // 获取已经选中的权限
      })
      // 2给出成功的提示
      this.$message.success('分配角色权限成功')
      // 3关闭权限的弹窗
      this.isShowPerm = false
    }
  }

}
</script>

<style lang="scss" scoped>
.container{
  padding: 20px;

  .app-container{
    padding: 20px;

    .title{
      margin-bottom: 10px;
    }
    .footer{
      margin-top: 50px;
    }
  }
}
</style>
