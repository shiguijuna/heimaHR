<template>
  <div class="container">
    <div class="app-container">
      <!-- 添加权限的按钮 -->
      <el-button style="margin-bottom: 20px;" type="primary" size="mini" @click="openDialog(1,0)">添加权限</el-button>
      <!-- 权限表格
        row-key="id" 表格唯一的标识
      -->
      <el-table
        default-expand-all
        row-key="id"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="code"
          label="标识"
          align="center"
        />
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        />
        <el-table-column
          label="操作"
        >
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="openDialog(2,row.id)">添加</el-button>
            <el-button type="text" @click="editDialog(row.id)">编辑</el-button>
            <el-button type="text" @click="delFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddPerm ref="addPerm" :type="type" :pid="pid" :is-show.sync="isShow" @permSuccess="getRermList" />
  </div>
</template>
<script>
import AddPerm from './components/add-perm'
import { getRermListApi, delPermByIdApi } from '@/api/permission'
import { transList2Tree } from '@/utils'
export default {
  name: 'Permission',
  components: { AddPerm },
  data() {
    return {
      tableData: [],
      isShow: false,
      type: null,
      pid: null
    }
  },
  created() {
    this.getRermList()
  },
  methods: {
    // 获取权限列表并展示出来
    async getRermList() {
      // 将list转为tree形数据
      this.tableData = transList2Tree(await getRermListApi(), 0)
      console.log(this.tableData)
    },
    openDialog(type, pid) {
      this.type = type
      this.pid = pid
      this.isShow = true
    },
    editDialog(id) {
      // 1.存储id
      this.pid = id
      this.$nextTick(async() => {
        // 调用子组件获取权限的详情
        await this.$refs.addPerm.getPermInfo()
        // 3.显示弹窗
        this.isShow = true
      })
    },
    delFn(id) {
      this.$confirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1发送请求实现删除
        await delPermByIdApi(id)
        // 2.给出提示
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 3.实现页面的刷新
        this.getRermList()
      }).catch()
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 20px;
  .app-container{
    padding: 20px;
  }

}
</style>
