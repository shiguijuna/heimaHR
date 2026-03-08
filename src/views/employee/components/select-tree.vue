<template>
  <!-- element-ui级联组件 -->
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="selectId"
  />
</template>
<script>
import { getDepartListApi } from '@/api/department'
import { transList2Tree } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      props: {
        label: 'name', // 要展示的字段
        value: 'id', // 要存储的字段
        checkStrictly: true // 是否严格的遵守父子节点不互相关联
      }
    }
  },
  created() {
    // 获取级联组件数据
    this.getTreeData()
  },
  methods: {
    // 获取级联组件数据
    async getTreeData() {
      const res = await getDepartListApi()
      this.treeData = transList2Tree(res, 0)
    },
    selectId(arr) {
    // 需要子组件去更新父组件的数据
    // 但是只需要数组中的最后一个就可以了
      if (arr.length > 0) {
        this.$emit('input', arr[arr.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>
