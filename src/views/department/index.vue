<template>
  <div class="container">
    <div class="app-container">
      <!-- el-tree树形结构组件
       :data = 数据来源
       :props= 配置项
        poprs详解:
         lable:数据来源中的对象的属性
         chiilren:数据来源中的对象的属性 代表是否有子节点
       @node-click = 节点被点击时的回调

       :expand-on-click-node="false"  不折叠树
      -->
      <el-tree v-loading="loading" :expand-on-click-node="false" default-expand-all :data="treeData" :props="defaultProps">
        <!-- 放插槽 v-slot必须由template包裹  淘汰了 slot-scope="{ node, data }"
        node tree节点里面的数据
        data 数据源中数据对象
        -->
        <template v-slot="{node,data}">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col> {{ data.name }}</el-col>
            <el-col :span="5">
              <span class="tree-name">{{ data.managerName }}</span>
              <!-- $event 默认参数 -->
              <el-dropdown trigger="click" @command="openDialog($event,data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>

      </el-tree>
    </div>
    <!-- 弹框组件  sync实现父子组件数据的双向绑定-->
    <AddDept ref="addDept" :show-dialog.sync="isShow" :pid="pid" @updateList="getDepartList" />
  </div>
</template>
<script>
import AddDept from './components/add-dept'
import { getDepartListApi, delDepartByIdApi } from '@/api/department'
import { transList2Tree } from '@/utils'
export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      loading: true,
      pid: null,
      isShow: false,
      treeData: [], // 树形结构的数据来源
      defaultProps: { // 默认的配置详情
        children: 'children', // 代表是否有子节点
        label: 'name' // 界面的名字 具体是对象中的那个属性
      }
    }
  },
  async created() {
    this.getDepartList()
  },
  methods: {
    // 获取部门列表数据
    async getDepartList() {
      this.loading = true
      const res = await getDepartListApi()
      this.treeData = transList2Tree(res, 0)
      this.loading = false
    },
    openDialog(type, id) {
      if (type === 'add') {
        // 显示添加的弹框
        this.pid = id
        this.isShow = true
      } else if (type === 'edit') {
        // 是编辑
        // vue的更新是异步的
        this.pid = id
        this.$nextTick(() => {
          // 父组件调用子组件的方法
          this.$refs.addDept.getDepartInfo()
          this.isShow = true
        })
      } else if (type === 'del') {
        // 删除
        // 1.给出提示框
        this.$confirm('您确认要删除该部门吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 2.发送请求
          await delDepartByIdApi(id)
          // 3.给出成功的提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 4.重新刷新页面
          this.getDepartList()
        }).catch()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
  .tree-name{
    width: 50px;
    display: inline-block;
    margin:10px 40px
  }
}
</style>
