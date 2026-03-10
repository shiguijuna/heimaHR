<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <!-- @input="searchFn" -->
        <el-input v-model="params.keyword" clearable style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" />
        <!-- 树形组件
                 ref="treeDom" 获取tree
                 node-key="id" 相当于设置key 设置唯一标识
                :highlight-current="true"  //选中的节点高亮显示
                :expand-on-click-node="false" //只能点击箭头进行折叠
                default-expand-all   //默认全部展开子节点
                :data="treeData"
                :props="defaultProps"

        -->
        <el-tree
          ref="treeDom"
          node-key="id"
          :highlight-current="true"
          :expand-on-click-node="false"
          default-expand-all
          :data="treeData"
          :props="defaultProps"
          @current-change="selectTreeId"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'addEm'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button v-permission="'importExcel'" size="mini" @click="isShow= true">excel导入</el-button>
          <el-button size="mini" @click="downLoadExcel">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="staffPhoto"
            label="头像"
          >
            <template v-slot="{row}">
              <!-- 判断是否有头像 有头像就显示 没有就显示文字头像 -->
              <el-avatar v-if="row.staffPhoto" size="small" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            sortable
            label="手机号"
            width="110"
          />
          <el-table-column
            prop="workNumber"
            sortable
            label="工号"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
          >
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment===1">正式</span>
              <span v-else-if="row.formOfEmployment===2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
          />
          <el-table-column
            prop="timeOfEntry"
            sortable
            label="入职时间"
          />
          <el-table-column
            width="200"
            label="操作"
            align="center"
          >
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="openDialog(row.id)">角色</el-button>
              <!-- el-popconfirm 确定回调事件 -->
              <el-popconfirm
                title="确定要删除吗？"
                @onConfirm="delFn(row.id)"
              >
                <el-button slot="reference" style="margin-left: 10px;" type="text" size="small">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px; margin-top: 20px;" type="flex" justify="end">
          <el-pagination
            :current-page.sync="params.page"
            :page-size="params.pagesize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
    </div>
    <!-- Dialog uploadSuccess文件上传成功的监听-->
    <ImportExcel :show-excel-dialog.sync="isShow" @uploadSuccess="getEmployeeList" />
    <!-- 显示角色的弹窗 -->
    <el-dialog title="分配角色" :visible.sync="isShowRole">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in RoleList" :key="item.id" style="display: block;" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitRole">确 定</el-button>
        <el-button size="mini" @click="isShowRole = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImportExcel from './components/import-excel'
import { getDepartListApi } from '@/api/department'
import { transList2Tree } from '@/utils'
import { assginRoleApi, getEmployeeListApi, downloadExcelApi, delEmployeeByIdApi, getEnableRoleListApi, getEmployeeInfoByIdApi } from '@/api/employee'
import _ from 'lodash'
import FileSave from 'file-saver'
export default {
  name: 'Employee',
  components: { ImportExcel },
  data() {
    return {

      isShow: false, // 显示Dialog
      loading: true,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      total: 0,
      params: {
        page: 1, // 当前页
        pagesize: 10, // 每页显示的条数
        keyword: '', // 搜索关键字
        departmentId: ''// 部门id ? 选中的部门id
      },
      isShowRole: false, // 是否显示角色弹窗
      RoleList: [], // 可用的角色列表
      currentRoleId: null, // 员工的id
      roleIds: [] // 角色的id
    }
  },
  watch: {
    // 实现了防抖
    'params.keyword': _.debounce(function() {
      // console.log(this.params.keyword)
      // 重置页码值
      this.params.page = 1
      // 2.获取最新的数据
      this.getEmployeeList()
    }, 300)
  },
  async created() {
    this.getTreeData() // 获取左边数

    // const res = await this.delFn()
    // console.log(res)
  },
  methods: {
    async getTreeData() {
      const res = await getDepartListApi()
      this.treeData = transList2Tree(res, 0)
      this.params.departmentId = this.treeData[0].id // 获取传智教育的id
      // 数据渲染完毕后 就默认选中第一个节点
      this.$nextTick(() => {
        this.$refs.treeDom.setCurrentKey(this.params.departmentId) // 传智教育的id为 1
      })

      // 最后去获取右边表
      this.getEmployeeList()// 获取右边表
    },
    async  getEmployeeList() {
      this.loading = true
      const res = await getEmployeeListApi(this.params)
      this.total = res.total
      this.tableData = res.rows
      this.loading = false
    },
    handleCurrentChange(page) {
      // 将点击的页码赋值
      this.params.page = page
      // 获取最新的页码数据
      this.getEmployeeList()
    },
    selectTreeId(data) {
      // 1.获取选中节点的id
      this.params.departmentId = data.id
      // 重置页码值
      this.params.page = 1
      // 2.获取最新的数据
      this.getEmployeeList()
    },
    searchFn() {
      // 重置页码值
      this.params.page = 1
      // 2.获取最新的数据
      this.getEmployeeList()
    },
    async downLoadExcel() {
      const Blob = await downloadExcelApi()
      const fileName = Math.floor(Math.random() * 10)
      // 将Blob二进制转存为xlsx文件
      FileSave.saveAs(Blob, `员工信息表-${fileName}.xlsx`)
    },
    async delFn(id) {
      // async 修饰的函数是个异步函数 他的返回值是Promise对象
      await delEmployeeByIdApi(id)
      this.$message.success('删除员工成功')
      if (this.tableData.length === 1 && this.params.page > 1) {
        this.params.page--
      }
      // 重新获取数据
      this.getEmployeeList()
    },
    async  openDialog(id) { // 显示分配角色的弹窗的时候就需要获取角色列表
      this.currentRoleId = id
      // 1.获取可用的角色列表
      this.RoleList = await getEnableRoleListApi()
      // 2.根据id获取员工已有的角色
      const { roleIds } = await getEmployeeInfoByIdApi(id)
      // 3.回显角色
      this.roleIds = roleIds
      // 4.最后显示弹窗
      this.isShowRole = true
    },
    async submitRole() {
      // 1.修改员工的角色
      await assginRoleApi({
        id: this.currentRoleId,
        roleIds: this.roleIds
      })
      // 2.给出成功的提示
      this.$message.success('分配员工角色成功')
      // 3.关闭弹窗
      this.isShowRole = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }

}

</style>
