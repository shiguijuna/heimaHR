<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <!-- <Test /> -->
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadFile"
        >
        <!--
          dragover 按住不松开 在触发区域触发事件
          drop  鼠标松开触发
         -->
        <div class="drop" @dragover="dragoverFn" @drop="dropFn">
          <i class="el-icon-upload" />
          <el-button type="text" @click="downLoadTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="openSelectFile">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { downLoadTemplateApi, uploadExcelApi } from '@/api/employee'
import FileSave from 'file-saver'
export default {

  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 下载员工模板
    async  downLoadTemplate() {
      const Blob = await downLoadTemplateApi()
      FileSave.saveAs(Blob, '员工模板.xlsx')
    },
    // 打开文件选择框
    openSelectFile() {
      // 让文件选择框自调用click
      this.$refs['excel-upload-input'].click()
    },
    // 实现文件的上传
    async uploadFile(e) {
      // 如何获取要上传的文件
      // console.dir(e.target.files)
      // 判断是否选择了文件
      const files = e.target.files
      if (files.length > 0) { // 已经选择了文件
      // 1.收集数据
        const fd = new FormData()
        fd.append('file', files[0]) // fd.append('key',value)
        try {
        // 2.上传
          await uploadExcelApi(fd)
          // 3.给出成功的提示
          this.$message.success('上传Excel成功')
          // 4.刷新最新的数据
          this.$emit('uploadSuccess')
          // 5.关闭弹框
          this.$emit('update:showExcelDialog', false)
          // this.$refs['excel-upload-input'].value = ''
        } catch (error) {
          // this.$refs['excel-upload-input'].value = ''
        } finally {
          // 重置文件选择框的内容
          this.$refs['excel-upload-input'].value = ''
        }
      }
    },
    dragoverFn(e) {
    // 阻止默认行为
      e.preventDefault()
      e.stopPropagation()
    },
    async dropFn(e) {
      e.preventDefault()
      const files = e.dataTransfer.files
      // 1.判断是否选择了文件
      if (files.length > 0) {
      // 2.限制一下长传文件的数据类型
        const reg = /\.(xlsx|xls)$/
        if (!reg.test(files[0].name)) return this.$message.warning('文件格式不正确,请上传Excel表格')
        // 1.收集数据
        const fd = new FormData()
        fd.append('file', files[0]) // fd.append('key',value)
        // 2.上传
        await uploadExcelApi(fd)
        // 3.给出成功的提示
        this.$message.success('上传Excel成功')
        // 4.刷新最新的数据
        this.$emit('uploadSuccess')
        // 5.关闭弹框
        this.$emit('update:showExcelDialog', false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>
